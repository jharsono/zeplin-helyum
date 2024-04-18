const getWorkspaceProjects = async (workspaceId, zeplin) => {
  try {
    const projects = [];
    let data;
    let i = 0;
    do {
      // Must access this endpoint with await
      // eslint-disable-next-line no-await-in-loop
      ({ data } = await zeplin.organizations.getOrganizationProjects(workspaceId, {
        offset: i * 100,
        limit: 100,
      }));
      projects.push(...data);
      i += 1;
    } while (data.length === 100);
    return projects;
  } catch (error) {
    console.error('Error fetching workspace projects:', error);
    throw error;
  }
};

export default getWorkspaceProjects;
