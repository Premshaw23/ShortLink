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
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-800 to-indigo-600 text-white shadow-md sticky top-0 z-20 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight hover:opacity-90 transition"
        >
          <Image
            src="/logo.png"
            alt="ShortLink Logo"
            width={32}
            height={32}
            priority
            className="shadow bg-indigo-400 rounded-full border-2 border-white"
          />
          <span className="drop-shadow">ShortLink</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-5 items-center font-semibold text-base">
          {mainLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={linkClass + " px-3 py-1.5 text-sm"}>
                {label}
              </Link>
            </li>
          ))}
          {/* More dropdown for FAQ/Privacy/Terms */}
          <li className="relative" ref={moreRef}>
            <button
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 transition text-sm"
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
                      className="block px-4 py-2 hover:bg-purple-50 transition rounded-xl text-sm"
                      onClick={() => setMoreOpen(false)}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li className="flex gap-2 ml-4 items-center">
            <Link href="/stats">
              <button className="nav-btn bg-white text-purple-700 border-purple-200 text-sm px-4 py-1.5">
                Analytics
              </button>
            </Link>
            <Link
              href="https://github.com/Premshaw23/ShortLink"
              target="_blank"
            >
              <button className="nav-btn bg-purple-600 text-white border-purple-400 hover:bg-purple-700 text-sm px-4 py-1.5">
                GitHub
              </button>
            </Link>
            {session ? (
              <UserDropdown session={session} onSignOut={signOut} />
            ) : (
              <Link href="/auth/signin">
                <button className="nav-btn bg-green-600 text-white border-green-200 hover:bg-green-700 ml-2 text-sm px-4 py-1.5">
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
        <ul className="md:hidden px-4 py-4 space-y-2 bg-gradient-to-b from-purple-700 to-blue-600 text-white rounded-b-2xl shadow-lg animate-fade-in">
          {/* Main links */}
          {mainLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setIsOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-purple-600 transition text-base font-semibold"
              >
                {label}
              </Link>
            </li>
          ))}
          {/* More links in a compact group */}
          <li>
            <div className="flex flex-col gap-1 bg-white/10 rounded-lg p-2 mt-1">
              {moreLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="block py-1 px-2 rounded-md hover:bg-purple-600/60 transition text-sm"
                >
                  {label}
                </Link>
              ))}
            </div>
          </li>
          {/* Analytics & GitHub */}
          <li className="flex gap-2 mt-2">
            <Link href="/stats" onClick={() => setIsOpen(false)} className="flex-1">
              <button className="nav-btn w-full bg-white text-purple-700 border-purple-200 text-base py-2">
                Analytics
              </button>
            </Link>
            <Link
              href="https://github.com/Premshaw23/ShortLink"
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              <button className="nav-btn w-full bg-purple-600 text-white border-purple-400 hover:bg-purple-700 text-base py-2">
                GitHub
              </button>
            </Link>
          </li>
          {/* Auth */}
          <li className="mt-2">
            {session ? (
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="nav-btn w-full bg-red-600 text-white border-red-200 hover:bg-red-700 text-base py-2"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                <button className="nav-btn w-full bg-green-600 text-white border-green-200 hover:bg-green-700 text-base py-2">
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
