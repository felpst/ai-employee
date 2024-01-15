import 'dotenv/config';
import express from 'express';
// import { LinkedinTest } from './tests/web-browser/linkedin';
import { DatabaseHelper } from '@cognum/helpers';
import { AIELinkedIn } from './tests/web-browser/aie-linkedin';
<<<<<<< HEAD
import { ExecutorTest } from './tests/web-browser/executor';
=======
// import { FindElementTest } from './tests/web-browser/find-element';
import { XandrExtractData } from './tests/web-browser/xandr';
>>>>>>> bc675313c140d7e70e2f79de1535c6a97d133a1d

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
      // await new LinkedinTest().execute()
      // await new XandrExtractData().execute()
      try {
<<<<<<< HEAD
        // await new AIELinkedIn().execute();
        await new ExecutorTest().execute();
=======
        await new AIELinkedIn().execute()
>>>>>>> bc675313c140d7e70e2f79de1535c6a97d133a1d
      } catch (error) {
        console.error(error.message);
      }
      console.log('END TEST');

    });
  })
  .catch((error) => {
    // Database connection failed, log the error and exit the application
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });


