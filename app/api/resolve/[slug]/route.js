import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDb from "@/lib/mongodb";

export async function GET(req, { params }) {
  const { slug } = await params;

  // Extract IP from request
  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const db = await connectDb();
  const collection = db.collection("urls");

  const link = await collection.findOne({ shortenedUrl: slug });

  if (!link) {
    return NextResponse.json({ message: "Link not found" }, { status: 404 });
  }

  // Check expiration
  if (link.expiresAt) {
    const expirationDate = new Date(link.expiresAt);
    const now = new Date();

    if (expirationDate <= now) {
      return NextResponse.json({ message: "Link expired" }, { status: 410 });
    }
  }

  if (link.password) {
    return NextResponse.json({
      passwordProtected: true,
      originalUrl: null,
    });
  } else {
    await collection.updateOne(
      { _id: link._id },
      {
        $inc: { clicks: 1 },
        $push: {
          clickLogs: {
            $each: [
              {
                timestamp: new Date(),
                ip,
                userAgent: req.headers.get("user-agent") || "unknown",
              },
            ],
            $slice: -100,
          },
        },
      }
    );

    return NextResponse.json({
      passwordProtected: false,
      originalUrl: link.originalUrl,
    });
  }
}

export async function POST(req, { params }) {
  const { slug } = await params;

  // Extract IP from request - FIXED: Uncommented and improved
  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { password } = await req.json();

  if (!password) {
    return NextResponse.json(
      { message: "Password is required" },
      { status: 400 }
    );
  }

  const db = await connectDb();
  const collection = db.collection("urls");

  const link = await collection.findOne({ shortenedUrl: slug });

  if (!link) {
    return NextResponse.json({ message: "Link not found" }, { status: 404 });
  }

  // Check expiration
  if (link.expiresAt) {
    const expirationDate = new Date(link.expiresAt);
    const now = new Date();

    if (expirationDate <= now) {
      return NextResponse.json({ message: "Link expired" }, { status: 410 });
    }
  }

  if (!link.password) {
    return NextResponse.json(
      { message: "This link is not password protected" },
      { status: 400 }
    );
  }

  const isMatch = await bcrypt.compare(password, link.password);

  if (!isMatch) {
    return NextResponse.json(
      { message: "Incorrect password" },
      { status: 401 }
    );
  }

  await collection.updateOne(
    { _id: link._id },
    {
      $inc: { clicks: 1 },
      $push: {
        clickLogs: {
          $each: [
            {
              timestamp: new Date(),
              ip,
              userAgent: req.headers.get("user-agent") || "unknown",
            },
          ],
          $slice: -100,
        },
      },
    }
  );

  return NextResponse.json({ originalUrl: link.originalUrl });
}
