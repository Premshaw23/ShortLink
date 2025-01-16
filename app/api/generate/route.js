// import { NextResponse } from "next/server";
// import { nanoid } from "nanoid";
// import connectDb from "../../../lib/mongoose";
// import Url from "../../../models/Url";

// export async function POST(request) {
//   const { originalUrl, customShortened } = await request.json();

//   if (!originalUrl || !/^https?:\/\//.test(originalUrl)) {
//     return NextResponse.json(
//       { message: "Invalid URL format." },
//       { status: 400 }
//     );
//   }
  
//   await connectDb();

//   let shortened = customShortened;

//   // If no custom shortened URL is provided, generate a random one
//   if (!customShortened) {
//     shortened = nanoid(8);
//   } else {
//     const existingUrl = await Url.findOne({ shortenedUrl: customShortened });
//     // console.log(existingUrl);
//     if (existingUrl) {
//       return NextResponse.json(
//         { message: "Custom alias already exists." },
//         { status: 400 }
//       );
//     }
//   }

//   const newUrl = new Url({
//     originalUrl,
//     shortenedUrl: shortened,
//   });

//   await newUrl.save();

//   const shortenedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/s/${shortened}`;

//   return NextResponse.json({ shortenedUrl });
// }
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import connectDb from "../../../lib/mongodb"; // Updated connection file
import { createUrl, findUrlByShortened } from "../../../models/Url"; // Updated URL model functions

export async function POST(request) {
  try {
    const { originalUrl, customShortened } = await request.json();

    if (!originalUrl || !/^https?:\/\//.test(originalUrl)) {
      return NextResponse.json(
        { message: "Invalid URL format." },
        { status: 400 }
      );
    }

    const db = await connectDb(); // Ensure connection is established

    let shortened = customShortened || nanoid(8); // Generate if not provided

    // Check if custom alias already exists
    if (customShortened) {
      const existingUrl = await findUrlByShortened(shortened);
      if (existingUrl) {
        return NextResponse.json(
          { message: "Custom alias already exists." },
          { status: 400 }
        );
      }
    }

    // Store URL in database
    const insertedId = await createUrl(originalUrl, shortened);

    const shortenedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/s/${shortened}`;

    return NextResponse.json({ shortenedUrl, id: insertedId });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred while shortening the URL." },
      { status: 500 }
    );
  }
}
