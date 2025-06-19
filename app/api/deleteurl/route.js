import { NextResponse } from "next/server";
import connectDb from "@/lib/mongodb";

export async function DELETE(req) {
  try {
    const { id, owner } = await req.json();
    if (!id || !owner) {
      return NextResponse.json({ message: "Missing id or owner" }, { status: 400 });
    }
    const db = await connectDb();
    const result = await db.collection("urls").deleteOne({ _id: new (await import('mongodb')).ObjectId(id), owner });
    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ message: "Not found or not authorized" }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}

export const getUserUrls = async (userId) => {
  const urls = await getUrlCollection();
  return await urls.find({ owner: userId }).sort({ createdAt: -1 }).map(u => ({ ...u, _id: u._id.toString() })).toArray();
};
