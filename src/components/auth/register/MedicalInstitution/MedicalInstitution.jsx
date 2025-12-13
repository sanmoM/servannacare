"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import Progress from "../Progress";
import SignUpStart from "../SignUpStart";
import BasicInfo from "./BasicInfo";
import { useRouter } from "next/navigation";
import NurseDetails from "./NurseDetails";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Review from "./Review";


const validateNurse = (data) => {
  const errors = [];

  const requiredFields = [
    "name",
    "age",
    "gender",
    "location",
    "education",
    "languages",
    "canDrive",
    "role",
    "educationCertificate",
    "isNursingInKenya",
    "hospitalBasedCare",
    // "hospitalBasedYearsOfExperience",
    // "hospitalBasedReferenceContact",
    "homeBasedCare",
    // "homeBasedYearsOfExperience",
    // "homeBasedReferenceContact",
    "skills",
    "mobilityYears",
    "bathingYears",
    "feedingYears",
    "serviceFee",
  ];

  requiredFields.forEach((field) => {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === "" ||
      (Array.isArray(data[field]) && data[field].length === 0)
    ) {
      errors.push(`${field} is required`);
    }
  });

  // Extra Validation Rules

  if(data.age<25){
      errors.push("Age must be 25 or above")
    }

  if (data.serviceFee && isNaN(data.serviceFee)) {
    errors.push("Service Fee must be a valid number");
  }

  if(
    data.hospitalBasedCare === "Yes" && 
    (!data.hospitalBasedYearsOfExperience || !data.hospitalBasedReferenceContact)
  ){
    errors.push("Please fill all Hospital Based Care fields!")
  }

  if(
    data.homeBasedCare === "Yes" && 
    (!data.homeBasedYearsOfExperience || !data.homeBasedReferenceContact)
  ){
    errors.push("Please fill all Hospital Based Care fields!")
  }

  if (
    data.hospitalBasedYearsOfExperience &&
    isNaN(data.hospitalBasedYearsOfExperience)
  ) {
    errors.push("Hospital experience must be a number");
  }

  if (
    data.homeBasedYearsOfExperience &&
    isNaN(data.homeBasedYearsOfExperience)
  ) {
    errors.push("Home-based experience must be a number");
  }

  if(!data.idCopy){
    errors.push("ID copy require")
  }
  if(!data.profilePhoto){
    errors.push("Profile photo require")
  }


  return errors;
};

const MedicalInstitution = () => {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [nurses, setNurses] = useState([1]);
  const [user, setUser] = useState({});
  const router = useRouter();

  const totalSteps = 3;

  const [formData, setFormData] = useState({
    institution: {},
    nurses: [],
  });

  const handleSignupSuccess = (accountData) => {
    setStarted(true);
    setUser(accountData);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      if (step === 2) {
        if (formData.nurses.length === 0) {
          toast.error("Please fill in al least one nurse details!");
          return;
        }
        for (let i = 0; i < formData.nurses.length; i++) {
          const nurs = formData.nurses[i];
          const error = validateNurse(nurs || {});
          if (error.length > 0) {
            toast.error(`Nurses #${i + 1} has errors : \n${error[0]}`);
            return;
          }
        }
      }
      setStep(step + 1);
      return;
    } else {
      console.log(formData);
      localStorage.setItem("user", JSON.stringify({
        ...user,
        role:"medical institution",
        institution:formData.institution
      }));
      toast.success("Registered Successfully!");

      router.push("/dashboard");

      // Reset Form
      // setFormData({ institution: {}, nurses: [] });
      // setNurses([1]);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleInstitutionDataChange = (data) => {
    setFormData((prev) => ({
      ...prev,
      institution: { ...prev.institution, ...data },
    }));
  };

  const handleNursesChange = (index, nurseData) => {
    setFormData((prev) => {
      const updated = [...prev.nurses];
      updated[index] = nurseData;
      return { ...prev, nurses: updated };
    });
  };

  const handleAddNurse = () => {
    setNurses((prev) => [...prev, prev.length + 1]);
    toast.success("New Nurse Form Added!");
  };

  const handleRemoveNurses = (index) => {
    setNurses((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => {
      const updated = prev.nurses.filter((_, i) => i !== index);
      return { ...prev, nurses: updated };
    });

    toast.error("Nurse Removed!");
  };

  return (
    <div className="w-full flex justify-center px-2">
      <div
        className={`w-full ${
          !started ? "my-0" : "my-12"
        } max-w-[700px] bg-white`}
      >
        {!started ? (
          <SignUpStart onSuccess={handleSignupSuccess} />
        ) : (
          <>
            <h2 className="text-2xl mb-6 font-semibold text-center text-gray-900">
              Medical Institution Registration
            </h2>

            <Progress currentStep={step} totalSteps={totalSteps} />

            <div className="space-y-8 mt-6">
              {/* STEP 1 — Institution Info */}
              {step === 1 && (
                <BasicInfo
                  key="institution-step"
                  defaultValues={formData.institution}
                  onNext={(data) => {
                    handleInstitutionDataChange(data);
                    handleNext();
                  }}
                />
              )}

              {/* STEP 2 — Nurse Details */}
              {step === 2 && (
                <div className="space-y-8">
                  {nurses.map((num, index) => (
                    <div key={index} className="relative">
                      <NurseDetails
                        key={`nurse-${index}`}
                        nurseNumber={num}
                        defaultValues={formData.nurses[index] || {}}
                        onDataChange={(data) => handleNursesChange(index, data)}
                      />

                      {index > 0 && (
                        <Button
                          type="button"
                          className="absolute bg-red-400 hover:bg-red-500 top-2 right-2"
                          onClick={() => handleRemoveNurses(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 3 — REVIEW */}
              {step === 3 && (
                <Review
                  data={formData}
                />
              )}

              {/* FOOTER BUTTONS */}
              <div className="flex justify-between mt-6">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}

                {step === 2 && (
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddNurse}
                    >
                      <Plus /> Add Nurse
                    </Button>

                    <Button type="button" onClick={handleNext}>
                      Next
                    </Button>
                  </div>
                )}

                {step === 3 && (
                  <Button type="button" onClick={handleNext}>
                    Confirm & Submit
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MedicalInstitution;
