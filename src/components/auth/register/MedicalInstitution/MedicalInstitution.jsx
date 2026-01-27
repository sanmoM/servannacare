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
import { postApi } from "@/lib/apiHandler";

const validateNurse = (data) => {
  const errors = [];

  const requiredFields = [
    "name",
    "age",
    "experience",
    "gender",
    "location",
    "education",
    "languages",
    "canDrive",
    "preferredRole",
    "educationCertificate",
    "isNursingInKenya",
    "hospitalBasedCare",
    "homeBasedCare",
    "skills",
    "mobilityYears",
    "bathingYears",
    "feedingYears",
    "serviceFee",
    "bio",
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

  if (data.age < 25) {
    errors.push("Age must be 25 or above");
  }

  if (data.serviceFee && isNaN(data.serviceFee)) {
    errors.push("Service Fee must be a valid number");
  }

  if (
    data.hospitalBasedCare === "Yes" &&
    (!data.hospitalBasedYearsOfExperience ||
      !data.hospitalBasedReferenceContact)
  ) {
    errors.push("Please fill all Hospital Based Care fields!");
  }

  if (
    data.homeBasedCare === "Yes" &&
    (!data.homeBasedYearsOfExperience || !data.homeBasedReferenceContact)
  ) {
    errors.push("Please fill all Hospital Based Care fields!");
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

  if (!data.idCopy) {
    errors.push("ID copy require");
  }
  if (!data.profilePhoto) {
    errors.push("Profile photo require");
  }

  return errors;
};

const MedicalInstitution = ({ skills }) => {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [nurses, setNurses] = useState([1]);
  const [user, setUser] = useState({});
  const router = useRouter();

  const totalSteps = 3;

  const [formData, setFormData] = useState({
    institution: {
      registrationDocument: null,
    },
    nurses: [],
  });

  const handleSignupSuccess = (accountData) => {
    setStarted(true);
    setUser(accountData);
  };

  const handleNext = async () => {
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
      const fd = new FormData();
      const inst = formData.institution;

      fd.append("companyName", inst.companyName);
      fd.append("kraPin", inst.kraPin);
      fd.append("companyRegistrationNumber", inst.companyRegistrationNumber);
      fd.append("number", inst.phone);
      fd.append("businessLocation", inst.businessLocation);

      if (inst.registrationDocument) {
        fd.append("registrationDocument", inst.registrationDocument);
      }

      formData.nurses.forEach((nurse, i) => {
        fd.append(`institutionNurses[${i}][fullName]`, nurse.name);
        fd.append(`institutionNurses[${i}][age]`, nurse.age);
        fd.append(`institutionNurses[${i}][gender]`, nurse.gender);
        fd.append(`institutionNurses[${i}][location]`, nurse.location);
        fd.append(`institutionNurses[${i}][experience]`, nurse.experience);
        fd.append(`institutionNurses[${i}][education]`, nurse.education);

        fd.append(`institutionNurses[${i}][canDrive]`, nurse.canDrive ? 1 : 0);
        fd.append(
          `institutionNurses[${i}][isNursingInKenya]`,
          nurse.isNursingInKenya ? 1 : 0,
        );
        fd.append(
          `institutionNurses[${i}][hospitalBasedCare]`,
          nurse.hospitalBasedCare ? 1 : 0,
        );
        fd.append(
          `institutionNurses[${i}][homeBasedCare]`,
          nurse.homeBasedCare ? 1 : 0,
        );

        fd.append(
          `institutionNurses[${i}][preferredRole]`,
          nurse.preferredRole,
        );
        fd.append(`institutionNurses[${i}][serviceFee]`, nurse.serviceFee);
        fd.append(`institutionNurses[${i}][bio]`, nurse.bio);

        (nurse.languages || []).forEach((lang) => {
          fd.append(`institutionNurses[${i}][languages][]`, lang);
        });

        (nurse.skills || []).forEach((skill) => {
          const skillName = typeof skill === "object" ? skill.name : skill;
          fd.append(`institutionNurses[${i}][services][]`, skillName);
        });

        fd.append(
          `institutionNurses[${i}][mobilityYears]`,
          nurse.mobilityYears,
        );
        fd.append(`institutionNurses[${i}][bathingYears]`, nurse.bathingYears);
        fd.append(`institutionNurses[${i}][feedingYears]`, nurse.feedingYears);

        if (nurse.hospitalBasedCare) {
          fd.append(
            `institutionNurses[${i}][hospitalBasedYearsOfExperience]`,
            nurse.hospitalBasedYearsOfExperience,
          );
          fd.append(
            `institutionNurses[${i}][hospitalBasedReferenceContact]`,
            nurse.hospitalBasedReferenceContact,
          );
        }

        if (nurse.homeBasedCare) {
          fd.append(
            `institutionNurses[${i}][homeBasedYearsOfExperience]`,
            nurse.homeBasedYearsOfExperience,
          );
          fd.append(
            `institutionNurses[${i}][homeBasedReferenceContact]`,
            nurse.homeBasedReferenceContact,
          );
        }

        fd.append(
          `institutionNurses[${i}][educationCertificate]`,
          nurse.educationCertificate,
        );
        fd.append(`institutionNurses[${i}][idCopy]`, nurse.idCopy);
        fd.append(`institutionNurses[${i}][profilePhoto]`, nurse.profilePhoto);
      });

      try {
        const res = await postApi("/create-profile", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res?.status === 200) {
          console.log("after medical institutions create profile", res);
          toast.success("Registered Successfully!");
          router.push(`/dashboard/${user?.role}-profile`);
          //todo this localStorage
          // localStorage.setItem(
          //   "user",
          //   JSON.stringify({
          //     ...user,
          //     role: "care_institutions",
          //     institution: formData.institution,
          //   }),
          // );
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              is_profile_completed: Boolean(res?.data?.is_profile_completed),
              is_profile_verified: Boolean(res?.data?.is_profile_verified),
            }),
          );
        } else {
          toast.error(
            res?.data?.message || "Something went wrong. Please try again.",
          );
        }
      } catch (error) {
        console.error("Error creating profile:", error);
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

  const handleSkip = () => {
    router.push(`/dashboard/${user?.role}-profile`);
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
              Care Institution Registration
            </h2>

            <Progress currentStep={step} totalSteps={totalSteps} />

            <div className="space-y-8 mt-6">
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
                        skills={skills}
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
              {step === 3 && <Review data={formData} />}

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
