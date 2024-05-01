import { json2csv } from 'json-2-csv';
import pLimit from 'p-limit';
import zeplin from './zeplin';

const getProjectScreens = async (projectId) => {
  let hasMoreData = true;

  const fetchData = async (offset = 0, limit = 15) => {
    const { data } = await zeplin.screens.getProjectScreens(projectId, { offset, limit });
    return data;
  };

  const fetchAllPages = async () => {
    const result = [];

    let offset = 0;
    const limit = 15;

    while (hasMoreData) {
      const data = await fetchData(offset, limit);
      result.push(data);
      offset += limit;

      if (data.length === 0) {
        hasMoreData = false;
      }
    }

    return result;
  };

  const pagesData = await fetchAllPages();
  const allScreens = pagesData.flat();
  const screensWithNotes = allScreens.filter((screen) => screen.numberOfNotes > 0);
  const totalNumberOfNotes = allScreens.reduce((total, item) => total + item.numberOfNotes, 0);
  console.log(`${allScreens.length} screens scanned. ${totalNumberOfNotes} notes found in ${screensWithNotes.length} screens`);
  return screensWithNotes;
};

const getProjectName = async (projectId) => {
  const { data: { name } } = await zeplin.projects.getProject(projectId);
  return name;
};

const getSingleScreenNotes = async (screen, projectId, projectName) => {
  const { id, name: screenName } = screen;
  const { data } = await zeplin.screens.getScreenNotes(projectId, id);

  const parsedData = data.map((note) => {
    const flattenedComments = {};
    let index = 1;

    while (index < note.comments.length) {
      const comment = note.comments[index];
      const commentDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(comment.updated * 1000));
      const commentIndex = index > 0 ? index : '';
      flattenedComments[`comment ${commentIndex} author`] = comment.author.username;
      flattenedComments[`comment ${index} text`] = comment.content;
      flattenedComments[`comment ${index} updated`] = commentDate;
      index++;
    }

    const link = `https://app.zeplin.io/project/${projectId}/screen/${id}`;

    return {
      project: projectName,
      screen: screenName,
      url: link,
      status: note.status,
      date: new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(note.created * 1000)),
      'note author': note.creator.username,
      'note text': note.comments.length > 0 ? note.comments[0].content : '',
      ...flattenedComments,
    };
  });

  return parsedData;
};

const generateProjectNotes = async (projectId) => {
  const projectScreens = await getProjectScreens(projectId);
  const projectName = await getProjectName(projectId);
  const limit = pLimit(10);

  const notes = (await Promise.all(projectScreens.map(
    async (screen) => limit(() => getSingleScreenNotes(screen, projectId, projectName)),
  ))).flat();

  if (!notes || notes.length === 0) {
    throw new Error('No annotations found for the project.');
  }

  const fields = Object.keys(notes[0]);

  const csv = json2csv(notes, { fields });
  return csv;
};

export default generateProjectNotes;
