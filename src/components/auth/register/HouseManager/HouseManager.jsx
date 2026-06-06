"use client";

import React, { useEffect, useState } from "react";
import Progress from "../Progress";
import BasicInfo from "./BasicInfo";
import AdditionalDetails from "./AdditionalDetails";
import DocumentUploads from "./DocumentUploads";
import toast from "react-hot-toast";
import Review from "./Review";
import SignUpStart from "../SignUpStart";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { postApi } from "@/lib/apiHandler";
import { useAuth } from "@/hooks/useAuth";
const HouseManager = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const {
    user,
    refreshUser
  } = useAuth();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const router = useRouter();
  const [formData, setFormData] = useState({
    basicInfo: {},
    additionalDetails: {},
    documents: {}
  });
  useEffect(() => {
    if (user && !user?.is_profile_completed) {
      setStarted(true);
      setStep(1);
    }
  }, [user]);
  const handleSignupSuccess = accountData => {
    setStarted(true);
  };
  const handleNext = async dataForStep => {
    let updatedFormData = {
      ...formData
    };
    if (step === 1) updatedFormData.basicInfo = dataForStep;
    if (step === 2) updatedFormData.additionalDetails = dataForStep;
    if (step === 3) updatedFormData.documents = dataForStep;
    setFormData(updatedFormData);
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const fd = new FormData();
      const BASICINFO = formData.basicInfo;
      const ADDITIONALDETAILS = formData.additionalDetails;
      const DOCUMENTSUPLOADS = formData.documents;
      fd.append("name", BASICINFO.name);
      fd.append("age", BASICINFO.age);
      fd.append("education", BASICINFO.education);
      fd.append("experience", BASICINFO.experience);
      fd.append("location", BASICINFO.location);
      BASICINFO.languages.forEach(lang => fd.append("languages[]", lang));
      fd.append("number_two", BASICINFO.phone);
      fd.append("salaryRange", BASICINFO.salaryRange);
      BASICINFO.preferred.forEach(prep => fd.append("preferred[]", prep));
      fd.append("isMother", ADDITIONALDETAILS.isMother ? 1 : 0);
      ADDITIONALDETAILS.ageOfKids.forEach(age => fd.append("ageOfKids[]", age));
      fd.append("isHandelingPet", ADDITIONALDETAILS.isHandelingPet ? 1 : 0);
      fd.append("preferredRole", ADDITIONALDETAILS.preferredRole);
      fd.append("serviceFeeMonth", ADDITIONALDETAILS.serviceFeeMonth);
      fd.append("serviceFeeDay", ADDITIONALDETAILS.serviceFeeDay);
      if (DOCUMENTSUPLOADS?.iDCopy) {
        fd.append("idCopy", DOCUMENTSUPLOADS.iDCopy);
      }
      if (DOCUMENTSUPLOADS?.profilePhoto) {
        fd.append("profilePhoto", DOCUMENTSUPLOADS.profilePhoto);
      }
      if (DOCUMENTSUPLOADS?.drivingLicense) {
        fd.append("drivingLicense", DOCUMENTSUPLOADS.drivingLicense);
      }
      if (DOCUMENTSUPLOADS?.firstAidCertificate) {
        fd.append("firstAidCertificate", DOCUMENTSUPLOADS.firstAidCertificate);
      }
      if (DOCUMENTSUPLOADS?.goodConductCertificate) {
        fd.append("goodConductCertificate", DOCUMENTSUPLOADS.goodConductCertificate);
      }
      setIsActionLoading(true);
      try {
        const res = await postApi("/create-profile", fd, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        if (res?.status === 200) {
          toast.success("Profile Create Successfully!");
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
          toast.error(res?.data?.message || "Something went wrong. Please try again.");
        }
      } catch (error) {
        toast.error("Error creating profile", error);
        if (error.response) {
          toast.error(error.response.data?.message || `Error: ${error.response.status}`);
        } else if (error.request) {
          toast.error("No response from server. Please check your connection.");
        } else {
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setIsActionLoading(false);
      }
    }
  };
  const handleSkip = () => {
    router.push(`/dashboard/${user?.role}-profile`);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  return <div className="w-full flex justify-center px-2">
      <div className={`w-full ${!started ? "my-0" : "my-12"} max-w-[700px] bg-white`}>
        {!started ? <SignUpStart onSuccess={handleSignupSuccess} /> : <>
            {started && step === 1 && <div className="mb-6 w-full rounded-lg bg-red-100 px-4 py-3 text-red-900 border border-red-300">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xl font-medium">
                    You can skip this and complete your profile later.
                  </p>

                  <Button onClick={handleSkip} className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 text-base font-medium cursor-pointer" isActionLoading={isActionLoading}>
                    Skip
                  </Button>
                </div>
              </div>}

            <h2 className="text-xl mb-6 font-semibold text-center text-gray-900">
              Continue as Nanny/Housekeeper
            </h2>

            <Progress currentStep={step} totalSteps={totalSteps} />

            <div className="space-y-7 mt-6">
              {step === 1 && <BasicInfo defaultValues={formData.basicInfo} onNext={handleNext} />}
              {step === 2 && <AdditionalDetails defaultValues={formData.additionalDetails} onNext={handleNext} onBack={handleBack} />}
              {step === 3 && <DocumentUploads defaultValues={formData.documents} onNext={handleNext} onBack={handleBack} />}
              {step === 4 && <Review data={formData} onNext={handleNext} onBack={handleBack} />}
            </div>
          </>}
      </div>
    </div>;
};
export default HouseManager;