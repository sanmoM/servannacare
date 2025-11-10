"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/header/Navbar";
import Footer from "@/components/shared/footer/Footer";
import React from "react";
import { Toaster } from "react-hot-toast";

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();

  // Define routes where Navbar and Footer are hidden
  const hideLayout = ["/login", "/register"];
  const shouldHideLayout = hideLayout.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <div className="min-h-[60vh]">{children}</div>
      <Toaster position="top-right" reverseOrder={false} />
      {!shouldHideLayout && <Footer />}
    </>
  );
};

export default LayoutWrapper;
