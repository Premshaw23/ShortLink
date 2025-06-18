import bcrypt from "bcrypt";
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
  expiresAt,
  password = null
) => {
  const urls = await getUrlCollection();
  const now = new Date();
  let hashedPassword = null;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  try {
    const result = await urls.insertOne({
      originalUrl,
      shortenedUrl,
      createdAt: now,
      expiresAt,
      password: hashedPassword || null,
    });

    return { success: true, id: result.insertedId };
  } catch (err) {
    if (err.code === 11000) {
      return {
        success: false,
        message: "Shortened URL already exists. Choose a different slug.",
        status: 409,
      };
    }

    return {
      success: false,
      message: "Server error. Please try again.",
      status: 500,
    };
  }
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
