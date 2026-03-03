"use client";

import LoadingSpinner from "@/components/shared/LoadingSpin";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Info,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  const [stats, setStats] = useState(null);
  console.log("stts", stats?.data);

  const { data, isLoading, error } = useFetch("/dashboard-data");
  useEffect(() => {
    if (data) {
      setStats(data?.data?.data ?? data);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;

  if (loading) {
    return <LoadingSpinner />;
  }

  const userDashboardStats = [
    {
      id: 1,
      title: "Total Bookings",
      icon: <Calendar size={28} />,
      count: stats?.data?.total_booking,
      color: "blue",
    },
    {
      id: 2,
      title: "Completed Services",
      icon: <CheckCircle size={28} />,
      count: stats?.data?.total_booking_completed,
      color: "green",
    },
    {
      id: 3,
      title: "Pending Services",
      icon: <Clock size={28} />,
      count: stats?.data?.total_booking_pending,
      color: "yellow",
    },
    {
      id: 4,
      title: "Total Spent",
      icon: <DollarSign size={28} />,
      count: `KSh ${Number(stats?.data?.total_booking_amount).toLocaleString()}`,
      color: "purple",
    },
  ];

  const specialistDashboardStats = [
    {
      id: 1,
      title: "Total Jobs Received",
      icon: <Calendar size={28} />,
      count: stats?.data?.total_booking ?? 0,
      color: "blue",
    },
    {
      id: 2,
      title: "Jobs Completed",
      icon: <CheckCircle size={28} />,
      count: stats?.data?.total_booking_completed ?? 0,
      color: "green",
    },
    {
      id: 3,
      title: "Pending Jobs",
      icon: <Clock size={28} />,
      count: stats?.data?.total_booking_pending ?? 0,
      color: "yellow",
    },
    {
      id: 4,
      title: "Total Earnings",
      icon: <DollarSign size={28} />,
      count: `KSh ${Number(stats?.data?.total_booking_amount ?? 0).toLocaleString()}`,
      color: "purple",
    },
    {
      id: 5,
      title: "Average Rating",
      icon: <Star size={28} />,
      count: Number(stats?.data?.average_rating ?? 0).toFixed(1),
      color: "pink",
    },
  ];

  const agencyDashboardStats = [
    {
      id: 1,
      title: "Total Jobs Received",
      icon: <Calendar size={28} />,
      count: stats?.data?.total_booking ?? 0,
      color: "blue",
    },
    {
      id: 2,
      title: "Jobs Completed",
      icon: <CheckCircle size={28} />,
      count: stats?.data?.total_booking_completed ?? 0,
      color: "green",
    },
    {
      id: 3,
      title: "Pending Jobs",
      icon: <Clock size={28} />,
      count: stats?.data?.total_booking_pending ?? 0,
      color: "yellow",
    },
    {
      id: 4,
      title: "Total Earnings",
      icon: <DollarSign size={28} />,
      count: `KSh ${stats?.data?.total_booking_amount ?? 0}`,
      color: "purple",
    },
    {
      id: 5,
      title: "Average Rating",
      icon: <Star size={28} />,
      count: stats?.data?.average_rating ?? 0,
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
