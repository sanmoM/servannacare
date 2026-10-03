"use client";

import { createContext, useEffect, useState, useCallback } from "react";
import { getApi } from "@/lib/apiHandler";
import { useRouter } from "next/navigation";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback((redirectTo = "/login") => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("specialist_expiry");
    }
    setUser(null);
    setRole(null);
    if (redirectTo && typeof window !== "undefined") {
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = redirectTo;
      }
    }
  }, []);

  const fetchCurrentUser = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        logout(null);
        return null;
      }

      const res = await getApi("/profile");

      if (res?.data?.status) {
        const userData = res.data.data;
        setUser(userData);
        setRole(userData.role);
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
        }
        return userData;
      } else {
        console.warn("Profile API returned falsy status, user deleted:", res);
        logout("/login");
        return null;
      }
    } catch (error) {
      console.error("Error fetching current user profile:", error);

      const status = error?.response?.status;
      const msg = error?.response?.data?.message?.toLowerCase?.() || "";

      // 401 Unauthorized, 403 Forbidden, 404 Not Found, or backend status: false means account is deleted/invalid
      if (
        status === 401 ||
        status === 403 ||
        status === 404 ||
        error?.response?.data?.status === false ||
        msg.includes("unauthenticated") ||
        msg.includes("user not found")
      ) {
        logout("/login");
        return null;
      }

      // Only fallback to cached user during transient network failure (offline)
      if (error?.code === "ERR_NETWORK" || !error?.response) {
        const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setRole(parsed.role);
            return parsed;
          } catch {
            logout("/login");
          }
        }
      } else {
        logout("/login");
      }
      return null;
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      fetchCurrentUser();
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      setUser(null);
      setRole(null);
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  // Global listener for 401 unauthorized events from Axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      logout("/login");
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        role,
        setRole,
        loading,
        logout,
        refreshUser: (showLoader = false) => fetchCurrentUser(showLoader),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
