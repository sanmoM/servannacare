"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const PublicRoute = ({ children }) => {
  const { role, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const token = localStorage.getItem("token");

    // If user is logged in, send to dashboard
    if (token && user) {
      router.replace("/dashboard");
    }
  }, [loading, router]);

  // Wait until auth finishes checking
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export default PublicRoute;
