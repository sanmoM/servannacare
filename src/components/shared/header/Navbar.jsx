"use client";

import React, { useState } from "react";
import Container from "../Container";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  BookAlert,
  BookImage,
  CircleQuestionMark,
  HandHeart,
  Headset,
  HeartPulse,
  Home,
  Info,
  LayoutList,
  Menu,
  Users,
  X,
} from "lucide-react";
import TopBar from "./TopBar";
import CareChoiceModal from "./CareChoiceModal";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { userRole } from "@/utilities/data";
import LoadingSpinner from "../LoadingSpin";
import LoadingSpinnerSecond from "../Loadingspiner";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  const navlinks = [
    { text: "Home", link: "/", icon: Home },
    { text: "Our Services", link: "/services", icon: HandHeart },
    { text: "Specialist", link: "/specialist", icon: Users },
    { text: "Blog", link: "/blog",icon:LayoutList  },
    { text: "About Us", link: "/about-us", icon: BookAlert },
    // { text: "FAQ", link: "/faq",icon:CircleQuestionMark  },
    { text: "Event", link: "/event", icon: BookImage },
    { text: "Contact Us", link: "/contact-us", icon: Headset },
  ];

  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <>
      <TopBar />
      <div className="border-b bg-white z-50 relative">
        <Container className="flex justify-between items-center py-3 md:py-4">
       
          <div className="md:inline-block hidden">
            <Link href="/">
              <Image
                src="/logo1.png"
                alt="logo"
                quality={100}
                width={80}
                height={100}
              />
            </Link>
          </div>
          <div className="md:hidden grid grid-cols-3 items-center w-full">
            <div className="flex justify-start">
              <Menu
                className="cursor-pointer w-7 h-7 text-gray-800"
                onClick={() => setSidebarOpen(true)}
              />
            </div>

            <div className="flex justify-center">
              <Link href="/">
                <Image
                  src="/logo1.png"
                  alt="logo"
                  quality={100}
                  width={60}
                  height={60}
                />
              </Link>
            </div>

            <div></div>
          </div>

      
          <div className="hidden md:flex">
            <ul className="flex md:gap-2 lg:gap-6 items-center">
              {navlinks.map((link, indx) => {
                const isActive =
                  pathname === link.link ||
                  (link.link !== "/" && pathname.startsWith(link.link));
                return (
                  <li key={indx}>
                    <Link
                      href={link.link}
                      className={`px-2 font-medium text-xs lg:text-base transition-colors duration-200 ${
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

          
          <div className="flex gap-2">
            {loading ? (
              <LoadingSpinnerSecond />
            ) : user ? (
              <Link href={"/dashboard"}>
                <Button className={"rounded-full cursor-pointer"}>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href={"/login"}>
                  <Button
                    className={
                      "rounded-full hidden md:flex text-xs cursor-pointer"
                    }
                    variant={"outline"}
                  >
                    LOGIN
                  </Button>
                </Link>
                <CareChoiceModal>
                  <Button className="rounded-full text-xs cursor-pointer">
                    SIGN UP
                  </Button>
                </CareChoiceModal>
              </>
            )}
          </div>
        </Container>

    
        <div
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={handleCloseSidebar}
        ></div>

   
        <div
          className={`fixed top-0 right-0 h-full w-3/4 sm:w-1/2 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex justify-between items-center p-5 border-b">
              <Link href="/" onClick={handleCloseSidebar}>
                <Image
                  src="/logo1.png"
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

            <ul className="flex flex-grow gap-1 flex-col  p-3">
              {navlinks.map((link, indx) => {
                const isActive =
                  pathname === link.link ||
                  (link.link !== "/" && pathname.startsWith(link.link));
                const Icon = link.icon;

                return (
                  <li className="" key={indx}>
                    <Link
                      href={link.link}
                      onClick={handleCloseSidebar}
                      className={` text-sm flex items-center rounded-xl font-medium p-3 transition-colors ${
                        isActive
                          ? "text-white bg-secondary"
                          : "text-gray-700 hover:text-primary"
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {link.text}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mb-6 flex flex-col gap-4 px-5">
              {loading ? (
                <LoadingSpinner />
              ) : user ? (
                <>
                  <Button
                    size={"lg"}
                    onClick={() => {
                      logout();
                      handleCloseSidebar();
                    }}
                    className={"rounded-full cursor-pointer"}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href={"/login"}>
                    <Button
                      size={"lg"}
                      className={"w-full rounded-full cursor-pointer"}
                    >
                      LOGIN
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
