import Input from "@/components/shared/Input";
import { Label } from "@/components/ui/label";
import React from "react";
import FileUpload from "../FileUpload";
import { FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const AgencyBasicInfo = ({ onChange, values = {} }) => {
  const train = [
    "Cooking",
    "House Keeping",
    "First Aid",
    "Childcare",
    "Communication",
    "None",
  ];
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleCheckboxChange = (item) => {
    const currentSelections = values.trainings || [];
    let updated;

    if (currentSelections.includes(item)) {
      updated = currentSelections.filter((i) => i !== item);
    } else {
      updated = [...currentSelections, item];
    }
    onChange({ trainings: updated });
  };

  const handleFileSelect = (file) => {
    onChange({ companyRegistrationFile: file });
  };

  return (
    <div>
      <div>
        <h2 className="formHeading ">Agency Details</h2>

        <div className="flex py-6 flex-col sm:flex-row gap-6 sm:gap-4">
          <Input
            type="text"
            label="Company/Business Name"
            name="companyName"
            placeholder="Company name"
            value={values.companyName || ""}
            onChange={handleInputChange}
          />

          <Input
            label="KRA PIN Number"
            name="kraPIN"
            placeholder="PIN number"
            value={values.kraPIN || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex flex-col gap-6 sm:gap-4 sm:flex-row">
          <div className="flex-1 space-y-4">
            <div>
              <Label className={"mb-2"}>Bank Details</Label>
              <Input
                name="bankName"
                placeholder="Your bank name"
                value={values.bankName || ""}
                onChange={handleInputChange}
              />
            </div>
            <Input
              name="bankAccountName"
              placeholder="Your account name"
              value={values.bankAccountName || ""}
              onChange={handleInputChange}
            />
            <Input
              name="bankAccountNumber"
              placeholder="Your account Number"
              value={values.bankAccountNumber || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <Label className={"mb-2"}>Emergency Contact Details</Label>
              <Input
                name="emergencyContactName"
                placeholder="Your emergency contact name"
                value={values.emergencyContactName || ""}
                onChange={handleInputChange}
              />
            </div>
            <Input
              name="emergencyContactPhoneNumber"
              placeholder="Your emergency contact phone number"
              value={values.emergencyContactPhoneNumber || ""}
              onChange={handleInputChange}
            />
            <Input
              type="emial"
              name="emergencyContactEmail"
              placeholder="Your emergency contact email"
              value={values.emergencyContactEmail || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex flex-col py-6 sm:flex-row gap-6 sm:gap-4">
          <div className="flex-1">
            <Input
              label="Company Registration Number"
              name="companyRegistrationNumber"
              placeholder="Company registration number"
              value={values.companyRegistrationNumber || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Business Location"
              name="buisnessLocation"
              placeholder="Business location"
              value={values.buisnessLocation || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="">
          <FileUpload
            title="Company Registration Document"
            accept="application/pdf,image/*"
            icon={<FileText size={32} />}
            file={values.companyRegistrationFile}
            optional=""
            onFileSelect={handleFileSelect}
          />
        </div>
      </div>
      <div>
        <h2 className="formHeading ">Agency Services</h2>
        <div className="py-6">
          <Label className="mb-3">What areas do you train on?</Label>
          <div className="flex gap-x-4 gap-y-2 flex-wrap items-center">
            {train.map((item, indx) => {
              return (
                <div key={item} className="flex items-center  gap-2">
                  <Checkbox
                    id={indx}
                    checked={values.trainings?.includes(item) || false}
                    onCheckedChange={() => handleCheckboxChange(item)}
                  />
                  <Label
                    htmlFor={indx}
                    className="text-gray-600 font-normal cursor-pointer"
                  >
                    {item}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="flex gap-6 sm:gap-4 mb-6 sm:flex-row flex-col">
            <Input
              type="number"
              placeholder="Placement fee"
              name="placementFee"
              label="Placement Fee (KSh)"
              value={values.placementFee || ""}
              onChange={handleInputChange}
            />
            <Input
              type="number"
              placeholder="Replacement window"
              name="replacementWindow"
              label="Replacement Window (months)"
              value={values.replacementWindow || ""}
              onChange={handleInputChange}
            />
          </div>
          <Input
            type="number"
            placeholder="Number of replacements offered"
            name="replacementOffered"
            label="Number of replacements"
            className="sm:w-1/2"
            value={values.replacementOffered || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AgencyBasicInfo;
