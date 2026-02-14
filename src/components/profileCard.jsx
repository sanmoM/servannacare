"use client";

import React from "react";
import {
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useLocalUser from "@/hooks/useLocalUser";
import toast from "react-hot-toast";

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-2 text-sm text-gray-600">
    <Icon className="w-4 h-4 text-gray-400" />
    <span>
      <span className="font-medium text-gray-700">{label}:</span> {value}
    </span>
  </div>
);

const ProfileCard = ({ profile }) => {
  // console.log(profile);
  const router = useRouter();
  const { user, loaded } = useLocalUser();

  const handleBookNow = () => {
    if (!loaded) return;

    const bookingUrl = `/bookingForm?category=${profile.subRole?.toLowerCase() ?? "unknown"}&id=${profile.id}`;

    if (!user) {
      router.push(
        `/register?role=user&redirect=${encodeURIComponent(bookingUrl)}`,
      );

      return;
    }

    if (user?.role != "user") {
      toast.error(`${user?.subRole} can't make Booking`);
      router.push(`/dashboard/${user?.role}-profile`);
      return;
    }
    router.push(bookingUrl);
  };
  return (
    <div
      data-aos="fade-up"
      className="w-full  flex flex-col overflow-hidden bg-white border border-gray-200 rounded-2xl  transition-all duration-300 ease-in-out hover:shadow-md"
    >
      <div className="w-full  flex items-center justify-center p-6 lg:rounded-l-2xl relative">
        <div className="absolute inset-0">
          <div className="h-1/2 bg-[#bb92ad5b]"></div>
          <div className="h-1/2 bg-white"></div>
        </div>

        <div className="relative z-10">
          <img
            className="object-cover w-40 h-40 rounded-full border-4 border-white shadow-lg"
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${profile?.profilePhoto}`}
            alt={`Photo of ${profile?.name ?? "User"}`}
            onError={(e) => {
              e.target.onerror = null;
              const firstChar = profile?.name ? profile.name.charAt(0) : "U";
              e.target.src = `https://placehold.co/160x160/6366f1/white?text=${firstChar}`;
            }}
          />
        </div>
      </div>

      <div className="flex flex-col justify-between w-full  p-5">
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                {profile.name}
              </h2>
              <p className="text-sm font-medium text-primary">
                {profile.subRole}
              </p>
            </div>
            <div className="flex items-center px-2.5 py-1 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-lg border border-yellow-300 shrink-0">
              <Star
                className="w-4 h-4 mr-1 text-yellow-500"
                fill="currentColor"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2.5 mt-4">
            {profile.experience && (
              <InfoItem
                icon={Briefcase}
                label="Experience"
                value={`${profile.experience} years`}
              />
            )}
            <InfoItem
              icon={GraduationCap}
              label="Education"
              value={profile.education}
            />
            <InfoItem icon={MapPin} label="Location" value={profile.location} />
          </div>
        </div>

        <div className="flex gap-4 mt-5 pt-5 border-t border-gray-100">
          <div className="flex-1">
            <Link
              href={`/profile?category=${profile.subRole?.toLowerCase()}&id=${
                profile.id
              }`}
            >
              <Button className="w-full cursor-pointer" variant="outline">
                View Profile
              </Button>
            </Link>
          </div>
          <div className="flex-1">
            <Button
              onClick={handleBookNow}
              disabled={!loaded}
              className="w-full cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
