"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX, HiSearch, HiUserCircle, HiLogout } from "react-icons/hi";
import { formatCurrency } from "@/src/lib/utils";
import Button from "./ui/Button";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const [balance] = useState(150000); // Mock balance for now

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out");
    window.location.href = "/";
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                Y
              </div>
              <span className="text-2xl font-black text-dark-text tracking-tight">
                Yashil <span className="text-primary">Yo&apos;l</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/rides" className="text-dark-text font-semibold hover:text-primary transition-colors flex items-center">
              <HiSearch className="mr-2 w-5 h-5" />
              Find a Ride
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-6">
                <div className="bg-light-bg px-4 py-2 rounded-xl border border-border">
                  <span className="text-xs text-gray-500 block leading-none mb-1">Balance</span>
                  <span className="text-dark-text font-bold leading-none">{formatCurrency(balance)}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard" className="flex items-center space-x-2 bg-white hover:bg-light-bg p-1 pr-3 rounded-full border border-border transition-all">
                    <HiUserCircle className="w-9 h-9 text-primary" />
                    <span className="font-semibold text-dark-text">{user.first_name}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-error hover:bg-error/5 rounded-xl transition-all"
                    title="Logout"
                  >
                    <HiLogout className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-dark-text font-semibold hover:text-primary transition-colors px-4 py-2">
                  Log in
                </Link>
                <Link href="/auth/register">
                  <Button size="md">Join for Free</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-light-bg transition-colors"
            >
              {isOpen ? <HiX className="w-7 h-7" /> : <HiMenu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-border animate-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-4 pb-6 space-y-4">
            <Link
              href="/rides"
              className="block px-4 py-3 text-lg font-semibold text-dark-text hover:bg-light-bg rounded-xl transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Find a Ride
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-3 text-lg font-semibold text-dark-text hover:bg-light-bg rounded-xl transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My Dashboard ({user.first_name})
                </Link>
                <div className="px-4 py-3 bg-light-bg rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Balance</span>
                    <span className="text-xl font-bold text-dark-text">{formatCurrency(balance)}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-error font-bold px-4 py-2 hover:bg-error/5 rounded-xl transition-all"
                  >
                    <HiLogout className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" fullWidth>Log in</Button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                  <Button fullWidth>Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
