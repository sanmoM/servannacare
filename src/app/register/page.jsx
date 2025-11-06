"use client";

import HouseManager from "@/components/auth/register/HouseManager";
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
      case "vendor":
      // return <VendorForm />;
      default:
      // return <DefaultForm />;
    }
  };

  return (
    <div
      className="min-h-screen py-12 flex items-center bg-white justify-center 
    
    "
    >
      <div className="px-4">{renderForm()}</div>
    </div>
  );
};

export default Page;
