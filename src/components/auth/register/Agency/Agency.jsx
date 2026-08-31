"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Progress from "../Progress";
import AgencyBasicInfo from "./AgencyBasicInfo";
import EmployeDetails from "./EmployeDetails";
import { Plus } from "lucide-react";
import Review from "./ReviewAndSubmit";
import SignUpStart from "../SignUpStart";
import { useRouter } from "next/navigation";
import { postApi } from "@/lib/apiHandler";
import { useAuth } from "@/hooks/useAuth";
import { isValidPhoneNumber } from "react-phone-number-input";

const validateEmployee = (data) => {
  const errors = [];
  if (!data.name) errors.push("Full name is required");
  if (!data.age) errors.push("Age is required");
  else if (Number(data.age) < 25) errors.push("Age must be 25 or above");
  if (!data.education && !data.educationLevel) errors.push("Education level is required");
  if (!data.experience) errors.push("Experience is required");
  if (!data.salaryRange) errors.push("Salary range is required");
  if (!data.phone) errors.push("Phone number is required");
  else if (!isValidPhoneNumber(data.phone)) errors.push("Phone number is invalid or incomplete");
  if (!data.location) errors.push("Location is required");
  if (!data.languages || data.languages.length === 0) errors.push("Please select at least one language");
  if (!data.preferred || (Array.isArray(data.preferred) && data.preferred.length === 0)) {
    errors.push("Please select at least one service preference");
  }
  if (data.isMother === null || data.isMother === undefined) errors.push("Please select if employee is a mother");
  const kids = data.ageOfKids || data.kidAges || [];
  if (kids.length === 0) errors.push("Please select at least one kid age group");
  if (data.isHandelingPet === null && data.handlePets === null) errors.push("Please select preference for handling pets");
  if (!data.preferredRole) errors.push("Preferred role is required");
  if (!data.cooking) errors.push("Select cooking skill proficiency");
  if (!data.housekeeping) errors.push("Select housekeeping skill proficiency");
  if (!data.childcare) errors.push("Select childcare skill proficiency");
  if (!data.idCopy && !data.iDCopy) errors.push("ID copy is required");
  if (!data.profilePhoto) errors.push("Profile photo is required");
  return errors;
};
const Agency = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [employees, setEmployees] = useState([1]);
  const router = useRouter();
  const {
    user,
    refreshUser
  } = useAuth();
  useEffect(() => {
    if (user && !user?.is_profile_completed) {
      setStarted(true);
      setStep(1);
    }
  }, [user]);
  const [formData, setFormData] = useState({
    agency: {},
    allEmployees: []
  });
  const handleSignupSuccess = accountData => {
    setStarted(true);
  };
  const handleNext = async () => {
    if (step < totalSteps) {
      if (step === 2) {
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
      const fd = new FormData();
      const AGENCY = formData.agency;
      const ALLEMPLOYEES = formData.allEmployees;
      fd.append("companyName", AGENCY?.companyName);
      fd.append("kraPin", AGENCY?.kraPin);
      fd.append("companyRegistrationNumber", AGENCY?.companyRegistrationNumber);
      fd.append("number", AGENCY?.phone);
      fd.append("businessLocation", AGENCY?.businessLocation);
      AGENCY.trainingAreas.forEach(area => fd.append("agency_services[]", area));
      fd.append("placementFee", AGENCY?.placementFee);
      if (AGENCY?.registrationDocument) {
        fd.append("registrationDocument", AGENCY.registrationDocument);
      }
      fd.append("replacementWindow", AGENCY?.replacementWindow);
      fd.append("numberOfReplacement", AGENCY?.numberOfReplacement);
      const empFd = new FormData();
      ALLEMPLOYEES.forEach((employee, i) => {
        empFd.append(`employees[${i}][name]`, employee.name);
        empFd.append(`employees[${i}][age]`, employee.age || "");
        empFd.append(`employees[${i}][education]`, employee.education || employee.educationLevel || "");
        empFd.append(`employees[${i}][educationLevel]`, employee.education || employee.educationLevel || "");
        empFd.append(`employees[${i}][location]`, employee.location || "");
        empFd.append(`employees[${i}][experience]`, employee.experience || "");
        empFd.append(`employees[${i}][salaryRange]`, employee.salaryRange || "");
        empFd.append(`employees[${i}][phone]`, employee.phone || "");
        empFd.append(`employees[${i}][number_two]`, employee.phone || "");
        empFd.append(`employees[${i}][serviceFeeDay]`, employee.serviceFeeDay || "");
        empFd.append(`employees[${i}][serviceFeeMonth]`, employee.serviceFeeMonth || "");
        empFd.append(
          `employees[${i}][isMother]`,
          employee.isMother === true || employee.isMother === "Yes" || employee.isMother === 1 ? 1 : 0
        );
        empFd.append(
          `employees[${i}][isHandelingPet]`,
          employee.isHandelingPet === true || employee.isHandelingPet === "Yes" || employee.isHandelingPet === 1 || employee.handlePets === true || employee.handlePets === "Yes" || employee.handlePets === 1 ? 1 : 0
        );
        empFd.append(
          `employees[${i}][handlePets]`,
          employee.isHandelingPet === true || employee.isHandelingPet === "Yes" || employee.isHandelingPet === 1 || employee.handlePets === true || employee.handlePets === "Yes" || employee.handlePets === 1 ? 1 : 0
        );
        empFd.append(`employees[${i}][preferredRole]`, employee.preferredRole || "");
        empFd.append(`employees[${i}][cooking]`, employee.cooking || "");
        empFd.append(`employees[${i}][housekeeping]`, employee.housekeeping || "");
        empFd.append(`employees[${i}][childcare]`, employee.childcare || "");
        if (Array.isArray(employee.preferred)) {
          employee.preferred.forEach((pref) =>
            empFd.append(`employees[${i}][preferred][]`, pref)
          );
        } else if (employee.preferred) {
          empFd.append(`employees[${i}][preferred][]`, employee.preferred);
        }
        empFd.append(`employees[${i}][bio]`, employee.bio || "");
        if (employee.idCopy || employee.iDCopy) {
          empFd.append(`employees[${i}][idCopy]`, employee.idCopy || employee.iDCopy);
        }
        if (employee.profilePhoto) {
          empFd.append(`employees[${i}][profilePhoto]`, employee.profilePhoto);
        }
        if (employee.drivingLicense) {
          empFd.append(`employees[${i}][drivingLicense]`, employee.drivingLicense);
        }
        if (employee.goodConductCertificate) {
          empFd.append(
            `employees[${i}][goodConductCertificate]`,
            employee.goodConductCertificate
          );
        }
        if (employee.firstAidCertificate || employee.aidCertificate) {
          empFd.append(
            `employees[${i}][firstAidCertificate]`,
            employee.firstAidCertificate || employee.aidCertificate
          );
          empFd.append(
            `employees[${i}][aidCertificate]`,
            employee.firstAidCertificate || employee.aidCertificate
          );
        }
        const kids = employee.ageOfKids || employee.kidAges || [];
        kids.forEach((age) => {
          empFd.append(`employees[${i}][ageOfKids][]`, age);
          empFd.append(`employees[${i}][kidAges][]`, age);
        });
        employee.languages?.forEach((lang) => {
          empFd.append(`employees[${i}][languages][]`, lang);
        });
      });

      // console.log("Agency Object:", Object.fromEntries(fd.entries()));

      // console.log("Employee Object:", Object.fromEntries(empFd.entries()));
      setIsActionLoading(true);
      try {
        const res = await postApi("/create-profile", fd, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        if (res?.status === 200) {
          if (ALLEMPLOYEES.length > 0) {
            const empRes = await postApi("/agency-employee", empFd, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            });
            if (empRes?.status !== 200) {
              toast.error("Agency registered, but failed to add employees.");
              return;
            }
          }
          toast.success("Registered Successfully!");
          const updatedUser = await refreshUser();
          router.push(`/dashboard/${updatedUser?.role || user?.role}-profile`);
        } else {
          toast.error(res?.data?.message || "Something went wrong. Please try again.");
        }
      } catch (error) {
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
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // store agency data
  const handleAgencyDataChange = data => {
    setFormData(prev => ({
      ...prev,
      agency: {
        ...prev.agency,
        ...data
      }
    }));
  };

  // store employee data by index
  const handleEmployeeChange = (index, employeeData) => {
    setFormData(prev => {
      const updated = [...prev.allEmployees];
      updated[index] = employeeData;
      return {
        ...prev,
        allEmployees: updated
      };
    });
  };
  const handleAddEmployee = () => {
    if (employees.length >= 2) {
      toast.error("You can add up to 2 free employees. Additional employees will attract a monthly subscription fee of KSH 500 per employee.");
      return;
    }
    setEmployees(prev => [...prev, prev.length + 1]);
    toast.success("New Employee Form Added!");
  };
  const handleRemoveEmployee = index => {
    setEmployees(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => {
      const updated = prev.allEmployees.filter((_, i) => i !== index);
      return {
        ...prev,
        allEmployees: updated
      };
    });
    toast.error("Employee Removed!");
  };
  const handleSkip = () => {
    router.push(`/dashboard/${user?.role}-profile`);
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
            <h2 className="text-2xl mb-6 font-semibold text-center text-gray-900">
              Agency Registration
            </h2>

            <Progress currentStep={step} totalSteps={totalSteps} />

            <div className="space-y-8 mt-6">
              {step === 1 && <AgencyBasicInfo key="agency-step" defaultValues={formData.agency} onNext={data => {
            handleAgencyDataChange(data);
            handleNext();
          }} />}

              {step === 2 && <div className="space-y-8">
                  {employees.map((num, index) => <div key={index} className="relative">
                      <EmployeDetails key={`employee-${index}`} employeeNumber={num} onDataChange={data => handleEmployeeChange(index, data)} onNext={handleNext} defaultValues={formData.allEmployees[index] || {}} />
                      {index > 0 && <Button type="button" className="absolute bg-red-400 hover:bg-red-500 top-2 cursor-pointer right-2" onClick={() => handleRemoveEmployee(index)} isActionLoading={isActionLoading}>
                          Remove
                        </Button>}
                    </div>)}
                </div>}

              {step === 3 && <Review data={formData} />}

              <div className="flex justify-between mt-6">
                {step > 1 ? <Button className="cursor-pointer" type="button" size="lg" variant="outline" onClick={handleBack} isActionLoading={isActionLoading}>
                    Back
                  </Button> : <div></div>}

                {step === 2 && <div className="flex items-center gap-4">
                    <Button className="cursor-pointer" type="button" size="lg" variant="outline" onClick={handleAddEmployee} isActionLoading={isActionLoading}>
                      <Plus /> Add Employee
                    </Button>

                    <Button className="cursor-pointer" type="submit" size="lg" onClick={handleNext} isActionLoading={isActionLoading}>
                      Next
                    </Button>
                  </div>}

                {step === 3 && <div className="flex items-center gap-4">
                    <Button className="cursor-pointer" type="submit" size="lg" onClick={handleNext} isActionLoading={isActionLoading}>
                      Confirm & submit
                    </Button>
                  </div>}
              </div>
            </div>
          </>}
      </div>
    </div>;
};
export default Agency;