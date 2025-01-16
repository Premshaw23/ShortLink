// import { NextResponse } from "next/server";
// // import Url from "../../../models/Url";
// import connectDb from "../../../lib/mongodb";
// import { findUrlByShortened, createUrl } from "@/models/Url";

// // Connect to the database before handling requests
// export async function GET() {
//   await connectDb();

//   try {
//     const urls = await Url.find({});
//     return NextResponse.json([...urls]);
//   } catch (error) {
//     return NextResponse.json({ error: "Error fetching URLs" }, { status: 500 });
//   }
// }
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
