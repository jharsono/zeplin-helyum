import { ZeplinApi, Configuration } from '@zeplin/sdk';
import axios from 'axios';
import JSZip from 'jszip';
import rateLimit from 'axios-rate-limit';
import pLimit from 'p-limit';

const http = rateLimit(axios.create(), { maxRequests: 180, perMilliseconds: 60000 });

const zeplin = new ZeplinApi(
  new Configuration({ accessToken: localStorage.getItem('zeplinAccessToken') }),
  undefined,
  http,
);

const getProjectScreens = async (projectId) => {
  const { data } = await zeplin.screens.getProjectScreens(projectId);
  return data;
};

const getAssetData = async (screen, projectId, formats) => {
  const { id, name } = screen;
  const { data } = await zeplin.screens.getLatestScreenVersion(projectId, id);
  return data.assets.flatMap(({ displayName, contents }) => {
    const filteredContents = contents.filter((content) => (
      formats.includes(content.format)
    ));
    return filteredContents.map(({ url, format, density }) => ({
      name,
      url,
      filename: `${displayName.replaceAll('/', '-')}-${density}x.${format}`,
    }));
  });
};

const downloadAsset = async ({ name, url, filename }, zip) => {
  try {
    const response = await axios.get(url, { responseType: 'blob' });
    const blob = response.data;
    zip.file(`${name}/${filename}`, blob);
  } catch (err) {
    console.log(`Error downloading ${name}`);
    console.log(err.config.url);
  }
};

const generateProjectAssets = async (projectId, formats = []) => {
  const projectScreens = await getProjectScreens(projectId);
  const assets = (await Promise.all(projectScreens.map(
    async (screen) => getAssetData(screen, projectId, formats)
  ))).flat();

  const limit = pLimit(20);

  const zip = new JSZip();
  const downloadAssetPromises = assets.map((asset) => (
    limit(() => downloadAsset(asset, zip))
  ));

  await Promise.all(downloadAssetPromises);

  const content = await zip.generateAsync({ type: 'blob' });

  return content;
};

export default generateProjectAssets;
