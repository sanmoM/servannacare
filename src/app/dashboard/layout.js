"use client";

import { useEffect, useState } from "react";
import { notFound, usePathname, useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Calendar,
  ClipboardClock,
  Cross,
  History,
  HomeIcon,
  MessageSquare,
  NotepadText,
  PanelLeft,
  Search,
  Smile,
  User,
  Users,
  Users2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useLocalUser from "@/hooks/useLocalUser";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { user, loaded } = useLocalUser();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [token, setToken] = useState(null);

  const isProfileCompleted = Boolean(user?.is_profile_completed);
  const isProfileVerified = Boolean(user?.is_profile_verified);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const roleSecondaryRoute = {
    care_institutions: "/dashboard/care-institution-nurses",
    agency: "/dashboard/agency-employee",
  };

 useEffect(() => {
  if (!loaded) return;
  if (token === null) return;

  if (!token) {
    router.push("/login");
    return;
  }

  const role = user?.role;
  if (!role) return;

  const profilePath = `/dashboard/${role}-profile`;

  // Define allowed routes if profile is not completed
  const incompleteProfileAllowedRoutes = {
    specialist: [profilePath, "/dashboard/specialist-schedule"],
    agency: [profilePath, "/dashboard/agency-employee"],
    care_institutions: [profilePath, "/dashboard/care-institution-nurses"],
    user: [profilePath], // only profile for normal user
  };

  const allowedRoutes = incompleteProfileAllowedRoutes[role] || [];

  if (!isProfileCompleted) {
    if (!allowedRoutes.includes(pathname)) {
      router.replace(profilePath);
    }
    return;
  }

  // For roles that require verification
  if (role !== "user" && isProfileCompleted && !isProfileVerified) {
    const secondaryPath = roleSecondaryRoute[role];
    const allowedPaths = [profilePath, secondaryPath].filter(Boolean);

    if (!allowedPaths.includes(pathname)) {
      router.replace(profilePath);
    }
    return;
  }

  // USER routes
  if (
    (pathname === "/dashboard/my-appointment" ||
      pathname === "/dashboard/book-history" ||
      pathname === "/dashboard/payment-history" ||
      pathname.startsWith("/dashboard/user")) &&
    role !== "user"
  ) {
    notFound();
  }

  // SPECIALIST routes
  if (pathname.startsWith("/dashboard/specialist") && role !== "specialist") {
    notFound();
  }

  // AGENCY routes
  if (pathname.startsWith("/dashboard/agency") && role !== "agency") {
    notFound();
  }

  // CARE INSTITUTION routes
  if (
    pathname.startsWith("/dashboard/care-institution") &&
    role !== "care_institutions"
  ) {
    notFound();
  }
}, [loaded, user, pathname, router, token]);


  if (!loaded) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  const userLinks = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Profile", href: "/dashboard/user-profile", icon: User },
    { name: "Find Services", href: "/specialist?", icon: Search },
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
    { name: "Notes", href: "/dashboard/note", icon: NotepadText },
    { name: "Feedback", href: "/dashboard/feedback", icon: Smile },
  ];

  const agencyLinks = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Profile", href: "/dashboard/agency-profile", icon: User },
    {
      name: "Employee",
      href: "/dashboard/agency-employee",
      icon: BriefcaseBusiness,
    },
    {
      name: "Schedule",
      href: "/dashboard/agency-schedule",
      icon: Calendar,
    },
    { name: "Clients", href: "/dashboard/agency-clients", icon: Users2 },
    { name: "Notes", href: "/dashboard/note", icon: NotepadText },
    { name: "Feedback", href: "/dashboard/feedback", icon: Smile },
  ];

  const careInstitution = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    {
      name: "Profile",
      href: "/dashboard/care_institutions-profile",
      icon: User,
    },
    {
      name: "Nurses",
      href: "/dashboard/care-institution-nurses",
      icon: Cross,
    },
    {
      name: "Schedule",
      href: "/dashboard/care-institution-schedule",
      icon: Calendar,
    },
    {
      name: "Clients",
      href: "/dashboard/care-institution-clients",
      icon: Users2,
    },
    { name: "Notes", href: "/dashboard/note", icon: NotepadText },
    { name: "Feedback", href: "/dashboard/feedback", icon: Smile },
  ];

  let links = [];
  let role = "";
  if (user?.role === "user") {
    links = userLinks;
    role = "user";
  } else if (user?.role === "agency") {
    links = agencyLinks;
    role = "agency";
  } else if (user?.role === "specialist") {
    links = specialistLinks;
    role = "specialist";
  } else if (user?.role === "care_institutions") {
    links = careInstitution;
    role = "care_institutions";
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("specialist");
    router.push("/");
    toast.success("Log Out Success!");
  };

  // --- NavLink Component ---
  const NavLink = ({ link }) => {
    const Icon = link.icon;
    const isActive = link.href !== "#" && pathname === link.href;

    return (
      <Link
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
      </Link>
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
              <div className="p-4 flex items-center justify-between border-b border-white/20">
                <div className="flex gap-2 items-center">
                  <Link className="flex gap-2 items-center" href={"/"}>
                    <img className="w-17" src="/logo2.png" alt="Logo" />
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
                CERVANNA CARE &copy; {new Date().getFullYear()}. ALL RIGHT
                RESERVED
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

          <Link className="md:mr-6 mr-3" href={`/dashboard/${role}-profile`}>
            <img
              src="/user.png"
              className="h-9 w-9 border bg-white border-white rounded-full"
            />
          </Link>
        </div>

        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
