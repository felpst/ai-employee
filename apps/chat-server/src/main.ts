import { DatabaseHelper } from "@cognum/helpers";
import { ChatServer } from "./chat-server";

// Initialize database connection
<<<<<<< HEAD
DatabaseHelper.connect(process.env.MONGO_URL)
=======
DatabaseHelper.connect()
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
  .then(() => {
    // Database connection successful, start the server
    const chatServer = new ChatServer();
    chatServer.run();
  })
  .catch((error) => {
    // Database connection failed, log the error and exit the application
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
