"use client";

import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useAuth } from "../../../context/AuthContext";

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [token]);

  return (
    <>
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p>Welcome back{user ? `, ${user.email}` : ""}.</p>
            <p className="mt-4 text-sm text-gray-600">
              This page will be extended to match the Figma UI (appointments,
              calendar, client list).
            </p>
          </div>
        )}
      </main>
    </>
  );
}
