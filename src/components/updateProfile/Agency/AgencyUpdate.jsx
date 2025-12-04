import FileUpload from "@/components/auth/register/FileUpload";
import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import React from "react";

const AgencyUpdate = () => {
  const train = [
    "Cooking",
    "House Keeping",
    "First Aid",
    "Childcare",
    "Communication",
    "None",
  ];
  return (
    <div>
      <form>
        {/* Agency Details */}
        <div>
          <h2 className="formHeading">Agency Details</h2>

          <div className="flex pt-6 flex-col sm:flex-row gap-6 sm:gap-4">
            <Input
              type="text"
              label="Company/Business Name"
              name="companyName"
              placeholder="Company name"
              //   value={data.companyName}
              //   onChange={handleChange}
            />
            <Input
              label="KRA PIN Number"
              name="kraPin"
              placeholder="PIN number"
              //   value={data.kraPin}
              //   onChange={handleChange}
            />
          </div>

          <div className="flex flex-col py-6 sm:flex-row gap-6 sm:gap-4">
            <Input
              label="Company Registration Number"
              name="companyRegistrationNumber"
              placeholder="Company registration number"
              //   value={data.companyRegistrationNumber}
              //   onChange={handleChange}
            />
            <Input
              label="Business Location"
              name="businessLocation"
              placeholder="Business location"
              //   value={data.businessLocation}
              //   onChange={handleChange}
            />
          </div>

          <div>
            <FileUpload
              title="Company Registration Document"
              accept="application/pdf,image/*"
              icon={<FileText size={32} />}
              //   file={data.registrationDocument}
              //   onFileSelect={handleFileSelect}
            />
          </div>
        </div>

        {/* Agency Services */}
        <div>
          <h2 className="formHeading">Agency Services</h2>

          <div className="py-6">
            <Label className="mb-3">What areas do you train on?</Label>
            <div className="flex gap-x-4 gap-y-2 flex-wrap items-center">
              {train.map((item, indx) => (
                <div key={indx} className="flex items-center gap-2">
                  <Checkbox
                    id={`train-${indx}`}
                    // checked={data.trainingAreas.includes(item)}
                    // onCheckedChange={() => toggleTraining(item)}
                  />
                  <Label
                    htmlFor={`train-${indx}`}
                    className="text-gray-600 font-normal cursor-pointer"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex gap-6 sm:gap-4 mb-6 sm:flex-row flex-col">
              <Input
                type="number"
                placeholder="Placement fee"
                name="placementFee"
                label="Placement Fee (KSh)"
                // value={data.placementFee}
                // onChange={handleChange}
              />
              <Input
                type="number"
                placeholder="Replacement window"
                name="replacementWindow"
                label="Replacement Window (months)"
                // value={data.replacementWindow}
                // onChange={handleChange}
              />
            </div>

            <Input
              type="number"
              placeholder="Number of replacements offered"
              name="numberOfReplacement"
              label="Number of replacements"
              className="sm:w-1/2"
              //   value={data.numberOfReplacement}
              //   onChange={handleChange}
            />
          </div>
        </div>
        {/* submit button  */}
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
    </div>
  );
};

export default AgencyUpdate;
