"use client";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { useFetch } from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

const page = () => {
  const [clients, setClients] = useState(null);
  const { data, isLoading, error } = useFetch("/specialist-booking");

  useEffect(() => {
    if (data) {
      setClients(data?.data?.data ?? data);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;

  const statusColors = {
    pending: "bg-yellow-300 text-yellow-900",
    completed: "bg-green-300 text-green-900",
    ongoing: "bg-blue-300 text-blue-900",
    cancelled: "bg-red-300 text-red-900",
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900">My Clients</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Manage all your client bookings in one place
        </p>
      </div>

   <div className="overflow-x-auto mt-8 w-full">
  <table className="w-full table-auto border rounded-xl shadow-lg divide-y divide-gray-200">
    <thead className="bg-gray-100">
      <tr className="text-xs sm:text-sm lg:text-base font-semibold text-gray-700">
        <th className="px-4 py-2">#</th>
        <th className="px-4 py-2">Patient</th>
        <th className="px-4 py-2">Contact</th>
        <th className="px-4 py-2">Booking</th>
        <th className="px-4 py-2">Location</th>
        <th className="px-4 py-2">Status</th>
        <th className="px-4 py-2">Payment</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {clients?.map((row, idx) => (
        <tr key={row.id} className="hover:bg-gray-50 transition">
          <td className="px-4 py-2">{idx + 1}</td>
          <td className="px-4 py-2">
            <div className="font-medium">{row.patient_name}</div>
            <div className="text-gray-500 text-xs">
              Age: {row.patient_age}, {row.patient_gender}
            </div>
          </td>
          <td className="px-4 py-2 text-gray-600">
            {row.emergency_contact_number || "N/A"} <br />
            {row.user?.name || "N/A"}
          </td>
          <td className="px-4 py-2 text-gray-600">
            {row.care_start_date} → {row.care_end_date}
          </td>
          <td className="px-4 py-2 text-gray-600">{row.location_of_care}</td>
          <td className="px-4 py-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                statusColors[row.booking_status] || "bg-gray-200 text-gray-700"
              }`}
            >
              {row.booking_status.charAt(0).toUpperCase() +
                row.booking_status.slice(1)}
            </span>
          </td>
          <td className="px-4 py-2 text-gray-700 font-medium">
            ${row.booking_amount}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default page;
