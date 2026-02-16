"use client";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { useFetch } from "@/hooks/useFetch";
import { postApi } from "@/lib/apiHandler";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast"; // Assuming you use toast for feedback

const Page = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error, mutate } = useFetch("/specialist-booking");

  useEffect(() => {
    if (data) {
      setClients(data?.data?.data ?? data);
    }
  }, [data]);

  const handleStatusChange = async (id, newStatus) => {
    console.log("id", id);
    console.log("newStatus", newStatus);

    try {
      const response = await postApi(`/update-booking-status/${id}`, {
        booking_status: newStatus,
      });

      if (response.status === 200) {
        toast.success(`Status updated to ${newStatus}`);
      }

      mutate();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        Error loading data. Please try again.
      </div>
    );

  const filteredClients = clients?.filter((client) =>
    client.patient_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const statusOptions = ["pending", "accepted", "rejected", "completed"];

  const getStatusStyles = (status) => {
    switch (status) {
      case "accept":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "reject":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "complete":
        return "bg-blue-100 text-green-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Client Management
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor bookings and manage patient care status.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search patient name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
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
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                  Action / Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredClients.length > 0 ? (
                filteredClients.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    {/* Patient */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold text-sm">
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

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 font-medium">
                        {row.emergency_contact_number}
                      </div>
                      <div className="text-xs text-gray-400">
                        Guardian: {row.user?.name}
                      </div>
                    </td>

                    {/* Schedule */}
                    <td className="px-6 py-4 text-sm">
                      {row.booking_type === "monthly" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-primary">
                          Month: {row.selected_dates_or_months[0]}
                        </span>
                      ) : (
                        <div className="text-gray-600 font-medium">
                          {row.created_at.split("T")[0]}
                        </div>
                      )}
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        {row.location_of_care}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-bold">
                        ${row.booking_amount}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-6 py-4 text-center">
                      <select
                        value={row.booking_status}
                        onChange={(e) =>
                          handleStatusChange(row.id, e.target.value)
                        }
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer transition-all ${getStatusStyles(row.booking_status)}`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt.toUpperCase()}
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
                    className="px-6 py-12 text-center text-gray-400 italic"
                  >
                    No clients found matching your search.
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
