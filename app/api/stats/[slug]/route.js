import connectDb from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { slug } = await params;
  const db = await connectDb();
  const urls = db.collection("urls");

  try {
    const urlDoc = await urls.findOne({ shortenedUrl: slug });
    if (!urlDoc) {
      return NextResponse.json({ message: "URL not found" }, { status: 404 });
    }

    const totalClicks = urlDoc.clicks || 0;
    const passwordProtected = !!urlDoc.password;
    const logs = urlDoc.clickLogs || [];

    return NextResponse.json({
      totalClicks,
      passwordProtected,
      createdAt: urlDoc.createdAt,
      expiresAt: urlDoc.expiresAt || null,
      logs: logs.map((log) => ({
        timestamp: log.timestamp,
        ip: log.ip,
        userAgent: log.userAgent,
      })),
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    return NextResponse.json(
      { message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
