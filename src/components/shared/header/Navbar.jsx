"use client";

import React, { useState } from "react";
import Container from "../Container";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { BookAlert, BookImage, CircleQuestionMark, HandHeart, Headset, HeartPulse, Home, Info, LayoutList, Menu, Users, X } from "lucide-react";
import TopBar from "./TopBar";
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
import useLocalUser from "@/hooks/useLocalUser";
import LoadingSpinner from "../LoadingSpin";

const Navbar = () => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { user, loaded } = useLocalUser();

  console.log(user);

  const navlinks = [
    { text: "Home", link: "/", icon:Home },
    { text: "Our Services", link: "/services",icon:HandHeart  },
    { text: "Specialist", link: "/specialist",icon:Users  },
    // { text: "Blog", link: "/blog",icon:LayoutList  },
    { text: "About Us", link: "/about-us",icon:BookAlert  },
    // { text: "FAQ", link: "/faq",icon:CircleQuestionMark  },
    { text: "Event", link: "/event",icon:BookImage  },
    { text: "Contact Us", link: "/contact-us",icon:Headset  },
  ];

  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <>
      <TopBar />
      <div className="border-b bg-white z-50 relative">
        <Container className="flex justify-between items-center py-3 md:py-4">
          {/* Logo */}
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

          <div className="flex gap-3">
            {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center">
            <Menu
              className="cursor-pointer w-7 h-7 text-gray-800"
              onClick={() => setSidebarOpen(true)}
            />
          </div>

          {/* Mobile Logo */}
          <div className="inline-block md:hidden">
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
          </div>

          {/* Desktop Nav Links */}
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

          

          {/* CTA Button */}
          <div className="flex gap-2">
            {!loaded ? (
              <LoadingSpinner />
            ) : user ? (
              <Link href={"/dashboard"}>
                <Button className={"rounded-full"}>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href={"/login"}>
                  <Button
                    className={"rounded-full hidden md:flex text-xs"}
                    variant={"outline"}
                  >
                    LOGIN
                  </Button>
                </Link>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="rounded-full text-xs">
                      GET IN TOUCH{" "}
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        Select Your Role
                      </DialogTitle>
                      <DialogDescription className="text-center" />
                    </DialogHeader>

                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 items-stretch">
                      {userRole.map((role, indx) => (
                        <DialogClose asChild key={indx}>
                          <Link
                            className="h-full"
                            href={`/register?role=${role.role}`}
                          >
                            <div className="h-full flex flex-col items-center p-2 py-3 sm:py-4 rounded-lg border hover:border-primary transition-all duration-500 border-border bg-background hover:shadow-md">
                              <div className="flex items-center justify-center w-6 h-6 sm:h-8 sm:w-8 rounded-full bg-cyan-100 mb-2 sm:mb-4">
                                <Image
                                  src={role.icon}
                                  alt="role"
                                  quality={100}
                                  className="h-full w-full"
                                />
                              </div>
                              <h3 className="text-[9px] sm:text-sm text-center font-semibold text-gray-700">
                                {role.text}
                              </h3>
                            </div>
                          </Link>
                        </DialogClose>
                      ))}
                    </div>

                    {/* <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter> */}
                  </DialogContent>
                </Dialog>
              </>
            )}
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
                  const Icon = link.icon

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

            <div className="mt-6 flex flex-col gap-4 px-5">
              {!loaded ? (
                <LoadingSpinner />
              ) : user ? (
                <>
                  <Button size={"lg"} className={"rounded-full"}>
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href={"/login"}>
                    <Button size={"lg"} className={"w-full rounded-full"}>
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
