import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="py-4 bg-purple-700 flex justify-between px-12 items-center sticky top-0 z-10 text-white shadow-md">
      {/* Logo Section */}
      <div className="logo font-bold text-2xl">
        <Link href="/">
          <span className="cursor-pointer hover:text-purple-300 transition">
            ShortLink
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="flex justify-center gap-6 items-center">
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
          <Link href="/contact">Contact Us</Link>
        </li>

        {/* Buttons Section */}
        <li className="flex gap-5 ml-4">
          <Link href="/history">
            <button className="bg-purple-500 rounded-lg shadow-md px-4 py-2 font-bold hover:bg-purple-600 transition">
              History
            </button>
          </Link>
          <Link href="https://github.com/Premshaw23/ShortLink">
            <button className="bg-purple-500 rounded-lg shadow-md px-4 py-2 font-bold hover:bg-purple-600 transition">
              GitHub
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
