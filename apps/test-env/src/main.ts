import 'dotenv/config';
import express from 'express';
import { LinkedinTest } from './tests/web-browser/linkedin';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, async () => {
  console.log(`[ ready ] http://${host}:${port}`);

  // await new FindElementTest().execute()
  await new LinkedinTest().execute()
  console.log('END TEST');

});
