"use client";

import React from "react";
import dynamic from "next/dynamic";
import { AuthProvider } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Client-only router wrapper (keeps previous behavior)
const ClientRouter = dynamic(() => import("../components/ClientRouter"), {
  ssr: false,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClientRouter>
      <AuthProvider>
        {children}
        <ToastContainer />
      </AuthProvider>
    </ClientRouter>
  );
}
