import { NextResponse } from "next/server";
import connectDb from "../../../lib/mongodb";
import { getAllUrls } from "@/models/Url";
export async function GET() {
  try {
    await connectDb(); // Ensure database connection

    const urls = await getAllUrls(); // Fetch all URLs

    return NextResponse.json(urls);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return NextResponse.json({ error: "Error fetching URLs" }, { status: 500 });
  }
}
