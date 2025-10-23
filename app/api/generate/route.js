import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import connectDb from "../../../lib/mongodb";
import { createUrl, findUrlByShortened } from "../../../models/Url";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

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

    let expiresAt = null;
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch {}

    if (!session?.user?.email) {
      // Anonymous: always expire in 1 day, ignore user-provided expiration
      expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
      if (expirationDateTime) {
        return NextResponse.json(
          { message: "Sign in to set a custom expiration date/time." },
          { status: 401 }
        );
      }
    } else if (expirationDateTime) {
      // User provided custom expiration
      expiresAt = new Date(expirationDateTime);

      // Validate the date
      if (isNaN(expiresAt.getTime())) {
        return NextResponse.json(
          { message: "Invalid expiration date/time format." },
          { status: 400 }
        );
      }

      // Check if date is in the future (with 1 minute buffer to avoid timing issues)
      const now = new Date();
      if (expiresAt.getTime() <= now.getTime()) {
        return NextResponse.json(
          { message: "Expiration date/time must be in the future." },
          { status: 400 }
        );
      }
    } else {
      // Logged in, default to 7 days
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    // Check for duplicate alias globally
    const existingUrl = await findUrlByShortened(shortened);
    if (existingUrl) {
      return NextResponse.json(
        { message: "Short link already exists. Try a different alias." },
        { status: 400 }
      );
    }

    const owner = session?.user?.email || null;

    // Insert to DB - make sure expiresAt is passed correctly
    const inserted = await createUrl(
      normalizedUrl,
      shortened,
      expiresAt, // Changed from expireAt to expiresAt
      password,
      owner
    );

    if (!inserted.success) {
      return NextResponse.json(
        { message: inserted.message },
        { status: inserted.status || 500 }
      );
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
