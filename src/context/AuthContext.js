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

 
  const fetchCurrentUser = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const res = await getApi("/profile");

      if (res?.data?.status) {
        const userData = res.data.data;
        setUser(userData);
        setRole(userData.role);
         return userData
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setRole(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        logout,
        refreshUser: () => fetchCurrentUser(false), 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};