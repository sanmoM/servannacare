"use client";

import React, { useEffect, useState } from "react";
import Progress from "../Progress";
import NurseBasicInfo from "./NurseBasicInfo";
import Education from "./Education";
import Exprience from "./Exprience";
import SkillServices from "./SkillServices";
import DocumentUploads from "./DocumentUploads";
import toast from "react-hot-toast";
import Review from "./Review";
import SignUpStart from "../SignUpStart";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { postApi } from "@/lib/apiHandler";
import { useAuth } from "@/hooks/useAuth";

const Nurse = ({ skills }) => {
  const [started, setStarted] = useState(false);
  const router = useRouter();
  const [step, setStep] = useState(1);
  // const [user, setUser] = useState({});
  const totalSteps = 6;
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    if (user && !user?.is_profile_completed) {
      setStarted(true);
      setStep(1);
    }
  }, [user]);
  const [formData, setFormData] = useState({
    basicInfo: {},
    education: {},
    experience: {},
    skillsServices: {},
    documents: {},
    // contactAgrement: {},
  });

  const handleSignupSuccess = (accountData) => {
    setStarted(true);
    // setUser(accountData);
  };

  const handleNext = async (dataForStep) => {
    if (step === 1)
      setFormData((prev) => ({ ...prev, basicInfo: dataForStep }));

    if (step === 2)
      setFormData((prev) => ({ ...prev, education: dataForStep }));

    if (step === 3)
      setFormData((prev) => ({ ...prev, experience: dataForStep }));

    if (step === 4)
      setFormData((prev) => ({ ...prev, skillsServices: dataForStep }));

    if (step === 5)
      setFormData((prev) => ({ ...prev, documents: dataForStep }));

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const fd = new FormData();
      const BASICINFO = formData.basicInfo;
      const EDUCATION = formData.education;
      const EXPERIENCE = formData.experience;
      const SKILLSERVICES = formData.skillsServices;
      const DOCUMENTS = formData.documents;

      fd.append("name", BASICINFO.name);
      fd.append("location", BASICINFO.location);
      fd.append("age", BASICINFO.age);
      fd.append("experience", BASICINFO.experience);
      fd.append("gender", BASICINFO.gender);
      fd.append("preferredRole", BASICINFO.preferredRole);
      BASICINFO.languages.forEach((lang) => fd.append("languages[]", lang));
      fd.append("canDrive", BASICINFO.canDrive ? 1 : 0);
      fd.append("bio", BASICINFO.bio);
      fd.append("number_two", BASICINFO.phone);

      fd.append("education", EDUCATION.education);
      fd.append("isNursingInKenya", EDUCATION.isNursingInKenya ? 1 : 0);
      fd.append("registrationNumber", EDUCATION.registrationNumber);

      fd.append("hospitalBasedCare", EXPERIENCE.hospitalBasedCare ? 1 : 0);
      fd.append(
        "hospitalBasedYearsOfExperience",
        EXPERIENCE.hospitalBasedYearsOfExperience,
      );
      fd.append(
        "hospitalBasedReferenceContact",
        EXPERIENCE.hospitalBasedReferenceContact,
      );
      fd.append("homeBasedCare", EXPERIENCE.homeBasedCare ? 1 : 0);
      fd.append(
        "homeBasedYearsOfExperience",
        EXPERIENCE.homeBasedYearsOfExperience,
      );
      fd.append(
        "homeBasedReferenceContact",
        EXPERIENCE.homeBasedReferenceContact,
      );
      EXPERIENCE.preferred.forEach((prep) => fd.append("preferred[]", prep));

      SKILLSERVICES.skills.forEach((skill) => fd.append("skills[]", skill));
      fd.append("mobilityYears", SKILLSERVICES.mobilityYears);
      fd.append("bathingYears", SKILLSERVICES.bathingYears);
      fd.append("feedingYears", SKILLSERVICES.feedingYears);
      fd.append("serviceFeeDay", SKILLSERVICES.serviceFeeDay);
      fd.append("serviceFeeMonth", SKILLSERVICES.serviceFeeMonth);

      if (DOCUMENTS?.idCopy) {
        fd.append("idCopy", DOCUMENTS.idCopy);
      }
      if (DOCUMENTS?.profilePhoto) {
        fd.append("profilePhoto", DOCUMENTS.profilePhoto);
      }
      if (DOCUMENTS?.goodConductCertificate) {
        fd.append("goodConductCertificate", DOCUMENTS.goodConductCertificate);
      }
      if (DOCUMENTS?.drivingLicense) {
        fd.append("drivingLicense", DOCUMENTS.drivingLicense);
      }
      if (DOCUMENTS?.referenceLetter) {
        fd.append("referenceLetter", DOCUMENTS.referenceLetter);
      }
      if (EDUCATION?.educationCertificate) {
        fd.append("educationCertificate", EDUCATION.educationCertificate);
      }
      if (EDUCATION?.practiceLicense) {
        fd.append("practiceLicense", EDUCATION.practiceLicense);
      }

      try {
        const res = await postApi("/create-profile", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res?.status === 200) {
          toast.success("Registered Successfully!");
          const updatedUser = await refreshUser();
          router.push(`/dashboard/${updatedUser?.role || user?.role}-profile`);

          // localStorage.setItem(
          //   "user",
          //   JSON.stringify({
          //     ...user,
          //     is_profile_completed: Boolean(res?.data?.is_profile_completed),
          //     is_profile_verified: Boolean(res?.data?.is_profile_verified),
          //   }),
          // );
        } else {
          toast.error(
            res?.data?.message || "Something went wrong. Please try again.",
          );
        }
      } catch (error) {
        toast.error("Error creating profile", error);

        if (error.response) {
          toast.error(
            error.response.data?.message || `Error: ${error.response.status}`,
          );
        } else if (error.request) {
          toast.error("No response from server. Please check your connection.");
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkip = () => {
    router.push(`/dashboard/${user?.role}-profile`);
  };
  return (
    <div className="w-full flex justify-center  px-2">
      <div
        className={`w-full ${
          !started ? "my-0" : "my-12"
        } max-w-[700px] bg-white`}
      >
        {!started ? (
          <SignUpStart onSuccess={handleSignupSuccess} />
        ) : (
          <>
            {started && step === 1 && (
              <div className="mb-6 w-full rounded-lg bg-red-100 px-4 py-3 text-red-900 border border-red-300">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xl font-medium">
                    You can skip this and complete your profile later.
                  </p>

                  <Button
                    onClick={handleSkip}
                    className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 text-base font-medium cursor-pointer"
                  >
                    Skip
                  </Button>
                </div>
              </div>
            )}
            <h2 className="text-2xl mb-6 font-semibold text-center text-gray-900">
              Nurse Registration
            </h2>

            <Progress currentStep={step} totalSteps={totalSteps} />

            <div className="space-y-8 mt-6">
              {step === 1 && (
                <NurseBasicInfo
                  defaultValues={formData.basicInfo}
                  onNext={handleNext}
                />
              )}
              {step === 2 && (
                <Education
                  defaultValues={formData.education}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {step === 3 && (
                <Exprience
                  defaultValues={formData.experience}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {step === 4 && (
                <SkillServices
                  defaultValues={formData.skillsServices}
                  onNext={handleNext}
                  onBack={handleBack}
                  skills={skills}
                />
              )}
              {step === 5 && (
                <DocumentUploads
                  defaultValues={formData.documents}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {/* {step === 6 && (
                <ContactAgreement
                  defaultValues={formData.contactAgrement}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )} */}
              {step === 6 && (
                <Review
                  data={formData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Nurse;
