"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/header/Navbar";
import Footer from "@/components/shared/footer/Footer";
import React from "react";
import { Toaster } from "react-hot-toast";
import ChatBot from "./chatbot/Chatbot";
import WhatsAppCTA from "./WhatsAppCTA";

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();

  const hideLayout = ["/login", "/register", "/dashboard", "/forgot-password","/verify-otp"];
  const shouldHideLayout = hideLayout.some((route) =>
    pathname.startsWith(route),
  );
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
     
      {!shouldHideLayout && <Navbar />}
      <div className="min-h-[60vh]">{children}</div>
      {!shouldHideLayout && <ChatBot />}
      {!isDashboard && <WhatsAppCTA hasChatbot={!shouldHideLayout} />}
      <Toaster position="top-right" reverseOrder={false} />
      {!shouldHideLayout && <Footer />}
    </>
  );
};

export default LayoutWrapper;
