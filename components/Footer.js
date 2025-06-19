import Link from "next/link";
import { Github, Sparkles, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-800 via-purple-900 to-indigo-900 text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left Section */}
        <div className="text-center md:text-left flex flex-col gap-2">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <Sparkles className="text-purple-300" size={22} />
            <h3 className="text-xl font-bold tracking-tight">ShortLink</h3>
          </div>
          <p className="text-sm text-purple-200 max-w-md">
            Your privacy-focused solution for link shortening. Fast, secure, and
            simple—without compromising your data.
          </p>
          <div className="flex gap-2 mt-2 justify-center md:justify-start">
            <span className="inline-flex items-center gap-1 bg-purple-700/60 text-purple-100 px-3 py-1 rounded-full text-xs font-medium">
              <ShieldCheck size={14} /> No Tracking
            </span>
            <span className="inline-flex items-center gap-1 bg-purple-700/60 text-purple-100 px-3 py-1 rounded-full text-xs font-medium">
              <Sparkles size={14} /> Free Forever
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row gap-6 mt-4 md:mt-0 text-center md:text-right">
          <Link
            href="/about"
            className="text-purple-200 hover:text-white transition font-medium"
          >
            About
          </Link>
          <Link
            href="/shorten"
            className="text-purple-200 hover:text-white transition font-medium"
          >
            Get Started
          </Link>
          <Link
            href="/contact"
            className="text-purple-200 hover:text-white transition font-medium"
          >
            Contact
          </Link>
          <Link
            href="/stats"
            className="text-purple-200 hover:text-white transition font-medium"
          >
            Analytics
          </Link>
          <Link
            href="/faq"
            className="text-purple-200 hover:text-white transition font-medium"
          >
            FAQ
          </Link>
          <Link
            href="/privacy"
            className="text-purple-200 hover:text-white transition font-medium"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-purple-200 hover:text-white transition font-medium"
          >
            Terms
          </Link>
          <Link
            href="https://github.com/Premshaw23/ShortLink"
            target="_blank"
            className="inline-flex items-center gap-1 text-purple-200 hover:text-white transition font-medium"
          >
            <Github size={16} /> GitHub
          </Link>
        </div>
      </div>
      {/* Footer Bottom Section */}
      <div className="border-t border-purple-700 mt-8 pt-4 text-center text-xs text-purple-300">
        © {new Date().getFullYear()} ShortLink. All rights reserved.
      </div>
    </footer>
  );
}
