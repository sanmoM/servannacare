import React from "react";

const page = () => {
  const clients = [
    {
      id: 1,
      name: "Rahim Uddin",
      phone: "+8801777777777",
      email: "rahim@example.com",
      photo: "/images/users/rahim.jpg",

      plan: "Gold", // Silver / Gold / Platinum
      status: "Active",

      bookingStart: "01 Dec 2025",
      bookingEnd: "07 Dec 2025",
      totalDays: 7,

      location: "Dhaka, Bangladesh",
      address: "Banani, Road 12",

      payment: {
        totalAmount: 5600,
        paid: 5600,
        pending: 0,
        paymentStatus: "Paid",
      },

      rating: 4.8,
    },

    {
      id: 2,
      name: "Sara Hossain",
      phone: "+8801999999999",
      email: "sara@example.com",
      photo: "/images/users/sara.jpg",

      plan: "Silver",
      status: "Upcoming",

      bookingStart: "10 Jan 2026",
      bookingEnd: "10 Feb 2026",
      totalDays: 30,

      location: "Chittagong, Bangladesh",
      address: "GEC Circle",

      payment: {
        totalAmount: 18000,
        paid: 9000,
        pending: 9000,
        paymentStatus: "Partially Paid",
      },

      rating: null,
    },

    {
      id: 3,
      name: "Mahmud Hasan",
      phone: "+8801555555555",
      email: "mahmud@example.com",
      photo: "/images/users/mahmud.jpg",

      plan: "Platinum",
      status: "Completed",

      bookingStart: "11 Oct 2025",
      bookingEnd: "12 Oct 2025",
      totalDays: 1,

      location: "Sylhet, Bangladesh",
      address: "Amberkhana",

      payment: {
        totalAmount: 800,
        paid: 800,
        pending: 0,
        paymentStatus: "Paid",
      },

      rating: 4.3,
    },
  ];

  const statusColors = {
    Upcoming: "bg-amber-300",
    Completed: "bg-green-300",
    Ongoing: "bg-blue-300",
    Cancelled: "bg-red-300",
    Active: "bg-blue-300",
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="sectionHeading">My Clients</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Manage all your client bookings in one place
        </p>
      </div>
      <div className=" overflow-x-auto mt-12 w-full">
        <table className="min-w-[700px] w-full text-sm text-left text-gray-700 border rounded-xl shadow">
          <thead className="bg-gray-100 border-b">
            <tr className="text-xs sm:text-sm lg:text-base">
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                #
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Name
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Phone
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Email
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Plan
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Booking Start
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {clients.map((row, indx) => (
              <tr
                key={row.id}
                className="bg-white border-b hover:bg-gray-50 transition text-xs sm:text-sm lg:text-base"
              >
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {indx + 1}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.name}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.phone}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.email}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.plan}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.bookingStart}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  <span
                    className={`${
                      statusColors[row.status]
                    } text-white px-3 py-1 rounded-full text-xs sm:text-sm`}
                  >
                    {row.status}
                  </span>
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
