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

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-2 text-sm text-gray-600">
    <Icon className="w-4 h-4 text-gray-400" />
    <span>
      <span className="font-medium text-gray-700">{label}:</span> {value}
    </span>
  </div>
);

const ProfileCard = ({ profile }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="w-full max-w-2xl flex flex-col lg:flex-row overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
      {/* Photo Section */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-6 lg:rounded-l-2xl relative">
        {/* Half background */}
        <div className="absolute inset-0">
          <div className="h-1/2 bg-indigo-100"></div>
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
                0
              )}`;
            }}
          />
        </div>
      </div>

      {/* Info & Actions */}
      <div className="flex flex-col justify-between w-full lg:w-2/3 p-5">
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
              <Button className="w-full" variant="outline">
                View Profile
              </Button>
            </Link>
          </div>

          <div className="flex-1">
            <Button className="w-full" onClick={() => setOpenModal(true)}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          </div>
        </div>
      </div>

      {/* Custom Modal */}
      <CustomModal isOpen={openModal} onClose={() => setOpenModal(false)}>
        

        <SubscriptionPlans />

        
      </CustomModal>
    </div>
  );
};

export default ProfileCard;
