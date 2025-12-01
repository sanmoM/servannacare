"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  ClipboardClock,
  History,
  HomeIcon,
  MessageSquare,
  NotepadText,
  PanelLeft,
  Search,
  Smile,
  User,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useLocalUser from "@/hooks/useLocalUser";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const pathname = usePathname(); // current route
  const { user, loaded } = useLocalUser();
  const router = useRouter();

  console.log(user);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- Links ---
  const userLinks = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Profile", href: "/dashboard/user-profile", icon: User },
    { name: "Find Services", href: "/search?category=all", icon: Search },
    {
      name: "My Appointments",
      href: "/dashboard/my-appointment",
      icon: Calendar,
    },
    {
      name: "Book History",
      href: "/dashboard/book-history",
      icon: ClipboardClock,
    },
    {
      name: "Payment History",
      href: "/dashboard/payment-history",
      icon: History,
    },
  ];

  const specialistLinks = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Profile", href: "/dashboard/specialist-profile", icon: User },
    {
      name: "Schedule",
      href: "/dashboard/specialist-schedule",
      icon: Calendar,
    },
    { name: "Clients", href: "/dashboard/specialist-clients", icon: Users },
    { name: "Notes", href: "/dashboard/specialist-note", icon: NotepadText },
    { name: "Feedback", href: "#feedback", icon: Smile },
  ];

  let links = [];
  if (user?.role === "user") {
    links = userLinks;
  } else if (user?.role === "agency") {
    links;
  } else if (user?.role === "medical") {
    links;
  } else if (user?.role === "specialist") {
    links = specialistLinks;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
    toast.success("Log Out Success!");
  };

  // --- NavLink Component ---
  const NavLink = ({ link }) => {
    const Icon = link.icon;
    const isActive = link.href !== "#" && pathname === link.href;

    return (
      <a
        href={link.href}
        className={`flex items-center text-sm lg:text-base p-3 mx-2 my-1 rounded-lg transition
          ${
            isActive
              ? "bg-white text-gray-900 font-semibold shadow"
              : "text-white hover:bg-white/20"
          }`}
      >
        <Icon className="w-5 h-5 mr-3" />
        {link.name}
      </a>
    );
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* SIDEBAR */}
      <>
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <aside
          className={`bg-primary text-white fixed lg:static top-0 left-0 h-full z-50
          transition-all duration-300
          ${isSidebarOpen ? "w-72" : "w-0 lg:w-0"}
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        >
          {isSidebarOpen && (
            <div className="flex flex-col h-full">
              {/* Sidebar Top */}
              <div className="p-6 flex items-center justify-between border-b border-white/20">
                <div className="flex gap-2 items-center">
                  <Link className="flex gap-2 items-center" href={"/"}>
                    <img className="w-8" src="/logo.png" alt="Logo" />
                    <h2 className="font-semibold text-sm lg:text-base">
                      SERVANNACARE
                    </h2>
                  </Link>
                </div>
                <button
                  className="lg:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-grow overflow-y-auto py-3">
                {!loaded ? (
                  <LoadingSpinner />
                ) : (
                  links.map((link) => <NavLink key={link.name} link={link} />)
                )}
              </nav>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                size={"lg"}
                className="bg-secondary hover:bg-secondary/80 mx-3 mb-4"
              >
                Log Out
              </Button>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-white/20 text-center text-xs opacity-75">
                © 2025. All rights reserved.
              </div>
            </div>
          )}
        </aside>
      </>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-gray-50 transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-primary sticky top-0 z-30 flex justify-between pr-2 py-3 sm:py-5 text-white shadow-md">
          <button
            className="p-2 cursor-pointer hover:text-gray-100"
            onClick={() => {
              if (window.innerWidth < 1024) {
                setIsMobileMenuOpen(!isMobileMenuOpen);
              } else {
                setIsSidebarOpen(!isSidebarOpen);
              }
            }}
          >
            <div className="flex items-center gap-2">
              <PanelLeft />
              <span className="text-sm lg:hidden font-semibold">Dashboard</span>
            </div>
          </button>

          <Link href={`/dashboard/${user?.role}-profile`}>
          <img
            src="/user.png"
            className="h-10 w-10 border bg-white border-white rounded-full"
          />
          </Link>
        </div>

        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
