import React, { useState } from "react";
import Progress from "../Progress";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import BasicInfo from "./BasicInfo";
import Education from "./Education";
import Experience from "./Experience";
import SkillServices from "./SkillServices";
import Document from "./Document";
import ContactAgreement from "./ContactAgreement";


const NurseAideOrAssistant = () => {
    const [step, setStep] = useState(1);
  const totalSteps = 6;

  const handleNext = (e) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      console.log("Final Submitted Data:");
      toast.success("Register Successfully!");
      setStep(1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  return (
    <div className="w-full flex justify-center  px-2">
      <div className="w-full  max-w-[700px] bg-white">
        {/* Header */}
        <h2 className="text-2xl mb-6 font-semibold text-center text-gray-900">
          Nurse Aide or Assistant Registration
        </h2>

        <Progress currentStep={step} totalSteps={totalSteps} />

        <form className="space-y-8 mt-6">
          {step === 1 && <BasicInfo/>}
          {step === 2 && <Education/>}
          {step === 3 && <Experience/>}
          {step === 4 && <SkillServices/>}
          {step === 5 && <Document/>}
          {step === 6 && <ContactAgreement/>}


          <div className="flex justify-between mt-6">
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
            <Button type="submit" size="lg" onClick={handleNext}>
              {step === totalSteps ? "Submit" : "Next"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NurseAideOrAssistant;
