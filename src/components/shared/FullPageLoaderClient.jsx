"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function FullPageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setLoading(false);

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  if (!loading) return null;
  const brandColor = "#72275b";

  const grid = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
<div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi placeat harum quisquam quos dolor accusantium soluta nam vel mollitia. Cum.
</div>
  );
}
