// import mongoose from "mongoose";

// const connectDb = async () => {
//   if (mongoose.connections[0].readyState) {
//     return;
//   }

//   await mongoose.connect(process.env.MONGODB_URI);
// };

// export default connectDb;
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
let db;

const connectDb = async () => {
  if (!db) {
    try {
      await client.connect();
      db = client.db("your_database_name"); // Change to your actual DB name
      console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
      console.error("❌ MongoDB Connection Error:", error);
      process.exit(1);
    }
  }
  return db;
};

export default connectDb;
