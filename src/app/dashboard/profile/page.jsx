import { Button } from "@/components/ui/button";
import { Calendar, Camera, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const user = {
    name: "John Doe",
    phone: "+880 1234 567890",
    email: "johndoe@example.com",
    profilePic: "/profile-pic.jpg",
    location: "New York, NY",
    joined: "January 2025"
  };
    const infoItems = [
    { icon: <Mail className="w-5 h-5 text-primary" />, label: "Email Address", value: user.email },
    { icon: <Phone className="w-5 h-5 text-primary" />, label: "Phone Number", value: user.phone },
    { icon: <MapPin className="w-5 h-5 text-primary" />, label: "Location", value: user.location },
    { icon: <Calendar className="w-5 h-5 text-primary" />, label: "Joined Since", value: user.joined },
  ];
  return (
    <div className="">
      <h1 className="sectionHeading mb-4">My Profile</h1>

      <div className="border flex flex-col gap-8 md:flex-row  lg:p-8 p-4 rounded-2xl">
        <div className="flex flex-col justify-center items-center">
          <div className="relative h-36 w-36  lg:w-48 lg:h-48  rounded-full border-4 border-primary overflow-hidden shadow-lg">
            <img
              className="object-cover w-full h-full  "
              src={
                "https://images.unsplash.com/photo-1672843192615-5913ef88bf17?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt={`profile`}
            />
            <div className="absolute flex justify-center text-white bottom-0 py-2 bg-gray-400/50 w-full right-0">
              <Camera className="cursor-pointer" />
            </div>
          </div>
          <h1 className="text-center text-xl text-gray-600 font-semibold mt-4">
            Jhon Doe
          </h1>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            {infoItems.map((item, index) => (
              <div
                key={index}
                className="flex  space-x-3 bg-white py-4 px-4 md:px-8 rounded-lg"
              >
                {item.icon}
                <div>
                  <p className="text-sm  text-gray-500">{item.label}</p>
                  <p className="font-medium text-sm lg:text-base text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <Button>
                Update Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
