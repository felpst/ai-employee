import { DatabaseHelper } from '@cognum/helpers';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import errorHandler from './middlewares/error.handler';
import router from './routes';

class App {
  private app: Application;
  private port: string;

  constructor(port: string) {
    this.app = express();
    this.port = port;
    this.configureMiddlewares();
    this.configureRoutes();
    this.handleNotFoundRoutes();
    this.handleErrors();
  }

  private configureMiddlewares(): void {
    this.app.use(express.json());
    const corsOptions = {
      origin: JSON.parse(process.env.CORS_ORIGIN || '[]'),
      credentials: true,
    };
    this.app.use(cors(corsOptions));
    this.app.use(cookieParser());
    this.app.use(express.raw({ type: 'image/*', limit: '10mb' }));
  }

  private configureRoutes(): void {
    this.app.use(router);
  }

  private handleNotFoundRoutes(): void {
    this.app.use((_req: Request, res: Response) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  private handleErrors(): void {
    this.app.use(errorHandler);
  }

  public start(): void {
    // Initialize database connection
    DatabaseHelper.connect(process.env.MONGO_URL)
      .then(() => {
        // Database connection successful, start the server
        this.app.listen(this.port, () => {
          console.log(`Server is running on port ${this.port}`);
        });
      })
      .catch((error) => {
        // Database connection failed, log the error and exit the application
        console.error('Failed to connect to the database:', error);
        process.exit(1);
      });
  }
}

const port: string = process.env.PORT;
const app = new App(port);
app.start();

export default app;
