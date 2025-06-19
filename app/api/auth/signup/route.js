import { createUser, getUserByEmail } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password || !name) {
      return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
    }
    // Check if user exists
    const existing = await getUserByEmail(email);
    if (existing) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 409 });
    }
    const hashed = await bcrypt.hash(password, 10);
    await createUser({ email, password: hashed, name });
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Sign up failed" }), { status: 500 });
  }
}
