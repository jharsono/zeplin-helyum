import { json2csv } from 'json-2-csv';
import zeplin from './zeplin';

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

      if (data.length === 0) {
        hasMoreData = false;
      }
    }

    return result;
  };

  const pagesData = await fetchAllPages();
  allData = pagesData.flat();
  return allData;
};

const getProjectName = async (projectId) => {
  const { data: { name } } = await zeplin.projects.getProject(projectId);
  return name;
};

const getSingleScreenAnnotations = async (screen, projectId, projectName) => {
  const { id, name: screenName } = screen;
  const { data } = await zeplin.screens
    .getScreenAnnotations(projectId, id);

  const parsedData = data.map((item) => ({
    project: projectName,
    screen: screenName,
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

  const fields = Object.keys(annotations[0]);
  const csv = json2csv(annotations, { fields });
  return csv;
};

export default generateProjectAnnotations;
