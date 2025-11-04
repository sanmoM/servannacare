"use client";

import React, { useState } from "react";
import Container from "../Container";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import TopBar from "./TopBar";

const Navbar = () => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navlinks = [
    { text: "Home", link: "/" },
    { text: "Our Services", link: "/services" },
    { text: "Blog", link: "/blog" },
    { text: "About Us", link: "/about-us" },
    { text: "FAQ", link: "/faq" },
    { text: "Event", link: "/event" },
  ];

  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <>
    <TopBar/>
    <div className="border-b bg-white z-50 relative">
      <Container className="flex justify-between items-center py-3 md:py-4">
        {/* Logo */}
        <div className="md:inline-block hidden">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="logo"
              quality={100}
              width={80}
              height={100}
            />
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <Menu
            className="cursor-pointer w-6 h-6 text-gray-800"
            onClick={() => setSidebarOpen(true)}
          />
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex">
          <ul className="flex md:gap-4 lg:gap-6 items-center">
            {navlinks.map((link, indx) => {
              const isActive =
                pathname === link.link ||
                (link.link !== "/" && pathname.startsWith(link.link));
              return (
                <li key={indx}>
                  <Link
                    href={link.link}
                    className={`px-2 font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-primary"
                        : "text-gray-700 hover:text-primary"
                    }`}
                  >
                    {link.text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile Logo */}
        <div className="inline-block md:hidden">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="logo"
              quality={100}
              width={40}
              height={100}
            />
          </Link>
        </div>

        {/* CTA Button */}
        <div className="">
          <Button className="rounded-full text-xs ">GET IN TOUCH</Button>
        </div>
      </Container>

      {/* Sidebar (Mobile) */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={handleCloseSidebar}
      ></div>

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 sm:w-1/2 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <Link href="/" onClick={handleCloseSidebar}>
            <Image
              src="/logo.png"
              alt="logo"
              width={60}
              height={60}
              quality={100}
            />
          </Link>
          <X
            className="cursor-pointer w-6 h-6 text-gray-700"
            onClick={handleCloseSidebar}
          />
        </div>

        <ul className="flex flex-col gap-4 p-5">
          {navlinks.map((link, indx) => {
            const isActive =
              pathname === link.link ||
              (link.link !== "/" && pathname.startsWith(link.link));
            return (
              <li key={indx}>
                <Link
                  href={link.link}
                  onClick={handleCloseSidebar}
                  className={`block text-lg font-medium transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  {link.text}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 px-5">
          <Button className="w-full rounded-full" onClick={handleCloseSidebar}>
            GET IN TOUCH
          </Button>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default Navbar;
