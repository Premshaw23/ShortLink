"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  UserCircle2,
  User,
} from "lucide-react";

const UserDropdown = ({ session, onSignOut }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = session?.user;

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative ml-2" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 bg-white/10 hover:bg-white/30 px-2.5 py-1.5 rounded-2xl transition focus:outline-none focus:ring-2 focus:ring-purple-400 shadow border border-white/20 backdrop-blur-md min-h-[40px]"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt={user?.name || user?.email || "User"}
            width={28}
            height={28}
            className="rounded-full border border-purple-300 shadow-sm"
          />
        ) : (
          <span className="rounded-full border border-purple-300 shadow-sm bg-white flex items-center justify-center w-7 h-7">
            <User size={18} className="text-purple-400" />
          </span>
        )}
        <span className="hidden sm:block font-semibold truncate max-w-[100px] text-sm">
          {user?.name || user?.email}
        </span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white/95 text-gray-900 rounded-2xl shadow-2xl z-30 animate-fade-in border border-purple-100 backdrop-blur-xl p-0.5">
          <div className="px-4 py-2 border-b border-purple-50 rounded-t-2xl bg-white/90">
            <div className="font-bold truncate text-sm">
              {user?.name || user?.email}
            </div>
            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
          </div>
          <ul className="py-1">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 hover:bg-purple-50 transition rounded-xl text-sm"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard size={16} className="text-purple-500" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/account"
                className="flex items-center gap-2 px-4 py-2 hover:bg-purple-50 transition rounded-xl text-sm"
                onClick={() => setOpen(false)}
              >
                <UserCircle2 size={16} className="text-purple-500" />
                Account
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  setOpen(false);
                  onSignOut();
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition rounded-xl text-sm"
              >
                <LogOut size={16} className="text-red-500" />
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
