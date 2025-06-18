import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDb from "@/lib/mongodb";
import { ratelimit } from "@/lib/ratelimit";


export async function GET(req, { params }) {
  const { slug } = await params;
  // Extract IP from request
  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "unknown";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const db = await connectDb();
  const collection = db.collection("urls");

  const link = await collection.findOne({ shortenedUrl: slug });

  if (!link) {
    return NextResponse.json({ message: "Link not found" }, { status: 404 });
  }

  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    return NextResponse.json({ message: "Link expired" }, { status: 410 });
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
            $each: [{
              timestamp: new Date(),
              ip,
              userAgent: req.headers.get("user-agent") || "unknown",
            }],
            $slice: -100, // Optional: Keep only last 100 logs
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
  // Extract IP from request
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const { password } = await req.json();

  if (!password) {
    return NextResponse.json(
      { message: "Password is required" },
      { status: 400 }
    );
  }

  const db = await connectDb();
  const collection = db.collection("urls");

  const link = await collection.findOne({ shortenedUrl: slug }); // FIXED

  if (!link) {
    return NextResponse.json({ message: "Link not found" }, { status: 404 });
  }

  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    return NextResponse.json({ message: "Link expired" }, { status: 410 });
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
          $slice: -100, // Optional: Keep only last 100 logs
        },
      },
    }
  );
  

  return NextResponse.json({ originalUrl: link.originalUrl });
  
}
