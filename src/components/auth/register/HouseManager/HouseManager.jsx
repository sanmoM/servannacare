"use client";

import { Button } from "@/components/ui/button";

import React, { useState } from "react";
import Progress from "../Progress";
import BasicInfo from "./BasicInfo";
import AdditionalDetails from "./AdditionalDetails";
import DocumentUploads from "./DocumentUploads";
import toast from "react-hot-toast";
import Review from "./Review";

const HouseManager = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState({
    basicInfo: {},
    additionalDetails: {},
    documents: {},
  });

  const handleNext = (dataForStep) => {
    if (step === 1)
      setFormData((prev) => ({ ...prev, basicInfo: dataForStep }));
    if (step === 2)
      setFormData((prev) => ({ ...prev, additionalDetails: dataForStep }));
    if (step === 3)
      setFormData((prev) => ({ ...prev, documents: dataForStep }));

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      toast.success("Register Successfully!");
      console.log("Final Collected Data : ", formData);
      setStep(1);
      setFormData({ basicInfo: {}, additionalDetails: {}, documents: {} });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="w-full flex justify-center  px-2">
      <div className="w-full  max-w-[700px] bg-white">
        {/* Header */}
        <h2 className="text-xl mb-6 font-semibold text-center text-gray-900">
          Continue as Nanny/Housekeeper
        </h2>

        <Progress currentStep={step} totalSteps={totalSteps} />

        <div className="space-y-7 mt-6">
          {step === 1 && (
            <BasicInfo defaultValues={formData.basicInfo} onNext={handleNext} />
          )}
          {step === 2 && (
            <AdditionalDetails
              defaultValues={formData.additionalDetails}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 3 && (
            <DocumentUploads
              defaultValues={formData.documents}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 4 && (
            <Review data={formData} onNext={handleNext} onBack={handleBack} />
          )}

          {/* Submit
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={handleBack}
              >
                Back
              </Button>
            ) : (
              <div></div>
            )}
            <Button type="submit" size="lg">
              {step === totalSteps ? "Submit" : "Next"}
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HouseManager;
