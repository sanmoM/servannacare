"use client";

import React, { useState } from "react";
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
import { generateToken } from "@/utilities/helperFunction";
import { Button } from "@/components/ui/button";

const Nurse = ({ skills }) => {
  const [started, setStarted] = useState(false);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [user, setUser] = useState({});
  const totalSteps = 6;
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
    setUser(accountData);
  };

  const handleNext = (dataForStep) => {
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

    // if (step === 6)
    //   setFormData((prev) => ({ ...prev, contactAgrement: dataForStep }));

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const token = generateToken();
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          location: formData.basicInfo.location,
          name: formData.basicInfo.name,
          profilePic: null,
          role: "specialist",
          subRole: "nurse",
          status: "under review",
          token,
        }),
      );

      localStorage.setItem("specialist", JSON.stringify(formData));

      toast.success("Register Sucessfully!");
      router.push("/dashboard");
      // setFormData({
      //   basicInfo: {},
      //   education: {},
      //   experience: {},
      //   skillsServices: {},
      //   documents: {},
      //   // contactAgrement: {},
      // });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

    const handleSkip = () => {
    router.push("/dashboard");
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
      className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 text-base font-medium"
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
