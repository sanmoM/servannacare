"use client";

import Agency from "@/components/auth/register/Agency/Agency";
import NurseAideOrAssistant from "@/components/auth/register/AideAssistant/NurseAideOrAssistant";
import HouseManager from "@/components/auth/register/HouseManager/HouseManager";
import Nurse from "@/components/auth/register/Nurse/Nurse";
import Physiotherapist from "@/components/auth/register/Physiotherapist/Physiotherapist";
import SpecialNeedCaregivers from "@/components/auth/register/SpecialNeedCaregivers/SpecialNeedCaregivers";
import UserForm from "@/components/auth/register/UserForm";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { notFound, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const PageContent = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const renderForm = () => {
    switch (role) {
      case "user":
        return <UserForm />;
      case "house-manager":
        return <HouseManager />;
      case "nurse":
        return <Nurse />;
      case "agency":
        return <Agency />;
      case "physiotherapist":
        return <Physiotherapist />;
      case "nurse-aide-or-assistant":
        return <NurseAideOrAssistant />;
      case "special-need-caregivers":
        return <SpecialNeedCaregivers/>

      default:
        return notFound();
    }
  };

  if (!role) return notFound();

  return (
    <div
      className={`${
        role === "user" ? "py-0" : ""
      } flex items-center bg-white justify-center w-full`}
    >
      <div className="px-4 w-full">{renderForm()}</div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full py-20 text-center font-semibold text-primary">
          <LoadingSpinner/>
        </div>
      }
    >
      <PageContent />
    </Suspense>
  );
};

export default Page;
