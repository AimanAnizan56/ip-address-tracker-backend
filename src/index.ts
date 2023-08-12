import express, { Express, Request, Response, json } from 'express';
import ServerlessHttp from 'serverless-http';
import cors from 'cors';
import 'dotenv/config';

const app: Express = express();
const port = process.env.PORT || 3030;
const apiKey = process.env.IPIFY_API_KEY;
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
        const message = 'The CORS policy for this site does not allow access with no Origin.';
        return callback(new Error(message), false);
      }
      if (allowedHost.indexOf(origin) === -1) {
        const message = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

app.get('/lookup-ip', (req: Request, res: Response) => {
  const ip = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log('ip', ip);
  res.json({
    ...test_data,
    IP_ADDRESS_TEST: ip,
  });
});

app.get('/lookup-ip/ip/:ip_address', (req: Request, res: Response) => {
  const ip = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log('ip', ip);
  res.json({
    ...test_data,
    IP_ADDRESS_TEST: ip,
  });
});

app.get('/lookup-ip/domain/:domain', (req: Request, res: Response) => {
  const ip = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log('ip', ip);
  res.json({
    ...test_data,
    IP_ADDRESS_TEST: ip,
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running`);
});

export default ServerlessHttp(app);
