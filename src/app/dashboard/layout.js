"use client";

import { useEffect, useState } from "react";
import { notFound, usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  Calendar,
  ClipboardClock,
  Cross,
  Gem,
  History,
  HomeIcon,
  Inbox,
  Notebook,
  PanelLeft,
  Search,
  Smile,
  User,
  Users,
  Users2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import PrivateRoute from "@/components/shared/PrivateRoute";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [token, setToken] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, user, loading } = useAuth();

  const {
    data: notificationData,
    isLoading: notificationLoading,
    error: notificationError,
  } = useFetch("/notifications");

  const notifications = notificationData?.data?.data ?? [];

  const isProfileCompleted = Boolean(user?.is_profile_completed);
  const isProfileVerified = Boolean(user?.is_profile_verified);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

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
    if (loading) return;
    if (token === null) return;

    if (!token) {
      router.push("/login");
      return;
    }

    const role = user?.role;
    if (!role) return;

    // const config = restrictedRoutes[role];
    // if (!config) return;

    // const allowedPaths = [config.profile, config.extra].filter(Boolean);

    // if (!isProfileCompleted || (role !== "user" && !isProfileVerified)) {
    //   if (!allowedPaths.includes(pathname)) {
    //     router.replace(config.profile);
    //   }
    //   return;
    // }

    if (
      role !== "user" &&
      (pathname === "/dashboard/book-history" ||
        pathname === "/dashboard/payment-history" ||
        pathname.startsWith("/dashboard/user"))
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
  }, [loading, token, user, pathname]);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);

  if (loading) {
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
    { name: "Inbox", href: "/dashboard/user-inbox", icon: Inbox },
    { name: "Note", href: "/dashboard/note", icon: Notebook },
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
    { name: "Feedback", href: "/dashboard/specialist-feedback", icon: Smile },
    {
      name: "Schedule",
      href: "/dashboard/specialist-schedule",
      icon: Calendar,
    },
    { name: "Clients", href: "/dashboard/specialist-clients", icon: Users },
    { name: "Inbox", href: "/dashboard/specialist-inbox", icon: Inbox },
    { name: "Note", href: "/dashboard/specialist-note", icon: Notebook },

    ...(user?.subRole === "house-manager"
      ? [
          {
            name: "Subscriptions",
            href: "/dashboard/subscriptions",
            icon: Gem,
          },
          {
            name: "Payment History",
            href: "/dashboard/house-manager-payment-history",
            icon: History,
          },
        ]
      : []),

    { name: "Review", href: "/dashboard/specialist-review", icon: Smile },
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
      name: "Subscriptions",
      href: "/dashboard/agency-subscriptions",
      icon: Gem,
    },
    {
      name: "Payment History",
      href: "/dashboard/agency-payment-history",
      icon: History,
    },
    // { name: "Clients", href: "/dashboard/agency-clients", icon: Users2 },
    { name: "Inbox", href: "/dashboard/agency-inbox", icon: Inbox },
    // { name: "Feedback", href: "/dashboard/feedback", icon: Smile },
  ];

  const careInstitutionLinks = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    {
      name: "Profile",
      href: "/dashboard/care_institutions-profile",
      icon: User,
    },
    { name: "Specialists", href: "/dashboard/care-institution-specialists", icon: Cross },
    // {
    //   name: "Schedule",
    //   href: "/dashboard/care-institution-schedule",
    //   icon: Calendar,
    // },
    // {
    //   name: "Clients",
    //   href: "/dashboard/care-institution-clients",
    //   icon: Users2,
    // },
    { name: "Inbox", href: "/dashboard/care-institution-inbox", icon: Inbox },
    // { name: "Feedback", href: "/dashboard/feedback", icon: Smile },
  ];

  let links = [];
  let role = user?.role;

  if (role === "user") links = userLinks;
  if (role === "specialist") links = specialistLinks;
  if (role === "agency") links = agencyLinks;
  if (role === "care_institutions") links = careInstitutionLinks;

  const handleLogout = () => {
    logout();
    router.push("/");
    toast.success("Log Out Success!");
  };

  const NavLink = ({ link }) => {
    const Icon = link.icon;
    const isActive = pathname === link.href;

    const handleClick = () => {
      if (isMobile) setIsSidebarOpen(false);

      if (!isProfileCompleted) {
        toast.error("Please complete your profile to unlock full features.");
      } else if (role !== "user" && !isProfileVerified) {
        toast.error("Your profile is not verified yet.");
      }
    };

    return (
      <Link
        href={link.href}
        onClick={handleClick}
        className={`flex items-center p-3 mx-2 my-1 rounded-lg transition
        ${
          isActive
            ? "bg-white text-gray-900 font-semibold shadow"
            : "text-white hover:bg-white/20"
        }
      `}
      >
        <Icon className="w-5 h-5 mr-3" />
        {link.name}
      </Link>
    );
  };

  if (notificationLoading) return <LoadingSpinner />;

  if (notificationError) return <div>Error loading data</div>;
  // if (profileLoading || notificationLoading) return <LoadingSpinner />;

  // if (profileError || notificationError) return <div>Error loading data</div>;

  return (
    <PrivateRoute>
      <div className="flex h-screen w-full overflow-hidden">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <aside
          className={`bg-primary text-white fixed top-0 left-0 h-full z-50
            transform transition-transform duration-300
    w-72
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0 lg:static`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-white/20 flex justify-between items-center">
              <Link href="/">
                <img src="/logo2.png" className="w-20" />
              </Link>

              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex-grow py-3">
              {links.map((link) => (
                <NavLink key={link.name} link={link} />
              ))}
            </nav>

            <Button
              onClick={handleLogout}
              className="bg-secondary mx-3 mb-4 cursor-pointer"
            >
              Log Out
            </Button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="bg-primary sticky top-0 z-30 flex lg:justify-end justify-between p-4 text-white">
            <button
              className="block lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <PanelLeft />
            </button>

            <div className="flex gap-6 items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative focus:outline-none">
                    <Bell size={28} className="cursor-pointer" />

                    {notifications.length > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 
                 h-5 min-w-5 flex items-center justify-center px-1 text-xs"
                      >
                        {notifications.length}
                      </Badge>
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuSeparator />

                  <ScrollArea className="h-80">
                    {notifications?.length > 0 ? (
                      notifications.map((item, index) => (
                        <DropdownMenuItem
                          key={index}
                          className="flex flex-col items-start gap-1 cursor-pointer"
                        >
                          <p className="text-sm font-medium">
                            {item?.data?.title || "New Notification"}
                          </p>
                          <p className="text-sm text-gray-500 font-medium">
                            {(() => {
                              const date = new Date(item?.created_at);

                              const day = String(date.getDate()).padStart(
                                2,
                                "0",
                              );
                              const month = String(
                                date.getMonth() + 1,
                              ).padStart(2, "0");
                              const year = String(date.getFullYear()).slice(-2);

                              const hours = String(date.getHours()).padStart(
                                2,
                                "0",
                              );
                              const minutes = String(
                                date.getMinutes(),
                              ).padStart(2, "0");

                              return `${day}-${month}-${year}, ${hours}:${minutes}`;
                            })()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.message || item.description}
                          </p>
                          <p>{item.length}</p>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-muted-foreground text-center">
                        No notifications
                      </div>
                    )}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href={`/dashboard/${role}-profile`}>
                <img
                  src="/user.png"
                  className="h-9 w-9 rounded-full bg-white"
                />
              </Link>
            </div>
          </div>

          <div className="p-4 lg:p-4">{children}</div>
        </main>
      </div>
    </PrivateRoute>
  );
}
