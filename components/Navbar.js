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
        <div className="flex items-center gap-3 text-2xl font-extrabold tracking-tight">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition"
          >
            <Image
              src="/logo.png"
              alt="ShortLink Logo"
              width={36}
              height={36}
              priority
              className="shadow bg-indigo-400 rounded-full border-2 border-white"
            />
            <span className="drop-shadow">ShortLink</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-7 items-center text-base font-semibold">
          <li>
            <Link
              href="/"
              className="hover:text-purple-200 transition px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="hover:text-purple-200 transition px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/shorten"
              className="hover:text-purple-200 transition px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Shorten
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="hover:text-purple-200 transition px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Contact
            </Link>
          </li>
          <li className="flex gap-3 ml-6">
            <Link href="/stats">
              <button className="bg-white text-purple-700 hover:bg-purple-100 transition px-5 py-2 rounded-lg font-bold shadow border border-purple-200">
                Analytics
              </button>
            </Link>
            <Link
              href="https://github.com/Premshaw23/ShortLink"
              target="_blank"
            >
              <button className="bg-purple-600 hover:bg-purple-700 transition px-5 py-2 rounded-lg font-bold shadow border border-purple-400">
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
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden px-6 py-4 space-y-3 bg-gradient-to-b from-purple-700 to-blue-600 text-white rounded-b-2xl shadow-lg animate-fade-in">
          {[
            { path: "/", label: "Home" },
            { path: "/about", label: "About" },
            { path: "/shorten", label: "Shorten" },
            { path: "/contact", label: "Contact" },
          ].map((item, i) => (
            <li key={i}>
              <Link
                href={item.path}
                onClick={() => setIsOpen(false)}
                className="block py-2 px-2 rounded-lg hover:bg-purple-600 transition"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/stats" onClick={() => setIsOpen(false)}>
              <button className="w-full bg-white text-purple-700 hover:bg-purple-100 transition px-4 py-2 rounded-lg font-bold shadow border border-purple-200 mt-2">
                Analytics
              </button>
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/Premshaw23/ShortLink"
              target="_blank"
              onClick={() => setIsOpen(false)}
            >
              <button className="w-full bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-bold shadow border border-purple-400 mt-2">
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
