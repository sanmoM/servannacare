"use client";

import Agency from "@/components/auth/register/Agency/Agency";
import HouseManager from "@/components/auth/register/HouseManager/HouseManager";
import Nurse from "@/components/auth/register/Nurse/Nurse";
import Physiotherapist from "@/components/auth/register/Physiotherapist/Physiotherapist";
import UserForm from "@/components/auth/register/UserForm";
import { useSearchParams } from "next/navigation";
import React from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const renderForm = () => {
    switch (role) {
      case "user":
        return <UserForm />;
      case "house-manager":
      return <HouseManager/>;
      case "nurse":
      return <Nurse/>;
      case "agency":
        return <Agency/>
      case "physiotherapist":
        return <Physiotherapist/>
      default:
      // return <DefaultForm />;
    }
  };

  return (
    <div
      className={`${role === 'user'?"py-0":"py-12"} flex items-center bg-white justify-center w-full 
    `}
    >
      <div className="px-4 w-full">{renderForm()}</div>
    </div>
  );
};

export default Page;
