"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import { ArrowRight } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            {/* Logo circle */}
            <div className="w-8 h-8 rounded-full bg-[rgb(31,82,78)] text-white flex items-center justify-center font-bold">
              M
            </div>
            <span className="font-semibold text-lg">Melkam Psychotherapy</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-gray-700">
            <Link href="/#services">Services</Link>
            <Link href="/#team">Therapists</Link>
            <Link href="/#resources">Resources</Link>
          </nav>
        </div>

        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">{user.email}</span>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="default"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Get started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
