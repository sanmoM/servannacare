"use client";

import { Label } from "@/components/ui/label";
import { FileText, Image as ImageIcon, User } from "lucide-react";
import React from "react";

const Review = ({ data }) => {
  const formatLabel = (key) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  const formatFileSize = (size) => {
    if (!size) return "0 KB";
    const kb = size / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(1)} KB`;
  };

  const renderSection = (sectionKey, sectionData) => {
    if (typeof sectionData !== "object" || sectionData === null) return null;

    return (
      <div key={sectionKey} className="p-4 my-4 border rounded-xl bg-white shadow-xs">
        <h2 className="font-semibold pb-4 text-gray-700 border-b mb-4">
          {formatLabel(sectionKey)}
        </h2>

        <div className="space-y-2 grid gap-4 md:grid-cols-2">
          {Object.entries(sectionData).map(([key, value]) => {
            if (Array.isArray(value)) {
              return (
                <div key={key} className="flex flex-wrap gap-2 items-start">
                  <Label className="font-medium text-gray-700">{formatLabel(key)}:</Label>
                  {value.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {value.map((item, i) => (
                        <span key={i} className="text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {String(item)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">N/A</span>
                  )}
                </div>
              );
            } else if (value instanceof File) {
              const isImage = value.type.startsWith("image/");
              return (
                <div key={key}>
                  <Label className="mb-2 block font-medium text-gray-700">{formatLabel(key)}:</Label>
                  <div className="flex rounded-md border p-2 bg-gray-50 gap-2 items-center">
                    {isImage ? (
                      <ImageIcon className="text-primary w-6 h-6 shrink-0" />
                    ) : (
                      <FileText className="text-primary w-6 h-6 shrink-0" />
                    )}
                    <div className="flex flex-col text-sm text-gray-700 min-w-0">
                      <span className="font-medium text-xs truncate">{value.name}</span>
                      <span className="text-gray-500 text-xs">
                        {formatFileSize(value.size)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            } else if (typeof value === "object" && value !== null) {
              return renderSection(key, value);
            } else {
              return (
                <div key={key} className="flex items-center gap-2 flex-wrap">
                  <Label className="font-medium text-gray-700">{formatLabel(key)}:</Label>
                  <span className="text-sm text-gray-600">
                    {value !== null && value !== undefined && String(value) !== ""
                      ? typeof value === "boolean"
                        ? value
                          ? "Yes"
                          : "No"
                        : String(value)
                      : "N/A"}
                  </span>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="formHeading mb-4">Review and Submit</h2>

      {/* Agency Details */}
      {data.agency && renderSection("Agency Details", data.agency)}

      {/* All Employees Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <User className="text-primary w-5 h-5" />
          Employee Details ({data.allEmployees?.length || 0})
        </h3>

        {data.allEmployees && data.allEmployees.length > 0 ? (
          data.allEmployees.map((emp, index) => (
            <div key={index} className="p-4 border rounded-xl bg-white shadow-xs">
              <h4 className="font-semibold text-primary pb-2 border-b mb-3">
                Employee #{index + 1}: {emp.name || "Unnamed"}
              </h4>
              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Age: </span>
                  <span className="text-gray-600">{emp.age || "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phone: </span>
                  <span className="text-gray-600">{emp.phone || "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Education: </span>
                  <span className="text-gray-600">{emp.education || emp.educationLevel || "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Experience: </span>
                  <span className="text-gray-600">
                    {emp.experience === "more" ? "5+ Years" : emp.experience ? `${emp.experience} Years` : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Location: </span>
                  <span className="text-gray-600">{emp.location || "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Salary Range: </span>
                  <span className="text-gray-600">{emp.salaryRange || "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Service Offered: </span>
                  <span className="text-gray-600">
                    {Array.isArray(emp.preferred) ? emp.preferred.join(", ") : emp.preferred || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Preferred Role: </span>
                  <span className="text-gray-600">{emp.preferredRole || "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Daily Fee: </span>
                  <span className="text-gray-600">{emp.serviceFeeDay ? `KSh ${emp.serviceFeeDay}` : "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Monthly Fee: </span>
                  <span className="text-gray-600">{emp.serviceFeeMonth ? `KSh ${emp.serviceFeeMonth}` : "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Languages: </span>
                  <span className="text-gray-600">{emp.languages?.join(", ") || "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Mother: </span>
                  <span className="text-gray-600">{emp.isMother ? "Yes" : "No"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Pet Handling: </span>
                  <span className="text-gray-600">
                    {emp.isHandelingPet ?? emp.handlePets ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Kid Ages: </span>
                  <span className="text-gray-600">
                    {(emp.ageOfKids || emp.kidAges)?.join(", ") || "N/A"}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-medium text-gray-700">Proficiencies: </span>
                  <span className="text-gray-600">
                    Cooking ({emp.cooking || "N/A"}), Housekeeping ({emp.housekeeping || "N/A"}), Childcare ({emp.childcare || "N/A"})
                  </span>
                </div>
                {emp.bio && (
                  <div className="sm:col-span-2">
                    <span className="font-medium text-gray-700">Bio: </span>
                    <span className="text-gray-600">{emp.bio}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No employees added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Review;
