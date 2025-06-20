import bcrypt from "bcryptjs";
import connectDb from "../lib/mongodb";

const getUrlCollection = async () => {
  const db = await connectDb();
  // Ensure global unique slug (alias)
  await db
    .collection("urls")
    .createIndex({ shortenedUrl: 1 }, { unique: true });
  return db.collection("urls");
};

// ✅ Create a new shortened URL
export const createUrl = async (
  originalUrl,
  shortenedUrl,
  expiresAt,
  password = null,
  owner = null
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
      clicks: 0,
      clickLogs: [],
      owner: owner || null,
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

// Find a single URL by shortened slug for a specific user (or anonymous)
export const findUserUrlByShortened = async (shortenedUrl, owner) => {
  const urls = await getUrlCollection();
  return await urls.findOne({
    shortenedUrl,
    owner: owner || null,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } },
    ],
  });
};

// ✅ Increment click count for analytics
export const incrementClickCount = async (shortenedUrl, logData = null) => {
  const urls = await getUrlCollection();

  const update = {
    $inc: { clicks: 1 },
  };

  if (logData) {
    update.$push = {
      clickLogs: {
        $each: [logData],
        $slice: -100, // Optional: keep last 100 entries
      },
    };
  }

  await urls.updateOne({ shortenedUrl }, update);
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

// ✅ Get URLs for a specific user
export const getUserUrls = async (userId) => {
  const urls = await getUrlCollection();
  return await urls.find({ owner: userId }).sort({ createdAt: -1 }).toArray();
};
