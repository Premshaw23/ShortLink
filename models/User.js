import { ObjectId } from "mongodb";
import connectDb from "@/lib/mongodb";

export async function getUserByEmail(email) {
  const db = await connectDb();
  const user = await db.collection("users").findOne({ email });
  return user;
}

export async function createUser({ email, password, name }) {
  const db = await connectDb();
  const result = await db.collection("users").insertOne({ email, password, name });
  return result.insertedId;
}

export async function getUserById(id) {
  const db = await connectDb();
  return db.collection("users").findOne({ _id: new ObjectId(id) });
}
