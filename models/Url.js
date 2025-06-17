// No Mongoose needed
import connectDb from "../lib/mongodb";

// Helper to get collection
const getUrlCollection = async () => {
  const db = await connectDb();
  await db
    .collection("urls")
    .createIndex({ shortenedUrl: 1 }, { unique: true }); // Ensure unique slugs
  return db.collection("urls");
};

// ✅ Create a new shortened URL
export const createUrl = async (
  originalUrl,
  shortenedUrl,
  expireAt // now using specific date directly
) => {
  const urls = await getUrlCollection();
  const now = new Date();

  const result = await urls.insertOne({
    originalUrl,
    shortenedUrl,
    createdAt: now,
    expiresAt: expireAt, // use passed-in date directly
    clicks: 0,
  });

  return result.insertedId;
};


// ✅ Get all URLs (for admin/history)
export const getAllUrls = async () => {
  const urls = await getUrlCollection();
  return await urls.find({}).sort({ createdAt: -1 }).toArray();
};

// ✅ Find a single URL by shortened slug, excluding expired
export const findUrlByShortened = async (shortenedUrl) => {
  const urls = await getUrlCollection();
  return await urls.findOne({
    shortenedUrl,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } },
    ],
  });
};

// ✅ Increment click count for analytics
export const incrementClickCount = async (shortenedUrl) => {
  const urls = await getUrlCollection();
  await urls.updateOne({ shortenedUrl }, { $inc: { clicks: 1 } });
};

// ✅ Get paginated URLs (optional frontend use)
export const getUrlsPaginated = async (page = 1, limit = 10) => {
  const urls = await getUrlCollection();
  return await urls
    .find({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
};
