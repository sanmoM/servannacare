"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Progress from "../Progress";
import AgencyBasicInfo from "./AgencyBasicInfo";
import EmployeDetails from "./EmployeDetails";
import { Plus } from "lucide-react";
import Review from "./ReviewAndSubmit";
import SignUpStart from "../SignUpStart";
import { useRouter } from "next/navigation";

import { postApi } from "@/lib/apiHandler";

const validateEmployee = (data) => {
  const errors = [];

  if (!data.name) errors.push("Full name is required");
  if (!data.educationLevel) errors.push("Education level is required");
  if (!data.location) errors.push("Location is required");
  if (!data.experience) errors.push("Experience is required");
  if (!data.salaryRange) errors.push("Salary range is required");
  if (data.isMother === null) errors.push("Please select if you are a mother");
  if (data.kidAges.length === 0)
    errors.push("Please select at least one kid age group");
  if (data.handlePets === null)
    errors.push("Please select if you can handle pets");
  if (!data.preferredRole) errors.push("Preferred role is required");
  if (data.languages.length === 0)
    errors.push("Please select at least one language");
  if (!data.cooking) errors.push("Select cooking skill");
  if (!data.housekeeping) errors.push("Select housekeeping skill");
  if (!data.childcare) errors.push("Select childcare skill");

  if (!data.serviceOffered) errors.push("service offered is required");
  if (!data.aidCertificate) errors.push("First aid certificate require");
  if (!data.goodConductCertificate)
    errors.push("Good conduct certificate require");
  if (!data.idCopy) errors.push("Id copy require");
  if (!data.profilePhoto) errors.push("Profile photo require");

  return errors;
};

