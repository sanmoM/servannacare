"use client";

import LoadingSpinner from "@/components/shared/LoadingSpin";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Info,
  Star,
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  const isProfileCompleted = Boolean(user?.is_profile_completed);
  if (loading) {
    return <LoadingSpinner />;
  }

  const userDashboardStats = [
    {
      id: 1,
      title: "Total Bookings",
      icon: <Calendar size={28} />,
      count: 12,
      color: "blue",
    },
    {
      id: 2,
      title: "Completed Services",
      icon: <CheckCircle size={28} />,
      count: 8,
      color: "green",
    },
    {
      id: 3,
      title: "Pending Services",
      icon: <Clock size={28} />,
      count: 4,
      color: "yellow",
    },
    {
      id: 4,
      title: "Total Spent",
      icon: <DollarSign size={28} />,
      count: "KSh 45,000",
      color: "purple",
    },
  ];

  const specialistDashboardStats = [
    {
      id: 1,
      title: "Total Jobs Received",
      icon: <Calendar size={28} />,
      count: 34,
      color: "blue",
    },
    {
      id: 2,
      title: "Jobs Completed",
      icon: <CheckCircle size={28} />,
      count: 27,
      color: "green",
    },
    {
      id: 3,
      title: "Pending Jobs",
      icon: <Clock size={28} />,
      count: 5,
      color: "yellow",
    },
    {
      id: 4,
      title: "Total Earnings",
      icon: <DollarSign size={28} />,
      count: "KSh 125,400",
      color: "purple",
    },

    {
      id: 5,
      title: "Average Rating",
      icon: <Star size={28} />,
      count: "4.8",
      color: "pink",
    },
  ];
  const agencyDashboardStats = [
    {
      id: 1,
      title: "Total Jobs Received",
      icon: <Calendar size={28} />,
      count: 34,
      color: "blue",
    },
    {
      id: 2,
      title: "Jobs Completed",
      icon: <CheckCircle size={28} />,
      count: 27,
      color: "green",
    },
    {
      id: 3,
      title: "Pending Jobs",
      icon: <Clock size={28} />,
      count: 5,
      color: "yellow",
    },
    {
      id: 4,
      title: "Total Earnings",
      icon: <DollarSign size={28} />,
      count: "KSh 125,400",
      color: "purple",
    },

    {
      id: 5,
      title: "Average Rating",
      icon: <Star size={28} />,
      count: "4.8",
      color: "pink",
    },
  ];

  let renderStats = [];
  if (user?.role === "user") {
    renderStats = userDashboardStats;
  } else if (user?.role === "specialist") {
    renderStats = specialistDashboardStats;
  } else if (user?.role === "agency") {
    renderStats = agencyDashboardStats;
  } else if (user?.role === "care_institutions") {
    renderStats = agencyDashboardStats;
  }

  const gradientColors = {
    blue: "from-blue-500 to-blue-700",
    green: "from-green-500 to-green-700",
    yellow: "from-yellow-500 to-yellow-700",
    purple: "from-purple-500 to-purple-700",
    pink: "from-pink-500 to-pink-700",
  };

  return (
    <div>
      {/* {!isProfileCompleted && (
        <div className="mt-6 mb-8 rounded-xl border border-amber-300 bg-amber-100 p-5 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-amber-900">
                Your profile is not complete
              </h3>
              <p className="text-sm text-amber-800 mt-1 max-w-lg">
                Complete your profile to get verified faster and start receiving
                more.
              </p>
            </div>

            <Link
              href={`/dashboard/${user?.role}-profile`}
              className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-6 py-3 text-white font-medium hover:bg-amber-700 transition"
            >
              Complete Profile
            </Link>
          </div>
        </div>
      )} */}
      {/* {!user?.is_profile_completed && (
        <p className="p-4 mb-4 flex gap-2 text-base items-center font-medium rounded-xl text-white bg-red-400">
          <Info /> Your account is not complete.
        </p>
      )}

      {user?.is_profile_completed && (
        <div className="p-4 mb-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <div className="text-green-700 font-medium">
            Your profile is verified as{" "}
            <span className="capitalize font-semibold">
              {user?.subRole
                ? user?.subRole?.replace(/-/g, " ")
                : user?.role?.replace(/-/g, " ")}
            </span>
          </div>
        </div>
      )} */}

      <h1 className="sectionHeading">
        Hi <span className="text-primary">{user?.name || user?.email}!</span>
      </h1>
      <p className="mt-2 text-sm sm:text-base text-gray-600">
        Welcome to Servannacare!
      </p>

      <div className="grid  sm:grid-cols-2 mt-10 gap-4 lg:gap-6 lg:grid-cols-4">
        {renderStats.map((stats) => (
          <div
            key={stats.id}
            className={`bg-gradient-to-tl ${
              gradientColors[stats.color]
            } p-5 rounded-2xl shadow-lg text-white`}
          >
            <div className="text-white mb-4">{stats.icon}</div>

            <p className="text-sm font-medium opacity-90">{stats.title}</p>
            <h5 className="lg:text-2xl text-xl font-bold mt-1">
              {stats.count}
            </h5>
          </div>
        ))}
      </div>
    </div>
  );
}
