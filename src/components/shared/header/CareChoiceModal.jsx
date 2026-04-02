"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { userRole } from "@/utilities/data";
import { Heart, BriefcaseMedical } from "lucide-react";

const CareChoiceModal = ({ children }) => {
  const [view, setView] = useState("choice");

  const handleOpenChange = (open) => {
    if (!open) {
      setTimeout(() => setView("choice"), 300);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent overlayClassName="backdrop-blur-sm bg-black/60" className="sm:max-w-2xl overflow-hidden p-6 bg-white rounded-2xl border-none">
        {view === "choice" ? (
          <>
            <DialogHeader className="mb-2">
              <DialogTitle className="text-2xl text-center font-bold text-gray-900">
                Let's get started. Choose an option:
              </DialogTitle>
              {/* <DialogDescription className="text-center text-gray-500">
                Let us know what you're looking for to get started.
              </DialogDescription> */}
              {/* <DialogTitle className="text-2xl text-center font-bold text-gray-900">
                How can we help you?
              </DialogTitle>
              <DialogDescription className="text-center text-gray-500">
                Let us know what you're looking for to get started.
              </DialogDescription> */}
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
              {/* Option 1: Caregiver Search */}
              <DialogClose asChild>
                <Link
                  href="/register?role=user"
                  className="flex flex-col h-full group"
                >
                  <div className="flex-1 flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl border-2  hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                    <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                      <Heart size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      I need a caregiver
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 flex-1">
                      Start your free search for care in your area.
                    </p>
                    <Button className="w-full rounded-xl cursor-pointer shadow-md group-hover:shadow-lg transition-all border border-transparent">
                      Find Care
                    </Button>
                  </div>
                </Link>
              </DialogClose>

              {/* Option 2: Care Job */}
              <div
                onClick={() => setView("roles")}
                className="flex-1 flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-16 h-16 bg-teal-50 text-primary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                  <BriefcaseMedical size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  I want a care job
                </h3>
                <p className="text-gray-500 text-sm mb-6 flex-1">
                  Create a profile and search for jobs.
                </p>
                <Button
                  variant="outline"
                  className="w-full rounded-xl cursor-pointer bg-white group-hover:bg-primary group-hover:text-white transition-all border-primary text-primary hover:bg-primary hover:text-white border"
                >
                  Find Jobs
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center font-bold text-xl text-gray-900">
                Select Your Role
              </DialogTitle>
              <DialogDescription className="text-center text-gray-500">
                Choose the role that best defines the job you are looking for.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 items-stretch">
              {userRole.map((role, indx) => {
                if (role.role === "user") return null;

                return (
                  <DialogClose asChild key={indx}>
                    <Link
                      className="h-full"
                      href={`/register?role=${role.role}`}
                    >
                      <div className="h-full flex flex-col items-center p-2 py-3 sm:py-4 rounded-lg border hover:border-primary transition-all duration-500 border-border bg-background hover:shadow-md">
                        <div className="flex items-center justify-center w-6 h-6 sm:h-8 sm:w-8 rounded-full bg-cyan-100 mb-2 sm:mb-4">
                          <Image
                            src={role.icon}
                            alt="role"
                            quality={100}
                            className="h-full w-full"
                          />
                        </div>
                        <h3 className="text-[9px] sm:text-sm text-center font-semibold text-gray-700 hover:text-primary transition-colors">
                          {role.text}
                        </h3>
                      </div>
                    </Link>
                  </DialogClose>
                );
              })}
            </div>


          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CareChoiceModal;
