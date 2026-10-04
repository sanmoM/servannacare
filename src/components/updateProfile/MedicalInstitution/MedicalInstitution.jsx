import FileUpload from "@/components/auth/register/FileUpload";
import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import React from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const MedicalInstitution = () => {
  return (
    <form>
      {/* Institution Details */}
      <div>
        <h2 className="formHeading">Institution Details</h2>

        <div className="flex pt-6 flex-col sm:flex-row gap-6 sm:gap-4">
          <Input
            type="text"
            label="Company/Business Name"
            name="companyName"
            placeholder="Company name"
            // value={data.companyName}
            // onChange={handleChange}
          />
          <Input
            label="KRA PIN Number"
            name="kraPin"
            placeholder="PIN number"
            // value={data.kraPin}
            // onChange={handleChange}
          />
        </div>

        <div className="flex flex-col py-6 sm:flex-row gap-6 sm:gap-4">
          <Input
            label="Company Registration Number"
            name="companyRegistrationNumber"
            placeholder="Company registration number"
            // value={data.companyRegistrationNumber}
            // onChange={handleChange}
          />
          <Input
            label="Business Location"
            name="businessLocation"
            placeholder="Business location"
            // value={data.businessLocation}
            // onChange={handleChange}
          />
        </div>

        <div className="pb-6">
          <Label className="mb-3 block font-medium text-gray-700">
            Do you hire medical equipment?
          </Label>
          <RadioGroup className="flex gap-6 mt-1">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="1" id="med_inst_eq_yes" />
              <Label
                htmlFor="med_inst_eq_yes"
                className="text-gray-700 font-normal cursor-pointer"
              >
                YES
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="0" id="med_inst_eq_no" />
              <Label
                htmlFor="med_inst_eq_no"
                className="text-gray-700 font-normal cursor-pointer"
              >
                NO
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <FileUpload
            title="Company Registration Document"
            accept="application/pdf,image/*"
            icon={<FileText size={32} />}
            // file={data.registrationDocument}
            // onFileSelect={handleFileSelect}
          />
        </div>
      </div>

      <div className="">
        <Button
          className={"w-full sm:absolute sm:b-0 sm:mt-4 sm:w-auto"}
          size={"lg"}
          type="submit"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default MedicalInstitution;
