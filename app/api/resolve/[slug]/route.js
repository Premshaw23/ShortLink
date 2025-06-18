import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDb from "@/lib/mongodb";

export async function GET(req, { params }) {
  const { slug } = await params;
  const db = await connectDb();
  const collection = db.collection("urls");

  const link = await collection.findOne({ shortenedUrl: slug });

  if (!link) {
    return NextResponse.json({ message: "Link not found" }, { status: 404 });
  }

  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    return NextResponse.json({ message: "Link expired" }, { status: 410 });
  }

  return NextResponse.json({
    passwordProtected: !!link.password,
    originalUrl: link.password ? null : link.originalUrl,
  });
}

export async function POST(req, { params }) {
  const { slug } = await params;
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

  return NextResponse.json({ originalUrl: link.originalUrl });
}
