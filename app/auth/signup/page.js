"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

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
      router.push("/dashboard");
    } catch (err) {
      setError("Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-gradient-to-br from-purple-50 via-white to-purple-100 rounded-2xl shadow-2xl border border-purple-100">
      <h1 className="text-3xl font-extrabold mb-6 text-purple-800 drop-shadow-sm text-center">
        Sign Up
      </h1>
      <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-xl text-sm">
        <b>Note:</b> Currently, the sign up system does <u>not</u> verify if
        your email is real. Email verification is coming soon!
      </div>
      <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-xl text-sm">
        <b>Tip:</b> If you sign up with email/password and later try to log in
        with Google using the same email, you may get an "Account not linked"
        error. To use both, sign in with your password, then link your Google
        account from your account page (feature coming soon).
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-base shadow-sm"
          required
          aria-label="Name"
          autoComplete="name"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-base shadow-sm"
          required
          aria-label="Email"
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-base shadow-sm"
          required
          aria-label="Password"
          autoComplete="new-password"
        />
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          disabled={loading}
          aria-busy={loading}
          aria-label="Sign Up"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white inline"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link
          href="/auth/signin"
          className="text-purple-700 hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
          tabIndex={0}
          aria-label="Go to sign in page"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ message: "Missing fields" }),
        { status: 400 }
      );
    }
    // Check if user exists
    const existing = await getUserByEmail(email);
    if (existing) {
      return new Response(
        JSON.stringify({ message: "User already exists" }),
        { status: 409 }
      );
    }
    const hashed = await bcrypt.hash(password, 10);
    await createUser({ email, password: hashed, name });
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Sign up failed" }),
      { status: 500 }
    );
  }
}