const Agency = () => {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [user, setUser] = useState({});
  const [employees, setEmployees] = useState([1]);
  const router = useRouter();
  const [formData, setFormData] = useState({
    agency: {},
    allEmployees: [],
  });

  const handleSignupSuccess = (accountData) => {
    console.log("acount data", accountData);
    setStarted(true);
    setUser(accountData);
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      if (step === 2) {
        // validate all employees before moving on
        if (formData.allEmployees.length === 0) {
          toast.error("Please fill in at least one employee’s details!");
          return;
        }

        for (let i = 0; i < formData.allEmployees.length; i++) {
          const emp = formData.allEmployees[i];
          const errors = validateEmployee(emp || {});
          if (errors.length > 0) {
            toast.error(`Employee #${i + 1} has errors:\n${errors[0]}`);
            return;
          }
        }
      }

      setStep(step + 1);
    } else {
      // const token = generateToken();
      // localStorage.setItem(
      //   "user",
      //   JSON.stringify({
      //     ...user,
      //     role: "agency",
      //     agency: formData.agency,
      //     token,
      //   }),
      // );
      // toast.success("Register Successfully!");
      // router.push("/dashboard");
      const fd = new FormData();
      const AGENCY = formData.agency;
      const ALLEMPLOYEES = formData.allEmployees;

      // Agency data
      fd.append("companyName", AGENCY?.companyName);
      fd.append("kraPin", AGENCY?.kraPin);
      fd.append("companyRegistrationNumber", AGENCY?.companyRegistrationNumber);
      fd.append("number", AGENCY?.phone);
      fd.append("businessLocation", AGENCY?.businessLocation);
      AGENCY.trainingAreas.forEach((area) =>
        fd.append("agency_services[]", area),
      );
      fd.append("placementFee", AGENCY?.placementFee);

      if (AGENCY?.registrationDocument) {
        fd.append("registrationDocument", AGENCY.registrationDocument);
      }
      fd.append("replacementWindow", AGENCY?.replacementWindow);
      fd.append("numberOfReplacement", AGENCY?.numberOfReplacement);

      // Employee data
      ALLEMPLOYEES.forEach((employee, i) => {
        fd.append(`employees[${i}][name]`, employee.name);
        fd.append(`employees[${i}][educationLevel]`, employee.educationLevel);
        fd.append(`employees[${i}][location]`, employee.location);
        fd.append(`employees[${i}][experience]`, employee.experience);
        fd.append(`employees[${i}][salaryRange]`, employee.salaryRange);
        fd.append(`employees[${i}][isMother]`, employee.isMother ? 1 : 0);
        fd.append(`employees[${i}][handlePets]`, employee.handlePets ? 1 : 0);
        fd.append(`employees[${i}][preferredRole]`, employee.preferredRole);
        fd.append(`employees[${i}][cooking]`, employee.cooking);
        fd.append(`employees[${i}][housekeeping]`, employee.housekeeping);
        fd.append(`employees[${i}][childcare]`, employee.childcare);
        fd.append(`employees[${i}][liveType]`, employee.serviceOffered);
        fd.append(`employees[${i}][bio]`, employee.bio);

        fd.append(`employees[${i}][idCopy]`, employee.idCopy);
        fd.append(`employees[${i}][profilePhoto]`, employee.profilePhoto);
        fd.append(`employees[${i}][drivingLicense]`, employee.drivingLicense);
        fd.append(
          `employees[${i}][goodConductCertificate]`,
          employee.goodConductCertificate,
        );
        fd.append(`employees[${i}][aidCertificate]`, employee.aidCertificate);

        employee.kidAges?.forEach((age) => {
          fd.append(`employees[${i}][kidAges][]`, age);
        });

        employee.languages?.forEach((lang) => {
          fd.append(`employees[${i}][languages][]`, lang);
        });
      });

      try {
        const res = await postApi("/create-profile", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res?.status === 200) {
          toast.success("Registered Successfully!");
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              is_profile_completed: Boolean(res?.data?.is_profile_completed),
              is_profile_verified: Boolean(res?.data?.is_profile_verified),
            }),
          );
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

      console.log("form data", formData);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // store agency data
  const handleAgencyDataChange = (data) => {
    setFormData((prev) => ({ ...prev, agency: { ...prev.agency, ...data } }));
  };

  // store employee data by index
  const handleEmployeeChange = (index, employeeData) => {
    setFormData((prev) => {
      const updated = [...prev.allEmployees];
      updated[index] = employeeData;
      return { ...prev, allEmployees: updated };
    });
  };

  // add new employee
  const handleAddEmployee = () => {
    setEmployees((prev) => [...prev, prev.length + 1]);
    toast.success("New Employee Form Added!");
  };

  // remove employee
  const handleRemoveEmployee = (index) => {
    setEmployees((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => {
      const updated = prev.allEmployees.filter((_, i) => i !== index);
      return { ...prev, allEmployees: updated };
    });
    toast.error("Employee Removed!");
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
              Agency Registration
            </h2>

            <Progress currentStep={step} totalSteps={totalSteps} />

            <div className="space-y-8 mt-6">
              {/* STEP 1 — AGENCY INFO */}
              {step === 1 && (
                <AgencyBasicInfo
                  key="agency-step"
                  defaultValues={formData.agency}
                  onNext={(data) => {
                    handleAgencyDataChange(data);
                    handleNext();
                  }}
                />
              )}

              {step === 2 && (
                <div className="space-y-8">
                  {employees.map((num, index) => (
                    <div key={index} className="relative">
                      <EmployeDetails
                        key={`employee-${index}`}
                        employeeNumber={num}
                        onDataChange={(data) =>
                          handleEmployeeChange(index, data)
                        }
                        onNext={handleNext}
                        defaultValues={formData.allEmployees[index] || {}}
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          className="absolute bg-red-400 hover:bg-red-500 top-2 right-2"
                          onClick={() => handleRemoveEmployee(index)}
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

              {/* NAVIGATION BUTTONS */}
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

                {step === 2 && (
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      onClick={handleAddEmployee}
                    >
                      <Plus /> Add Employee
                    </Button>

                    <Button type="submit" size="lg" onClick={handleNext}>
                      Next
                    </Button>
                  </div>
                )}

                {step === 3 && (
                  <div className="flex items-center gap-4">
                    <Button type="submit" size="lg" onClick={handleNext}>
                      Confirm & submit
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Agency;
