import { Configuration, ZeplinApi } from '@zeplin/sdk';
import rateLimit from 'axios-rate-limit';
import axios from 'axios';
import { getAccessToken } from './localStorage';

const http = rateLimit(axios.create(), { maxRequests: 180, perMilliseconds: 60000 });

const zeplin = new ZeplinApi(
  new Configuration(
    { accessToken: getAccessToken() }, // You need to invoke the getAccessToken function here
  ),
  undefined,
  http,
);

export default zeplin;
