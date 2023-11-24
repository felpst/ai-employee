import mongoose from "mongoose";

class DatabaseHelper {
  public static async connect(mongoURL: string): Promise<void> {
    try {
      await mongoose.connect(mongoURL, {});
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log("Disconnected to MongoDB");
    } catch (error) {
      console.error("Error disconnecting to MongoDB:", error);
      throw error;
    }
  }
}

export default DatabaseHelper;
