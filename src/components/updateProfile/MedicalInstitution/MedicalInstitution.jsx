import FileUpload from "@/components/auth/register/FileUpload";
import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import React from "react";

const MedicalInstitution = () => {
  return (
    <form>
      {/* Agency Details */}
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
