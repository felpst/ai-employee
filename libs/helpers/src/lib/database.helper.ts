import mongoose from "mongoose";

class DatabaseHelper {
  public static async connect(): Promise<void> {
    try {
      console.log("Mongo URL:", process.env.MONGO_URL);
      await mongoose.connect(process.env.MONGO_URL, {});
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }
}

export default DatabaseHelper;