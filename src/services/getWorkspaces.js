import generateRefreshToken from './generateRefreshToken';
import zeplin from './zeplin';

const getWorkspaces = async () => {
  try {
    const workspaces = [];
    let data;
    let i = 0;
    do {
      // Must access this endpoint with await
      // eslint-disable-next-line no-await-in-loop
      ({ data } = await zeplin.organizations.getOrganizations({
        offset: i * 100,
        limit: 100,
      }));
      workspaces.push(...data);
      i += 1;
    } while (data.length === 100);
    return workspaces;
  } catch (error) {
    // generateRefreshToken(clientId, clientSecret);
    console.error('Error fetching workspaces:', error);

    throw error; // Optional: rethrow the error to propagate it to the caller
  }
};

export default getWorkspaces;
