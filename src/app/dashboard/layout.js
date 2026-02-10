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
  const router = useRouter();
  const { user, loaded } = useLocalUser();

  const [token, setToken] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isProfileCompleted = Boolean(user?.is_profile_completed);
  const isProfileVerified = Boolean(user?.is_profile_verified);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);



  const restrictedRoutes = {
    specialist: {
      profile: "/dashboard/specialist-profile",
      extra: "/dashboard/specialist-schedule",
    },
    agency: {
      profile: "/dashboard/agency-profile",
      extra: "/dashboard/agency-employee",
    },
    care_institutions: {
      profile: "/dashboard/care_institutions-profile",
      extra: "/dashboard/care-institution-nurses",
    },
    user: {
      profile: "/dashboard/user-profile",
      extra: null,
    },
  };



  useEffect(() => {
    if (!loaded || token === null) return;

    if (!token) {
      router.push("/login");
      return;
    }

    const role = user?.role;
    if (!role) return;

    const config = restrictedRoutes[role];
    if (!config) return;

    const allowedPaths = [config.profile, config.extra].filter(Boolean);


    if (!isProfileCompleted || (role !== "user" && !isProfileVerified)) {
      if (!allowedPaths.includes(pathname)) {
        router.replace(config.profile);
      }
      return;
    }



    if (
      role !== "user" &&
      (
  
        pathname === "/dashboard/book-history" ||
        pathname === "/dashboard/payment-history" ||
        pathname.startsWith("/dashboard/user")
      )
    ) {
      notFound();
    }

    if (pathname.startsWith("/dashboard/specialist") && role !== "specialist") {
      notFound();
    }

    if (pathname.startsWith("/dashboard/agency") && role !== "agency") {
      notFound();
    }

    if (
      pathname.startsWith("/dashboard/care-institution") &&
      role !== "care_institutions"
    ) {
      notFound();
    }
  }, [loaded, token, user, pathname]);



  if (!loaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }



  const userLinks = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Profile", href: "/dashboard/user-profile", icon: User },
    { name: "Find Services", href: "/specialist?", icon: Search },

    { name: "Book History", href: "/dashboard/book-history", icon: ClipboardClock },
    { name: "Payment History", href: "/dashboard/payment-history", icon: History },
  ];

  const specialistLinks = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Profile", href: "/dashboard/specialist-profile", icon: User },
    { name: "Schedule", href: "/dashboard/specialist-schedule", icon: Calendar },
    { name: "Clients", href: "/dashboard/specialist-clients", icon: Users },
    { name: "Notes", href: "/dashboard/note", icon: NotepadText },
    { name: "Feedback", href: "/dashboard/feedback", icon: Smile },
  ];

  const agencyLinks = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Profile", href: "/dashboard/agency-profile", icon: User },
    { name: "Employee", href: "/dashboard/agency-employee", icon: BriefcaseBusiness },
    { name: "Schedule", href: "/dashboard/agency-schedule", icon: Calendar },
    { name: "Clients", href: "/dashboard/agency-clients", icon: Users2 },
    { name: "Notes", href: "/dashboard/note", icon: NotepadText },
    { name: "Feedback", href: "/dashboard/feedback", icon: Smile },
  ];

  const careInstitutionLinks = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Profile", href: "/dashboard/care_institutions-profile", icon: User },
    { name: "Nurses", href: "/dashboard/care-institution-nurses", icon: Cross },
    { name: "Schedule", href: "/dashboard/care-institution-schedule", icon: Calendar },
    { name: "Clients", href: "/dashboard/care-institution-clients", icon: Users2 },
    { name: "Notes", href: "/dashboard/note", icon: NotepadText },
    { name: "Feedback", href: "/dashboard/feedback", icon: Smile },
  ];

  let links = [];
  let role = user?.role;

  if (role === "user") links = userLinks;
  if (role === "specialist") links = specialistLinks;
  if (role === "agency") links = agencyLinks;
  if (role === "care_institutions") links = careInstitutionLinks;



  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
    toast.success("Log Out Success!");
  };

  const NavLink = ({ link }) => {
    const Icon = link.icon;
    const isActive = pathname === link.href;

    return (
      <Link
        href={link.href}
        className={`flex items-center p-3 mx-2 my-1 rounded-lg transition
          ${isActive ? "bg-white text-gray-900 font-semibold shadow" : "text-white hover:bg-white/20"}
        `}
      >
        <Icon className="w-5 h-5 mr-3" />
        {link.name}
      </Link>
    );
  };


  return (
    <div className="flex h-screen w-full overflow-hidden">
      <aside className={`bg-primary text-white fixed lg:static h-full z-50 transition-all ${isSidebarOpen ? "w-72" : "w-0"}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/20">
            <Link href="/">
              <img src="/logo2.png" className="w-20" />
            </Link>
          </div>

          <nav className="flex-grow py-3">
            {links.map((link) => (
              <NavLink key={link.name} link={link} />
            ))}
          </nav>

          <Button onClick={handleLogout} className="mx-3 mb-4 bg-secondary">
            Log Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="bg-primary sticky top-0 z-30 flex justify-between p-4 text-white">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <PanelLeft />
          </button>

          <Link href={`/dashboard/${role}-profile`}>
            <img src="/user.png" className="h-9 w-9 rounded-full bg-white" />
          </Link>
        </div>

        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
