import { redirect } from "next/navigation";
import connectDb from "@/lib/mongodb";

export async function generateMetadata({ params }) {
  const { shortend } = params;

  // Connect to the database
  const db = await connectDb();
  const urls = db.collection("urls");

  // Find the URL corresponding to the shortened identifier
  const url = await urls.findOne({ shortenedUrl: shortend });

  if (url) {
    return redirect(url.originalUrl);
  } else {
    return redirect(process.env.BASE_URL); // fallback if not found
  }
}

export default function ShortenedPage() {
  return null; // Redirect happens in metadata
}
