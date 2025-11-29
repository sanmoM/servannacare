import Table from "@/components/shared/Table";
import React from "react";

const page = () => {
  const appointments = [
    {
      id: 1,
      serviceName: "Nurse Care",
      providerName: "Jassy Jea",
      startDate: "23 Jan 2024",
      endDate: "10 Feb 2024",
      totalDays: "18 Days",
      status: "Pending",
    },
    {
      id: 2,
      serviceName: "Elderly Assistance",
      providerName: "Maria Simon",
      startDate: "01 Feb 2024",
      endDate: "12 Feb 2024",
      totalDays: "11 Days",
      status: "Completed",
    },
    {
      id: 3,
      serviceName: "Medical Nurse",
      providerName: "Kelvin Mark",
      startDate: "10 Jan 2024",
      endDate: "20 Jan 2024",
      totalDays: "10 Days",
      status: "Ongoing",
    },
    {
      id: 4,
      serviceName: "Home Care Support",
      providerName: "Sofia Rahman",
      startDate: "05 Feb 2024",
      endDate: "15 Feb 2024",
      totalDays: "10 Days",
      status: "Cancelled",
    },
  ];

  const columns = [
  { label: "Service Name", accessor: "serviceName" },
  { label: "Provider Name", accessor: "providerName" },
  { label: "Start Date", accessor: "startDate" },
  { label: "End Date", accessor: "endDate" },
  { label: "Total Days", accessor: "totalDays" },
  { label: "Status", accessor: "status" },
];

  return (
    <div>
      <h1 className="sectionHeading">Your Appointment</h1>

      <div className="mt-6">
        <Table columns={columns} data={appointments} />
      </div>
    </div>
  );
};

export default page;
