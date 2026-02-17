"use client";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { useFetch } from "@/hooks/useFetch";
import { postApi } from "@/lib/apiHandler";
import { useRouter, useSearchParams } from "next/navigation"; // For URL persistence
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get active filter from URL (default to 'all')
  const activeFilter = searchParams.get("status") || "all";

  const [clients, setClients] = useState([]);
  const { data, isLoading, error, mutate } = useFetch("/specialist-booking");

  useEffect(() => {
    if (data) {
      const rawData = data?.data?.data ?? data;

      // 1. Newest First Sorting (by created_at)
      const sortedData = [...rawData].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      setClients(sortedData);
    }
  }, [data]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await postApi(`/update-booking-status/${id}`, {
        booking_status: newStatus,
      });

      if (response.status === 200) {
        toast.success(`Status updated to ${newStatus}`);
        mutate(); // Refresh data from server
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // 2. URL-based Filtering Logic
  const setFilter = (status) => {
    const params = new URLSearchParams(searchParams);
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`?${params.toString()}`);
  };

  const filteredClients =
    activeFilter === "all"
      ? clients
      : clients.filter((c) => c.booking_status === activeFilter);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-bold text-xl italic">
        Error loading data.
      </div>
    );

  const statusOptions = ["pending", "accepted", "rejected", "completed"];

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "accepted":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header & Persistent Filter Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Client Management
          </h1>
          <p className="text-gray-500 mt-1 italic">
            Showing {activeFilter} bookings (Newest first)
          </p>
        </div>

        {/* Filter Tabs (Syncs with URL) */}
        <div className="flex bg-gray-200/50 p-1 rounded-xl border border-gray-200">
          {["all", ...statusOptions].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                activeFilter === status
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Patient Details
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                  Status Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredClients.length > 0 ? (
                filteredClients.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-blue-50/10 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-sm border border-blue-100">
                          {row.patient_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {row.patient_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {row.patient_age} yrs • {row.patient_gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-gray-700">
                        {row.emergency_contact_number}
                      </div>
                      <div className="text-xs text-gray-400">
                        Guardian: {row.user?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-gray-700 font-medium capitalize">
                        {row.booking_type}
                      </div>
                      <div className="text-xs text-blue-500 font-semibold">
                        {" "}
                        {row.booking_type === "monthly" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-primary">
                            Month: {row.selected_dates_or_months[0]}
                          </span>
                        ) : (
                          <div className="text-gray-600 font-medium">
                            {row.created_at.split("T")[0]}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded text-[12px]">
                        {row.location_of_care}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      ${row.booking_amount}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={row.booking_status}
                        onChange={(e) =>
                          handleStatusChange(row.id, e.target.value)
                        }
                        className={`text-[11px] font-black uppercase px-2 py-1.5 rounded-lg border outline-none cursor-pointer ${getStatusStyles(row.booking_status)}`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-20 text-center text-gray-400 italic font-medium"
                  >
                    No {activeFilter !== "all" ? activeFilter : ""} bookings
                    found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;
