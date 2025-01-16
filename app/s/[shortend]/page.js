import { redirect } from "next/navigation";
import connectDb from "@/lib/mongodb";
import Url from "@/models/Url";
// This will handle the redirect when someone visits a shortened URL
export async function generateMetadata({ params }) {
  const { shortend } = await params;
  // console.log(params);
  // Connect to the database
  await connectDb();
  console.log("done");

  // Find the URL corresponding to the shortened identifier
  const url = await Url.findOne({ shortenedUrl: shortend });
  console.log(url);
  if (url) {
    // Redirect to the original URL if found
    return redirect(url.originalUrl);
  } else {
    // Handle case where shortened URL doesn't exist
    return redirect(process.env.BASE_URL);
  }
}

export default function ShortenedPage() {
  return null; // No need to render anything as the redirection happens in `generateMetadata`
}
