"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileText, Image as ImageIcon } from "lucide-react";
import React, { useState } from "react";

const UpdateReview = ({ data, }) => {
  
  const formatLabel = (key) =>
    key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

  
  const formatFileSize = (size) => {
    if (!size) return "0 KB";
    const kb = size / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(1)} KB`;
  };


  
  const renderSection = (sectionKey, sectionData) => {
    if (typeof sectionData !== "object" || sectionData === null) return null;

    return (
      <div key={sectionKey} className="p-4 my-4 border rounded-xl">
        <h2 className="font-semibold pb-4 text-gray-600">
          {formatLabel(sectionKey)}
        </h2>

        <div className="space-y-2 grid gap-4 md:grid-cols-2">
          {Object.entries(sectionData).map(([key, value]) => {
            if (Array.isArray(value)) {
              return (
                <div key={key} className="flex flex-wrap gap-2 items-start">
                  <Label>{formatLabel(key)}:</Label>
                  {value.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {value.map((item, i) => (
                        <span key={i} className="text-sm text-gray-600">
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
                  <Label className={"mb-2"}>{formatLabel(key)}:</Label>
                  <div className="flex rounded-md border p-2 bg-gray-100 gap-2">
                    {isImage ? (
                      <ImageIcon className="text-gray-600 w-6 h-6" />
                    ) : (
                      <FileText className="text-gray-600 w-6 h-6" />
                    )}
                    <div className="flex flex-col text-sm text-gray-700">
                      <span className="font-medium text-xs">{value.name}</span>
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
              let displayVal =
                value !== null && value !== undefined && value !== ""
                  ? String(value)
                  : "N/A";
              if (
                key === "do_you_hire_medical_equipment" ||
                key === "hire_equipment"
              ) {
                if (
                  value === "1" ||
                  value === 1 ||
                  String(value).toLowerCase() === "yes"
                ) {
                  displayVal = "YES";
                } else if (
                  value === "0" ||
                  value === 0 ||
                  String(value).toLowerCase() === "no"
                ) {
                  displayVal = "NO";
                } else {
                  displayVal = "N/A";
                }
              }
              return (
                <div key={key} className="flex items-center gap-2 flex-wrap">
                  <Label>{formatLabel(key)}:</Label>
                  <span className="text-sm text-gray-600">
                    {displayVal}
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
    <div>
      <h2 className="formHeading mb-4">UpdateReview and Submit</h2>

      {/* Render Agency Details */}
      {Object.entries(data)
        .slice(0, 1)
        .map(([sectionKey, sectionValue]) =>
          renderSection(sectionKey, sectionValue)
        )}

      {/* Employees Summary */}
      <div className="p-4 border rounded-xl">
        <h2 className="font-semibold pb-4 text-gray-600">Nurse Details</h2>
        <div className="flex gap-2 flex-wrap">
          <Label>Number of Nurse added:</Label>
          <span className="text-sm text-gray-600">
            {data.nurses?.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UpdateReview;
