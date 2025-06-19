"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }), // send raw password
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Sign up failed");
        setLoading(false);
        return;
      }
      // Show success toast
      if (typeof window !== "undefined" && window.toast) {
        window.toast.success("Account created! Signing you in...");
      }
      await signIn("credentials", { email, password, redirect: false });
      router.push("/");
    } catch (err) {
      setError("Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded font-semibold" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Already have an account? <a href="/auth/signin" className="text-purple-700 hover:underline">Sign in</a>
      </p>
    </div>
  );
}

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
