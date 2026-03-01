import React from "react";

const page = () => {
  const notes = [
    {
      id: 1,
      employeeName: "John Williams",
      note: "Client requested morning shift only.",
      date: "2025-01-10",
    },
    {
      id: 2,
      employeeName: "Sarah Ahmed",
      note: "Employee prefers Chittagong-based jobs only.",
      date: "2025-01-12",
    },
    {
      id: 3,
      employeeName: "Mahfuz Rahman",
      note: "Assigned for weekend night shift.",
      date: "2025-01-15",
    },
  ];
  return (
    <div>
      <div className="mb-10">
        <h1 className="sectionHeading">Notes</h1>
      </div>

      {/* If no notes */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-12">
          <p className="text-sm mb-4 font-semibold text-gray-700">
            You have no note yet!
          </p>
        </div>
      ) : (
        <div className="mt-6 w-full overflow-x-auto">
          <table className="min-w-[600px] w-full text-left text-gray-700 border rounded-xl shadow">
            <thead className="bg-gray-100 border-b">
              <tr className="text-sm">
                <th className="px-6 py-3 font-semibold">Employee</th>
                <th className="px-6 py-3 font-semibold">Note</th>
                <th className="px-6 py-3 font-semibold">Date</th>
              </tr>
            </thead>

            <tbody>
              {notes.map((n) => (
                <tr
                  key={n.id}
                  className="bg-white border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {n.employeeName}
                  </td>
                  <td className="px-6 py-4">{n.note}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{n.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default page;
