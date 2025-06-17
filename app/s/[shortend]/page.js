import { redirect, notFound } from "next/navigation";
import connectDb from "@/lib/mongodb";

export default async function ShortenedPage({ params }) {
  const { shortend } = await params;

  const db = await connectDb();
  const urls = db.collection("urls");

  const url = await urls.findOne({ shortenedUrl: shortend });

  if (!url) {
    notFound(); // Custom 404 if not found
  }

  const now = new Date();

  // Check expiration
  if (url.expiresAt && url.expiresAt < now) {
    redirect("/expired"); // Optional: create an "expired" info page
  }

  // Track click
  await urls.updateOne({ shortenedUrl: shortend }, { $inc: { clicks: 1 } });

  // Redirect to original URL
  redirect(url.originalUrl);
}
