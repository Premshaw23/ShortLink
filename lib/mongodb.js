import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
let db;

const connectDb = async () => {
  if (!db) {
    try {
      await client.connect();
      db = client.db(); // Uses the DB from the URI
      console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
      console.error("❌ MongoDB Connection Error:", error);
      process.exit(1);
    }
  }
  return db;
};

export default connectDb;
