"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-800 to-indigo-600 text-white shadow-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo + Brand */}
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <Image
              src="/logo.png" // Ensure this matches your public/logo.png
              alt="ShortLink Logo"
              width={32}
              height={32}
              priority
              className="shadow-sm bg-indigo-400 shadow-black rounded-full"
            />
            ShortLink
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6 items-center text-sm font-medium">
          <li className="hover:text-purple-300 transition">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-purple-300 transition">
            <Link href="/about">About</Link>
          </li>
          <li className="hover:text-purple-300 transition">
            <Link href="/shorten">Shorten</Link>
          </li>
          <li className="hover:text-purple-300 transition">
            <Link href="/contact">Contact</Link>
          </li>
          <li className="flex gap-3 ml-4">
            <Link href="/history">
              <button className="bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-semibold shadow">
                History
              </button>
            </Link>
            <Link
              href="https://github.com/Premshaw23/ShortLink"
              target="_blank"
            >
              <button className="bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-semibold shadow">
                GitHub
              </button>
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden px-6 pb-4 space-y-3 bg-gradient-to-b from-purple-700 to-blue-600 text-white">
          {["/", "/about", "/shorten", "/contact"].map((path, i) => (
            <li key={i}>
              <Link href={path} onClick={() => setIsOpen(false)}>
                {path === "/"
                  ? "Home"
                  : path.replace("/", "").charAt(0).toUpperCase() +
                    path.slice(2)}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/history" onClick={() => setIsOpen(false)}>
              <button className="w-full bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-semibold shadow">
                History
              </button>
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/Premshaw23/ShortLink"
              target="_blank"
              onClick={() => setIsOpen(false)}
            >
              <button className="w-full bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-semibold shadow">
                GitHub
              </button>
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
