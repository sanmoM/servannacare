"use client";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFetch } from "@/hooks/useFetch";
import { postApi } from "@/lib/apiHandler";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeFilter = searchParams.get("status") || "all";

  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 5;

  const [clients, setClients] = useState([]);

  
  const { data, isLoading, error, mutate } = useFetch("/specialist-booking");

  useEffect(() => {
    if (data) {
      const rawData = data?.data?.data ?? data;
      const sortedData = [...rawData].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      setClients(sortedData);
    }
  }, [data]);

  // --- Helper to Update URL Params ---
  const updateParams = (newStatus, newPage) => {
    const params = new URLSearchParams(searchParams);

    if (newStatus) {
      if (newStatus === "all") params.delete("status");
      else params.set("status", newStatus);
      // Reset to page 1 when filter changes
      params.set("page", "1");
    }

    if (newPage) {
      params.set("page", newPage.toString());
    }

    router.push(`?${params.toString()}`);
  };

  const getSelectedDates = (row) => {
    let parsed;
    try {
      parsed =
        typeof row.selected_dates_or_months === "string"
          ? JSON.parse(row.selected_dates_or_months)
          : row.selected_dates_or_months;
    } catch (e) {
      
      return [];
    }
    if (!Array.isArray(parsed) || parsed.length === 0) return [];

    if (row.booking_type === "daily") {
      return parsed.map((d) => new Date(d));
    }

    if (row.booking_type === "monthly") {
      if (parsed[0]?.dates) {
        return parsed.flatMap((item) =>
          Array.isArray(item.dates) ? item.dates.map((d) => new Date(d)) : [],
        );
      }
      if (typeof parsed[0] === "string" && parsed[0].length === 7) {
        const [year, month] = parsed[0].split("-").map(Number);
        const daysInMonth = new Date(year, month, 0).getDate();
        return Array.from(
          { length: daysInMonth },
          (_, i) => new Date(year, month - 1, i + 1),
        );
      }
      return parsed.map((d) => new Date(d));
    }
    return [];
  };

  // const handleStatusChange = async (id, newStatus) => {
  //   const previousClients = [...clients];

  //   setClients((prev) =>
  //     prev.map((c) => (c.id === id ? { ...c, booking_status: newStatus } : c)),
  //   );

  //   try {
  //     const response = await postApi(`/update-booking-status/${id}`, {
  //       booking_status: newStatus,
  //     });

  //     if (response.status === 200) {
  //       toast.success(`Status updated to ${newStatus}`);
  //     } else {
  //       throw new Error("Failed");
  //     }
  //   } catch (err) {
  //     toast.error("Failed to update status");

  //     setClients(previousClients);
  //   }
  // };

  const handleStatusChange = async (id, newStatus) => {
    const previousClients = [...clients];

    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, booking_status: newStatus } : c)),
    );

    toast.success(`Status updated to ${newStatus}`);

    try {
      const response = await postApi(`/update-booking-status/${id}`, {
        booking_status: newStatus,
      });

      if (response.status !== 200) {
        throw new Error("Failed");
      }
    } catch (err) {
      toast.error("Failed to update status");

      setClients(previousClients);
    }
  };

  const filteredClients =
    activeFilter === "all"
      ? clients
      : clients.filter((c) => c.booking_status === activeFilter);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

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
        return "bg-rose-100 text-red-700 border-rose-200";
      case "completed":
        return "bg-blue-100 text-green-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Client Management
          </h1>
          <p className="text-gray-500 mt-1 italic">
            Showing {activeFilter} bookings (Newest first)
          </p>
        </div>

        <div className="flex bg-gray-200/50 p-1 rounded-xl border border-gray-200">
          {["all", ...statusOptions].map((status) => (
            <button
              key={status}
              onClick={() => updateParams(status, null)}
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
              {currentItems.length > 0 ? (
                currentItems.map((row) => {
                  const selectedDates = getSelectedDates(row);
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-blue-50/10 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-sm border border-blue-100">
                            {row?.patient_name?.charAt(0)}
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-sm font-medium text-gray-700 capitalize">
                              {row.booking_type}
                            </div>
                            <div className="text-[11px] text-blue-500 font-bold">
                              {row.booking_type === "monthly" ? (
                                (() => {
                                  const parsed =
                                    typeof row.selected_dates_or_months ===
                                    "string"
                                      ? JSON.parse(row.selected_dates_or_months)
                                      : row.selected_dates_or_months;
                                  const monthKey =
                                    parsed?.[0]?.month ||
                                    (typeof parsed?.[0] === "string"
                                      ? parsed[0]
                                      : null);
                                  if (!monthKey) return "--";
                                  return (
                                    <span className="bg-purple-50 text-primary px-2 py-0.5 rounded border border-purple-100">
                                      {new Date(
                                        monthKey.length === 7
                                          ? monthKey + "-01"
                                          : monthKey,
                                      ).toLocaleString("default", {
                                        month: "long",
                                        year: "numeric",
                                      })}
                                    </span>
                                  );
                                })()
                              ) : (
                                <span className="text-gray-500">
                                  {row.created_at.split("T")[0]}
                                </span>
                              )}
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="p-2 cursor-pointer bg-white border border-gray-200 text-gray-400 hover:text-primary hover:border-blue-200 rounded-lg shadow-sm transition-all ">
                                <Eye size={16} />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px]">
                              <DialogHeader>
                                <DialogTitle>Calendar View</DialogTitle>
                              </DialogHeader>
                              <div className="flex justify-center py-4">
                                <Calendar
                                  mode="multiple"
                                  selected={selectedDates}
                                  defaultMonth={
                                    selectedDates.length
                                      ? selectedDates[0]
                                      : new Date()
                                  }
                                  disabled={(date) =>
                                    !selectedDates.some(
                                      (d) =>
                                        d.toDateString() ===
                                        date.toDateString(),
                                    )
                                  }
                                  className="rounded-md border shadow-sm"
                                />
                              </div>
                              <div className="bg-blue-50 p-3 rounded-lg text-xs text-primary font-medium">
                                Highlighting dates for{" "}
                                <strong>{row.booking_type}</strong> plan.
                              </div>
                            </DialogContent>
                          </Dialog>
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
                  );
                })
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

        {/* --- Pagination Controls (URL Driven) --- */}
        {filteredClients.length > itemsPerPage && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {indexOfFirstItem + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(indexOfLastItem, filteredClients.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {filteredClients.length}
              </span>{" "}
              results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => updateParams(null, currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => updateParams(null, i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                      currentPage === i + 1
                        ? "bg-primary text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => updateParams(null, currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
