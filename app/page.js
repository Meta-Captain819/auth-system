"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="font-sans flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <main className="flex flex-col gap-8 items-center text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900">
          🔐 Secure Auth System
        </h1>
        <p className="text-lg text-gray-700">
          A modern authentication system built with Next.js, NextAuth, and MongoDB. 
          Manage your favorite songs securely with user authentication.
        </p>

        {session ? (
          // Logged in user view
          <div className="flex flex-col gap-4 items-center mt-4">
            <p className="text-xl text-gray-800">
              Welcome back, <span className="font-semibold">{session.user?.name || session.user?.email}</span>! 👋
            </p>
            <div className="flex gap-4 items-center flex-col sm:flex-row">
              <Link
                href="/favorites"
                className="rounded-full bg-blue-600 text-white font-semibold px-8 py-3 hover:bg-blue-700 transition shadow-lg"
              >
                Go to Favorites
              </Link>
              <button
                onClick={() => {
                  const { signOut } = require("next-auth/react");
                  signOut({ callbackUrl: "/" });
                }}
                className="rounded-full border-2 border-red-600 text-red-600 font-semibold px-8 py-3 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          // Not logged in user view
          <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
            <Link
              href="/register"
              className="rounded-full bg-blue-600 text-white font-semibold px-8 py-3 hover:bg-blue-700 transition shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="rounded-full border-2 border-blue-600 text-blue-600 font-semibold px-8 py-3 hover:bg-blue-50 transition"
            >
              Sign In
            </Link>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-lg mb-2">Secure</h3>
            <p className="text-sm text-gray-600">
              Passwords hashed with bcrypt for maximum security
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-lg mb-2">Fast</h3>
            <p className="text-sm text-gray-600">
              Built with Next.js 15 and modern React
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">🎵</div>
            <h3 className="font-semibold text-lg mb-2">Personal</h3>
            <p className="text-sm text-gray-600">
              Manage your favorite songs collection
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
