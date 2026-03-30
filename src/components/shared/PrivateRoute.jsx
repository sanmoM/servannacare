"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function PrivateRoute({ children }) {
  const {user, role, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (loading) return;

    const token = localStorage.getItem("token");
    (token)

    if (!token && !user) {
      router.replace("/login");
      return;
    }
  }, [user, role, loading, router]);

  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
