import { ZeplinApi, Configuration } from '@zeplin/sdk';
import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import { json2csv } from 'json-2-csv';

// use Commander to take in options from the command line

// Zeplin API rate limit is 200 requests per user per minute.
// Use rateLimit to extend Axios to only make 100 requests per minute (60,000ms)
const http = rateLimit(axios.create(), { maxRequests: 180, perMilliseconds: 60000 });

// Instantiate zeplin with access token, add our http client to the zeplin

const zeplin = new ZeplinApi(
  new Configuration(
    { accessToken: localStorage.getItem('zeplinAccessToken') },
  ),
  undefined,
  http,
);
// get all project screens while handling pagination
const getProjectScreens = async (projectId, { offset = 0, limit = 15 } = {}) => {
  let allData = [];
  let hasMoreData = true;

  const fetchData = async (pageOffset) => {
    const { data } = await zeplin.screens
      .getProjectScreens(projectId, { offset: pageOffset, limit });
    return data;
  };

  const fetchAllPages = async () => {
    const result = [];

    while (hasMoreData) {
      const data = await fetchData(offset);
      result.push(data);
      offset += limit;

      // Update hasMoreData based on whether data was fetched
      if (data.length === 0) {
        hasMoreData = false;
      }
    }

    return result;
  };

  const pagesData = await fetchAllPages();
  // Flatten the array of arrays to a single array
  allData = pagesData.flat();
  return allData;
};

const getProjectName = async (projectId) => {
  const { data: { name } } = await zeplin.projects.getProject(projectId);
  return name;
};

// This function will be used when iterating through the list of project screens
const getSingleScreenAnnotations = async (screen, projectId, projectName) => {
  const { id, name: screenName } = screen;
  const { data } = await zeplin.screens
    .getScreenAnnotations(projectId, id);

  // format the data for the CSV
  const parsedData = data.map((item) => ({
    project: projectName, // Add your project name here
    screen: screenName, // Add your screen name here
    creator: item.creator.username,
    created: new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(item.created * 1000)),
    annotationType: item.type.name,
    content: item.content,
  }));

  return parsedData;
};

const generateProjectAnnotations = async (projectId) => {
  const projectScreens = await getProjectScreens(projectId);
  const projectName = await getProjectName(projectId);
  const annotations = (await Promise.all(projectScreens.map(
    async (screen) => getSingleScreenAnnotations(screen, projectId, projectName),
  ))).flat();

  if (!annotations || annotations.length === 0) {
    throw new Error('No annotations found for the project.');
  }
  // Get field names from the object keys for the annotation object we have created
  const fields = Object.keys(annotations[0]);

  // // Format the JSON data to CSV
  const csv = json2csv(annotations, { fields });
  return csv;
};

export default generateProjectAnnotations;
