// import mongoose from "mongoose";

// const UrlSchema = new mongoose.Schema({
//   originalUrl: { type: String, required: true },
//   shortenedUrl: { type: String, required: true, unique: true },
// });

// export default mongoose.models.Url || mongoose.model("Url", UrlSchema);
import connectDb from "../lib/mongodb";

const getUrlCollection = async () => {
  const db = await connectDb();
  return db.collection("urls"); // Collection name
};

export const createUrl = async (originalUrl, shortenedUrl) => {
  const urls = await getUrlCollection();
  const result = await urls.insertOne({ originalUrl, shortenedUrl });
  return result.insertedId; // Return the inserted document ID
};
export const getAllUrls = async () => {
  const urls = await getUrlCollection();
  return await urls.find({}).toArray(); // Convert MongoDB cursor to array
};
export const findUrlByShortened = async (shortenedUrl) => {
  const urls = await getUrlCollection();
  return await urls.findOne({ shortenedUrl });
};
