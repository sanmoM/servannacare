"use client";

import { useEffect, useState } from "react";

export default function useLocalUser() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log("Error parsing user:", error);
    }
    setLoaded(true);
  }, []);

  return { user, loaded };
}
