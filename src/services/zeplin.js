import { Configuration, ZeplinApi } from '@zeplin/sdk';
import rateLimit from 'axios-rate-limit';
import axios from 'axios';
import { getAccessToken } from './localStorage';

const http = rateLimit(axios.create(), { maxRequests: 180, perMilliseconds: 60000 });

export default new ZeplinApi(
  new Configuration(
    { accessToken: getAccessToken },
  ),
  undefined,
  http,
);
