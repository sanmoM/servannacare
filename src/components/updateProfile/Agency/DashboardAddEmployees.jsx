"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import EmployeDetails from "@/components/auth/register/Agency/EmployeDetails";
import { postApi } from "@/lib/apiHandler";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
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

const DashboardAddEmployees = ({
  onSuccess,
  onRequiresPayment,
}) => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [employees, setEmployees] = useState([1]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleEmployeeChange = (index, employeeData) => {
    setAllEmployees((prev) => {
      const updated = [...prev];
      updated[index] = employeeData;
      return updated;
    });
  };

  const handleAddEmployee = () => {
    setEmployees((prev) => [...prev, prev.length + 1]);
    toast.success("New Employee Form Added!");
  };

  const handleRemoveEmployee = (index) => {
    setEmployees((prev) => prev.filter((_, i) => i !== index));
    setAllEmployees((prev) => prev.filter((_, i) => i !== index));
    toast.error("Employee Removed!");
  };

  const handleSubmit = async () => {
    if (allEmployees.length === 0) {
      toast.error("Please fill in at least one employee’s details!");
      return;
    }
    for (let i = 0; i < allEmployees.length; i++) {
      const emp = allEmployees[i];
      const errors = validateEmployee(emp || {});
      if (errors.length > 0) {
        toast.error(`Employee #${i + 1} has errors:\n${errors[0]}`);
        return;
      }
    }
    setLoading(true);
    const empFd = new FormData();
    allEmployees.forEach((employee, i) => {
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
    setIsActionLoading(true);
    try {
      const res = await postApi("/agency-employee", empFd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res?.status === 200 || res?.status === 201 || res?.data?.status) {
        toast.success(res?.data?.message || "Employees added successfully!");
        const data = res.data;
        if (data?.requires_payment && data?.employee_ids_for_payment) {
          onRequiresPayment(data.employee_ids_for_payment);
        } else {
          onSuccess?.();
        }
      } else {
        toast.error("Failed to add employees.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setIsActionLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {employees.map((num, index) => (
        <div key={index} className="relative border p-4 sm:p-6 rounded-2xl bg-white shadow-xs">
          <EmployeDetails
            employeeNumber={index + 1}
            onDataChange={(data) => handleEmployeeChange(index, data)}
            defaultValues={allEmployees[index] || {}}
          />
          {index > 0 && (
            <Button
              type="button"
              className="absolute bg-red-400 hover:bg-red-500 top-4 right-4 cursor-pointer"
              onClick={() => handleRemoveEmployee(index)}
              isActionLoading={isActionLoading}
            >
              Remove
            </Button>
          )}
        </div>
      ))}

      <div className="flex items-center gap-4 mt-6">
        <Button
          className="cursor-pointer"
          type="button"
          size="lg"
          variant="outline"
          onClick={handleAddEmployee}
          isActionLoading={isActionLoading}
        >
          <Plus className="mr-2" /> Add Employee
        </Button>

        <Button
          className="cursor-pointer"
          type="button"
          size="lg"
          onClick={handleSubmit}
          disabled={loading}
          isActionLoading={isActionLoading}
        >
          {loading ? "Submitting..." : "Confirm & submit"}
        </Button>
      </div>
    </div>
  );
};

export default DashboardAddEmployees;