"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";
import LoadingSpinner from "./LoadingSpin";

const PublicRoute = ({ children }) => {
  const { role, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const token = localStorage.getItem("token");

    if (token && user) {
      if (user?.role === "specialist" && !user?.is_profile_completed) {
        if (pathname !== "/register") {
          router.replace(`/register?role=${user?.subRole || ""}`);
        }
      } else if (
        user?.role === "agency" ||
        (user?.role === "care_institutions" && !user?.is_profile_completed)
      ) {
        if (pathname !== "/register") {
          router.replace(`/register?role=${user?.role}`);
        }
      } else {
        router.replace("/dashboard");
      }
    }
  }, [loading, router, user, pathname]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default PublicRoute;
