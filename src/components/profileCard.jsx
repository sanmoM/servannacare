"use client";

import React, { useState } from "react";
import {
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  CheckCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { SubscriptionPlans } from "./shared/Plan";
import CustomModal from "./shared/CustomModal";
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
  const router = useRouter();
  const { user, loaded } = useLocalUser();

  const handleBookNow = () => {
    if (!loaded) return;

    const bookingUrl = `/bookingForm?category=${profile.category.toLowerCase()}&id=${profile.id}`;

    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(bookingUrl)}`);
      return;
    }

    if (user.role != "user") {
      toast.error(`${user?.subRole} can't make Booking`);
      return;
    }
    router.push(bookingUrl);
  };
  return (
    <div
      data-aos="fade-up"
      className="w-full  flex flex-col overflow-hidden bg-white border border-gray-200 rounded-2xl  transition-all duration-300 ease-in-out hover:shadow-md"
    >
      {/* Photo Section */}
      <div className="w-full  flex items-center justify-center p-6 lg:rounded-l-2xl relative">
        {/* Half background */}
        <div className="absolute inset-0">
          <div className="h-1/2 bg-[#bb92ad5b]"></div>
          <div className="h-1/2 bg-white"></div>
        </div>

        {/* Image on top */}
        <div className="relative z-10">
          <img
            className="object-cover w-40 h-40 rounded-full border-4 border-white shadow-lg"
            src={profile.photo}
            alt={`Photo of ${profile.name}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/160x160/6366f1/white?text=${profile.name.charAt(
                0,
              )}`;
            }}
          />
        </div>
      </div>

      {/* Info & Actions */}
      <div className="flex flex-col justify-between w-full  p-5">
        {/* Name & Rating */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                {profile.name}
              </h2>
              <p className="text-sm font-medium text-primary">
                {profile.category}
              </p>
            </div>
            <div className="flex items-center px-2.5 py-1 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-lg border border-yellow-300 shrink-0">
              <Star
                className="w-4 h-4 mr-1 text-yellow-500"
                fill="currentColor"
              />
              {profile.rating.toFixed(1)}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2.5 mt-4">
            <InfoItem
              icon={Briefcase}
              label="Experience"
              value={`${profile.experience} years`}
            />
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
              href={`/profile?category=${profile.category.toLowerCase()}&id=${
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

          {/* <div className="flex-1">
            <Dialog >
              <DialogTrigger asChild>
                <Button className="w-full" onClick={() => setOpenModal(true)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-7xl">
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                  <DialogDescription>
                   
                  </DialogDescription>
                </DialogHeader>
                
         
              </DialogContent>
            </Dialog>
          </div> */}
        </div>
      </div>

      {/* Custom Modal */}
      {/* <CustomModal isOpen={openModal} onClose={() => setOpenModal(false)}>
        

        <SubscriptionPlans />

        
      </CustomModal> */}
    </div>
  );
};

export default ProfileCard;
