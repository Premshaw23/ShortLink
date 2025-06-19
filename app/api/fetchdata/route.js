import { NextResponse } from "next/server";
import connectDb from "../../../lib/mongodb";
import { getAllUrls, getUserUrls } from "@/models/Url";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectDb(); // Ensure database connection
    const session = await getServerSession(authOptions);
    let urls;
    if (session && session.user?.email) {
      // Show only user's links if logged in
      urls = await getUserUrls(session.user.email);
    } else {
      // Show only anonymous links (owner: null)
      urls = await getAllUrls();
      urls = urls.filter((url) => !url.owner);
    }
    return NextResponse.json(urls);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return NextResponse.json({ error: "Error fetching URLs" }, { status: 500 });
  }
}
