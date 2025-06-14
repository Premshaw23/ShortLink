// No Mongoose needed
import connectDb from "../lib/mongodb";

const getUrlCollection = async () => {
  const db = await connectDb();
  return db.collection("urls");
};

export const createUrl = async (originalUrl, shortenedUrl) => {
  const urls = await getUrlCollection();
  const result = await urls.insertOne({ originalUrl, shortenedUrl });
  return result.insertedId;
};

export const getAllUrls = async () => {
  const urls = await getUrlCollection();
  return await urls.find({}).toArray();
};

export const findUrlByShortened = async (shortenedUrl) => {
  const urls = await getUrlCollection();
  return await urls.findOne({ shortenedUrl });
};
