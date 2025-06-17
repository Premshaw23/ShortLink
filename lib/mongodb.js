
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
let db;

const connectDb = async () => {
  if (!db) {
    try {
      await client.connect();
      db = client.db("shortLink"); // Change to your actual DB name
      console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
      console.error("❌ MongoDB Connection Error:", error);
      process.exit(1);
    }
  }
  return db;
};

export default connectDb;
