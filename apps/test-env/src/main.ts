import 'dotenv/config';
import express from 'express';
// import { LinkedinTest } from './tests/web-browser/linkedin';
import { DatabaseHelper } from '@cognum/helpers';
// import { AIELinkedIn } from './tests/web-browser/aie-linkedin';
// import { FindElementTest } from './tests/web-browser/find-element';
import { XandrExtractData } from './tests/web-browser/xandr';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

// Initialize database connection
DatabaseHelper.connect(process.env.MONGO_URL)
  .then(() => {
    // Database connection successful, start the server
    app.listen(port, host, async () => {
      console.log(`[ ready ] http://${host}:${port}`);

      // await new FindElementTest().execute()
      // await new AIELinkedIn().execute()
      // await new LinkedinTest().execute()
      try {
        await new XandrExtractData().execute()
      } catch (error) {
        console.error(error.message)
      }
      console.log('END TEST');

    });
  })
  .catch((error) => {
    // Database connection failed, log the error and exit the application
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });


