import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-purple-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-2">
            ShortLink - Simplify Your URLs
          </h3>
          <p className="text-sm text-purple-300 max-w-md">
            Your privacy-focused solution for link shortening. Fast, secure, and
            simple without compromising your data.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row gap-6 mt-4 md:mt-0">
          <Link
            href="/about"
            className="text-purple-300 hover:text-white transition"
          >
            About Us
          </Link>
          <Link
            href="/shorten"
            className="text-purple-300 hover:text-white transition"
          >
            Get Started
          </Link>
          <Link
            href="/contact"
            className="text-purple-300 hover:text-white transition"
          >
            Contact
          </Link>
          <Link
            href="https://github.com/Premshaw23/ShortLink"
            className="text-purple-300 hover:text-white transition"
          >
            GitHub
          </Link>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="border-t border-purple-600 mt-8 pt-4 text-center text-sm text-purple-400">
        © {new Date().getFullYear()} FundFlick. All rights reserved.
      </div>
    </footer>
  );
}
