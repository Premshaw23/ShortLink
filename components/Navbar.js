"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import UserDropdown from "./UserDropdown"; // keep your existing dropdown
import { useRef, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/shorten", label: "Shorten" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const { data: session } = useSession();

  // Reduce nav crowding: show only key links, move FAQ/Privacy/Terms to dropdown (or mobile only)
  const mainLinks = navLinks.slice(0, 4); // Home, About, Shorten, Contact
  const moreLinks = navLinks.slice(4); // FAQ, Privacy, Terms

  const linkClass =
    "hover:text-purple-200 transition px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400";

  // Handle outside click for More dropdown
  useEffect(() => {
    if (!moreOpen) return;
    function handleClick(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [moreOpen]);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-800 to-indigo-600 text-white shadow-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight hover:opacity-90 transition"
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

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-7 items-center font-semibold text-base">
          {mainLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={linkClass}>
                {label}
              </Link>
            </li>
          ))}
          {/* More dropdown for FAQ/Privacy/Terms */}
          <li className="relative" ref={moreRef}>
            <button
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 transition"
              onClick={() => setMoreOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={moreOpen}
            >
              More
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {moreOpen && (
              <ul className="absolute right-0 mt-2 w-40 bg-white text-gray-900 rounded-xl shadow-lg z-30 animate-fade-in border border-purple-100">
                {moreLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="block px-4 py-2 hover:bg-purple-50 transition rounded-xl"
                      onClick={() => setMoreOpen(false)}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li className="flex gap-3 ml-6 items-center">
            <Link href="/stats">
              <button className="nav-btn bg-white text-purple-700 border-purple-200">
                Analytics
              </button>
            </Link>
            <Link
              href="https://github.com/Premshaw23/ShortLink"
              target="_blank"
            >
              <button className="nav-btn bg-purple-600 text-white border-purple-400 hover:bg-purple-700">
                GitHub
              </button>
            </Link>
            {session ? (
              <UserDropdown session={session} onSignOut={signOut} />
            ) : (
              <Link href="/auth/signin">
                <button className="nav-btn bg-green-600 text-white border-green-200 hover:bg-green-700 ml-2">
                  Sign In
                </button>
              </Link>
            )}
          </li>
        </ul>
        {/* Hamburger (Mobile) */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {/* Mobile Nav */}
      {isOpen && (
        <ul className="md:hidden px-6 py-4 space-y-3 bg-gradient-to-b from-purple-700 to-blue-600 text-white rounded-b-2xl shadow-lg animate-fade-in">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setIsOpen(false)}
                className="block py-2 px-2 rounded-lg hover:bg-purple-600 transition"
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/stats" onClick={() => setIsOpen(false)}>
              <button className="nav-btn w-full bg-white text-purple-700 border-purple-200">
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
              <button className="nav-btn w-full bg-purple-600 text-white border-purple-400 hover:bg-purple-700">
                GitHub
              </button>
            </Link>
          </li>
          <li>
            {session ? (
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="nav-btn w-full bg-red-600 text-white border-red-200 hover:bg-red-700"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                <button className="nav-btn w-full bg-green-600 text-white border-green-200 hover:bg-green-700">
                  Sign In
                </button>
              </Link>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
