import express, { Express, Request, Response, json } from 'express';
import ServerlessHttp from 'serverless-http';
import cors from 'cors';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

expand(config());

const app: Express = express();
const port = process.env.PORT || 3030;
const exactUrl = process.env.EXACT_URL;
const allowedHost = process.env.ALLOWED_HOST as string;
const parsedHost = JSON.parse(allowedHost);

const test_data = {
  ip: '142.250.176.14',
  location: { country: 'US', region: 'California', city: 'Los Angeles', lat: 34.05223, lng: -118.24368, postalCode: '90001', timezone: '-07:00', geonameId: 5368361 },
  domains: ['campuslondon.co.uk', 'google.co', 'unternehmen-beispiel.de', 'youtube.com.ua', '1337xxx.xyz'],
  as: { asn: 15169, name: 'GOOGLE', route: '142.250.176.0/24', domain: 'https://about.google/intl/en/', type: 'Content' },
  isp: 'Google LLC',
};

app.use(json());
app.use(
  cors({
    origin: function (origin, callback) {
      // disallow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) {
        const message = 'Someone just trying to access the API from browser!';
        return callback(new Error(message), false);
      }
      if (parsedHost.host.indexOf(origin) === -1) {
        const message = `Someone just trying to access the API from their website! The origins are ${origin}`;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

app.get('/lookup-ip', async (req: Request, res: Response) => {
  const ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const url = `${exactUrl}&ipAddress=${ipAddress}`;
  const response = await fetch(url);
  const data: { code: number } = await response.json();
  if (data.code) res.status(data.code);
  res.json(data);
});

app.get('/lookup-ip/ip/:ipAddress', async (req: Request, res: Response) => {
  const { ipAddress } = req.params;
  const url = `${exactUrl}&ipAddress=${ipAddress}`;
  const response = await fetch(url);
  const data: { code: number } = await response.json();
  if (data.code) res.status(data.code);
  res.json(data);
});

app.get('/lookup-ip/domain/:domain', async (req: Request, res: Response) => {
  const { domain } = req.params;
  const url = `${exactUrl}&domain=${domain}`;
  const response = await fetch(url);
  const data: { code: number } = await response.json();
  if (data.code) res.status(data.code);
  res.json(data);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running`);
});

export default ServerlessHttp(app);
