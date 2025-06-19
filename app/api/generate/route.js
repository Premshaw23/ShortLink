import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import connectDb from "../../../lib/mongodb";
import { createUrl, findUrlByShortened } from "../../../models/Url";

// Helper to normalize URL
const normalizeUrl = (url) => {
  if (!/^https?:\/\//i.test(url)) {
    return "https://" + url;
  }
  return url;
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { originalUrl, customShortened, expirationDateTime, password } = body;

    if (!originalUrl) {
      return NextResponse.json(
        { message: "URL is required." },
        { status: 400 }
      );
    }

    const normalizedUrl = normalizeUrl(originalUrl);
    const db = await connectDb();

    const shortened = customShortened || nanoid(8);

    // Check for duplicate custom alias
    const existingUrl = await findUrlByShortened(shortened);
    if (existingUrl) {
      return NextResponse.json(
        { message: "Short link already exists. Try a different alias." },
        { status: 400 }
      );
    }

    let expireAt = null;
    if (expirationDateTime) {
      expireAt = new Date(expirationDateTime);
      if (isNaN(expireAt.getTime()) || expireAt < new Date()) {
        return NextResponse.json(
          { message: "Expiration date/time must be in the future." },
          { status: 400 }
        );
      }
    } else {
      // fallback: 7 days from now
      expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    // Insert to DB
    const inserted = await createUrl(normalizedUrl, shortened, expireAt, password);
    if (!inserted.success) {
      return NextResponse.json({ message: inserted.message }, { status: inserted.status || 500 });
    }

    const shortenedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/s/${shortened}`;

    return NextResponse.json({ shortenedUrl, id: inserted.id });
  } catch (error) {
    console.error("Shorten Error:", error);
    return NextResponse.json(
      { message: "An error occurred while shortening the URL." },
      { status: 500 }
    );
  }
}
