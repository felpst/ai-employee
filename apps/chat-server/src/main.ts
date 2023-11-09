import { DatabaseHelper } from "@cognum/helpers";
import { ChatServer } from "./chat-server";

// Initialize database connection
DatabaseHelper.connect()
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
