"use client";

import Agency from "@/components/auth/register/Agency/Agency";
import NurseAideOrAssistant from "@/components/auth/register/AideAssistant/NurseAideOrAssistant";
import HouseManager from "@/components/auth/register/HouseManager/HouseManager";
import MedicalInstitution from "@/components/auth/register/MedicalInstitution/MedicalInstitution";
import Nurse from "@/components/auth/register/Nurse/Nurse";
import Physiotherapist from "@/components/auth/register/Physiotherapist/Physiotherapist";
import SpecialNeedCaregivers from "@/components/auth/register/SpecialNeedCaregivers/SpecialNeedCaregivers";
import UserForm from "@/components/auth/register/UserForm";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import LoadingSpinnerSecond from "@/components/shared/Loadingspiner";
import PublicRoute from "@/components/shared/PublicRoute";
import { useFetch } from "@/hooks/useFetch";
import { notFound, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const PageContent = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const ROLE_TYPE_MAP = {
    "nurse-aide-or-assistant": "nurse_ade_assistant",
    care_institutions: "institution_nurse",
    nurse: "nurse",
  };

  const [roleSkills, setRoleSkills] = useState([]);
  const { data, isLoading, error } = useFetch("/skills");

  useEffect(() => {
    if (!data || !role) return;

    const skills = Array.isArray(data?.data?.data) ? data.data.data : [];

    const normalizedType = ROLE_TYPE_MAP[role] || role;

    const filteredSkills = skills.filter(
      (skill) => skill.type === normalizedType,
    );

    setRoleSkills(filteredSkills);
  }, [data, role]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;

  const renderForm = () => {
    switch (role) {
      case "user":
        return <UserForm />;
      case "house-manager":
        return <HouseManager />;
      case "nurse":
        return <Nurse skills={roleSkills} />;
      case "agency":
        return <Agency />;
      case "physiotherapist":
        return <Physiotherapist />;
      case "nurse-aide-or-assistant":
        return <NurseAideOrAssistant skills={roleSkills} />;
      case "special-need-caregivers":
        return <SpecialNeedCaregivers />;
      case "care_institutions":
        return <MedicalInstitution skills={roleSkills} />;

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
          {/* <LoadingSpinner/> */}
          <LoadingSpinnerSecond />
        </div>
      }
    >
      <PublicRoute>
        <PageContent />
      </PublicRoute>
    </Suspense>
  );
};

export default Page;
