"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-purple-700 text-white shadow-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/" className="hover:text-purple-300 transition">
            ShortLink
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6 items-center">
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
              <button className="bg-purple-500 hover:bg-purple-600 transition px-4 py-2 rounded-lg font-semibold shadow">
                History
              </button>
            </Link>
            <Link
              href="https://github.com/Premshaw23/ShortLink"
              target="_blank"
            >
              <button className="bg-purple-500 hover:bg-purple-600 transition px-4 py-2 rounded-lg font-semibold shadow">
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
        <ul className="md:hidden px-6 pb-4 space-y-3 bg-purple-600">
          <li>
            <Link href="/" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" onClick={() => setIsOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link href="/shorten" onClick={() => setIsOpen(false)}>
              Shorten
            </Link>
          </li>
          <li>
            <Link href="/contact" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </li>
          <li>
            <Link href="/history" onClick={() => setIsOpen(false)}>
              <button className="w-full bg-purple-500 hover:bg-purple-600 transition px-4 py-2 rounded-lg font-semibold shadow">
                History
              </button>
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/Premshaw23/ShortLink"
              target="_blank"
            >
              <button className="w-full bg-purple-500 hover:bg-purple-600 transition px-4 py-2 rounded-lg font-semibold shadow">
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
