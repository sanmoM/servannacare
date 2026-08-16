"use client";

import React, { useState } from "react";
import {
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle,
  Home,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-2 text-sm text-gray-600">
    <Icon className="w-4 h-4 text-gray-400" />
    <span>
      <span className="font-medium text-gray-700">{label}:</span> {value}
    </span>
  </div>
);

const ProfileCard = ({ profile }) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [imgSrc, setImgSrc] = useState(
    `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${profile?.profilePhoto}`,
  );

  const today = new Date();

  const hasSchedule =
    Array.isArray(profile?.schedule) && profile.schedule.length > 0;

  const availableDates = profile?.schedule?.flatMap((s) => s.date || []) || [];

  const isAvailable = availableDates.some(
    (d) => new Date(d).setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0),
  );

  let statusLabel = "Not Scheduled";
  let statusStyle = "bg-gray-100 text-gray-600";

  if (hasSchedule) {
    if (isAvailable) {
      statusLabel = "Available";
      statusStyle = "bg-green-100 text-green-700";
    } else {
      statusLabel = "Unavailable";
      statusStyle = "bg-red-100 text-red-600";
    }
  }

  const avgRating = parseFloat(profile.review_avg_rating || 0);
  const reviewCount = profile.review_count || 0;
  const hasRating = reviewCount > 0;

  // Extract preferred living/service arrangement (e.g. LIVE IN / DAYBURG)
  const getPreferredArrangements = () => {
    let raw =
      profile?.preferred ||
      profile?.house_manager?.preferred ||
      profile?.services ||
      profile?.service;
    if (!raw) return [];
    if (!Array.isArray(raw)) raw = [raw];

    return raw
      .filter(Boolean)
      .map((p) => {
        const str = String(p).trim();
        const lower = str.toLowerCase();
        if (lower.includes("live")) return "LIVE IN";
        if (lower.includes("day")) return "DAYBURG";
        return str.toUpperCase();
      })
      .filter((v, i, a) => a.indexOf(v) === i);
  };

  const preferredArrangements = getPreferredArrangements();

  const handleBookNow = () => {
    if (loading) return;

    const category = profile.subRole
      ? profile.subRole.toLowerCase().replace(/\s+/g, "-")
      : "unknown";

    const isHouseFlow =
      profile.type === "house-manager" || profile.type === "agency-employee";

    const basePath = isHouseFlow ? "/houseManagerBookingForm" : "/bookingForm";

    const bookingUrl = `${basePath}?category=${category}&id=${profile.id}`;

    if (!user) {
      router.push(
        `/register?role=user&redirect=${encodeURIComponent(bookingUrl)}`,
      );
      return;
    }

    if (user?.role !== "user") {
      toast.error(`${user?.subRole} can't make booking`);
      router.push(`/dashboard/${user?.role}-profile`);
      return;
    }

    router.push(bookingUrl);
  };

  return (
    <div className="w-full flex flex-col overflow-hidden bg-white border border-gray-200 rounded-2xl hover:shadow-md">
      <div className="w-full flex items-center justify-center p-6 relative">
        <div className="absolute inset-0">
          <div className="h-1/2 bg-[#bb92ad5b]"></div>
          <div className="h-1/2 bg-white"></div>
        </div>

        <div className="relative z-10">
          <Image
            src={imgSrc}
            alt={`Photo of ${profile?.name ?? "User"}`}
            width={160}
            height={160}
            className="object-cover w-40 h-40 rounded-full border-4 border-white shadow-lg"
            onError={() => {
              const firstChar = profile?.name?.charAt(0) || "U";
              setImgSrc(
                `https://placehold.co/160x160/6366f1/white?text=${firstChar}`,
              );
            }}
          />
        </div>
      </div>

      <div className="flex flex-col h-full w-full p-5">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                {profile?.name || profile?.fullName}
              </h2>

              <p className="text-sm font-medium text-primary">
                {profile.subRole}{" "}
                <span className="text-purple-800">
                  {profile.type === "agency-employee" && "(AGENCY LISTED)"}
                </span>
              </p>
{/* 
              {preferredArrangements.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {preferredArrangements.map((item, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase ${
                        item === "LIVE IN"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : "bg-teal-100 text-teal-800 border border-teal-200"
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )} */}
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              {hasRating && (
                <div className="flex items-center px-3 py-1 rounded-lg bg-yellow-50 border border-yellow-100">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(avgRating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-gray-700 font-medium">
                    ({reviewCount})
                  </span>
                </div>
              )}

              {(!hasRating || hasSchedule) && (
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle}`}
                >
                  {statusLabel}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2.5 mt-4">
            {preferredArrangements.length > 0 && (
              <InfoItem
                icon={Home}
                label="Arrangement"
                value={preferredArrangements.join(" / ")}
              />
            )}
            {profile.experience && (
              <InfoItem
                icon={Briefcase}
                label="Experience"
                value={`${profile.experience} years`}
              />
            )}
            {profile.education && (
              <InfoItem
                icon={GraduationCap}
                label="Education"
                value={profile.education}
              />
            )}
            {profile.location && (
              <InfoItem
                icon={MapPin}
                label="Location"
                value={profile.location}
              />
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-5 pt-5 border-t">
          <div className="flex-1">
            <Link
              href={`/profile?type=${profile.type?.toLowerCase()}&id=${profile.id}`}
            >
              <Button className="w-full cursor-pointer" variant="outline">
                View Profile
              </Button>
            </Link>
          </div>

          <div className="flex-1">
            <Button
              onClick={handleBookNow}
              disabled={loading}
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
