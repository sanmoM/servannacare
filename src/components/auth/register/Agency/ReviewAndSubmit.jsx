import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React from "react";

const ReviewAndSubmit = ({ data }) => {
  console.log(data);
  return (
    <div>
      <h2 className="formHeading mb-4">Review and Submit</h2>
      <div className="p-4 border rounded-xl">
        <h2 className="font-semibold pb-4 text-gray-600">Agency Information</h2>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Label>Company Name : </Label>{" "}
            <span className="text-sm text-gray-600">
              {data.agency.companyName ? data.agency.companyName : "N/A"}
            </span>
          </div>

          <div className="flex gap-2">
            <Label>KRA PIN : </Label>{" "}
            <span className="text-sm text-gray-600">
              {data.agency.kraPIN ? data.agency.kraPIN : "N/A"}
            </span>
          </div>

          <div className="flex gap-2">
            <Label>Registration Number : </Label>{" "}
            <span className="text-sm text-gray-600">
              {data.agency.companyRegistrationNumber
                ? data.agency.companyRegistrationNumber
                : "N/A"}
            </span>
          </div>

          <div className="flex gap-2">
            <Label>Buisness Location : </Label>{" "}
            <span className="text-sm text-gray-600">
              {data.agency.buisnessLocation
                ? data.agency.buisnessLocation
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 my-4 border rounded-xl">
        <h2 className="font-semibold pb-4 text-gray-600">Agency Services</h2>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 items-start">
            <Label>Training Areas : </Label>
            {data.agency.trainings && data.agency.trainings.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.agency.trainings.map((item, indx) => (
                  <span key={indx} className="text-sm text-gray-600">
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-500">N/A</span>
            )}
          </div>

          <div className="flex gap-2">
            <Label>Placement Fee : </Label>{" "}
            <span className="text-sm text-gray-600">
              {data.agency.placementFee ? data.agency.placementFee : "N/A"}
            </span>
          </div>

          <div className="flex gap-2">
            <Label>Replacement Window : </Label>{" "}
            <span className="text-sm text-gray-600">
              {data.agency.replacementWindow
                ? data.agency.replacementWindow
                : "N/A"}
            </span>
          </div>

          <div className="flex gap-2">
            <Label>Replacements Offered : </Label>{" "}
            <span className="text-sm text-gray-600">
              {data.agency.replacementOffered
                ? data.agency.replacementOffered
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-xl">
        <h2 className="font-semibold pb-4 text-gray-600">
          Employee Information
        </h2>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Label>Number of Employee Added : </Label>{" "}
            <span className="text-sm text-gray-600">
              {data?.allEmployees.length}
            </span>
          </div>
        </div>
      </div>

      <div className="flex mt-6 gap-2">
        <Checkbox id={"agree"} />
        <Label
          className="text-gray-700 font-normal cursor-pointer"
          htmlFor={"agree"}
        >
          I agree to the terms and conditions
        </Label>
      </div>
    </div>
  );
};

export default ReviewAndSubmit;
