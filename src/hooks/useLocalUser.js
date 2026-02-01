"use client";

import { useEffect, useState } from "react";

export default function useLocalUser() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);


  const loadUser = () => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("Error parsing user:", error);
      setUser(null);
    }
    setLoaded(true);
  };

  useEffect(() => {
    loadUser();
  }, []);


  const refreshUser = () => {
    loadUser();
  };

  return { user, loaded, refreshUser };
}

