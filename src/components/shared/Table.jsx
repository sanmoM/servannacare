"use client";

import React from "react";

const statusColors = {
  Pending: "bg-amber-500",
  Completed: "bg-green-600",
  Ongoing: "bg-blue-600",
  Cancelled: "bg-red-600",
};

export default function Table({ columns = [], data = [], onCancel }) {
  return (
    <div className="w-full max-w-full overflow-x-auto bg-white shadow rounded-xl border border-gray-200">
      <table className="w-full text-sm text-left text-gray-700 min-w-max">
        <thead className="bg-gray-100 border-b">
          <tr className="text-xs sm:text-sm lg:text-base">
            {columns.map((col) => (
              <th key={col.accessor} className="px-6 py-3 lg:py-6 whitespace-nowrap font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="bg-white border-b text-xs sm:text-sm lg:text-base hover:bg-gray-50 transition"
            >
              {columns.map((col) => {
                const value = row[col.accessor];

                // Status Badge
                if (col.accessor === "status") {
                  return (
                    <td key={col.accessor} className="px-6 py-4 lg:py-6">
                      <span
                        className={`${statusColors[value]} text-white px-3 py-1 rounded-full text-xs sm:text-sm`}
                      >
                        {value}
                      </span>
                    </td>
                  );
                }

                // Action Button
                if (col.accessor === "action") {
                  return (
                    <td key={col.accessor} className="px-6 py-4 lg:py-6">
                      {row.status === "Pending" || row.status === "Ongoing" ? (
                        <button
                          onClick={() => onCancel(row)}
                          className="px-4 py-1 text-sm bg-red-400 cursor-pointer hover:bg-red-500 text-white rounded-md transition"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-gray-400 italic text-sm">N/A</span>
                      )}
                    </td>
                  );
                }

                return (
                  <td key={col.accessor} className="px-6 py-4 lg:py-6 whitespace-nowrap">
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
