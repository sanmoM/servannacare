"use client";

import { createContext, useEffect, useState } from "react";
import { getApi } from "@/lib/apiHandler";
import { useRouter } from "next/navigation";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCurrentUser = async () => {
    try {
      const res = await getApi("/profile");
      if (res?.data?.status) {
        const userData = res.data.data;
        setUser(userData);
        setRole(userData.role);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  // const login = (userData, token) => {
  //   localStorage.setItem("token", token);
  //   setUser(userData);
  //   setRole(userData.role);
  // };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        role,
        setRole,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
