import express from 'express';
import ViteExpress from 'vite-express';
import dotenv from 'dotenv';
import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import { ZeplinApi, Configuration } from '@zeplin/sdk';
import getWorkspaces from './src/services/getWorkspaces.js';
import getWorkspaceProjects from './src/services/getWorkspaceProjects.js';

dotenv.config();

const http = rateLimit(axios.create(), { maxRequests: 200, perMilliseconds: 60000 });
const { VITE_ZEPLIN_PERSONAL_ACCESS_TOKEN } = process.env;

const app = express();
// Initialize Zeplin API with access token from environment variable
const zeplin = new ZeplinApi(
  new Configuration(
    { accessToken: VITE_ZEPLIN_PERSONAL_ACCESS_TOKEN },
  ),
  undefined,
  http,
);

app.get('/api/v1/workspaces', async (req, res) => {
  try {
    // Access Zeplin organizations using the SDK with initialized zep client
    const data = await getWorkspaces(zeplin);
    res.json(data);
  } catch (error) {
    console.error('Error fetching Zeplin organizations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/v1/workspaces/:workspaceId/projects', async (req, res) => {
  const { workspaceId } = req.params;
  try {
    // Access Zeplin organizations using the SDK with initialized zep client
    const data = await getWorkspaceProjects(workspaceId, zeplin);
    res.json(data);
  } catch (error) {
    console.error('Error fetching Zeplin organizations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));