import 'dotenv/config';
import express from 'express';
import { DatabaseHelper } from '@cognum/helpers';
import { AIELinkedIn } from './tests/web-browser/aie-linkedin';

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

      try {
        await new AIELinkedIn().execute();
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


