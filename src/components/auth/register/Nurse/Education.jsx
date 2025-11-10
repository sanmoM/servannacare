import Input from "@/components/shared/Input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";
import FileUpload from "../FileUpload";
import { FileText } from "lucide-react";

const Education = () => {
  return (
    <div className="space-y-6">
      {/* Section Title */}
      <h4 className="formHeading">Education & Registration</h4>

      {/* education level */}
      <div>
        <Label className="mb-3 block">Level of Education</Label>
        <RadioGroup className="flex flex-wrap gap-4 mt-2" defaultValue="comfortable">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="diploma" id="r1" />
            <Label
              htmlFor="r1"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Diploma in Nursing
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="degree" id="r2" />
            <Label
              htmlFor="r2"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Degree in Nursing
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="other" id="r3" />
            <Label
              htmlFor="r3"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Other
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <FileUpload
          key={1}
          title="Education Certificate (Compulsory)"
          accept="application/pdf,image/*"
          icon={<FileText size={32} />}
          optional=""
          onFileSelect={(file) => handleFileSelect(1, file)}
        />
      </div>

      <div>
        <Label className="mb-3 block">
          Are you registered with the Nursing Council of Kenya?
        </Label>
        <RadioGroup className="flex gap-4 mt-2" defaultValue="comfortable">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="r4" />
            <Label
              htmlFor="r4"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="r5" />
            <Label
              htmlFor="r5"
              className="text-gray-700 font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Languages */}
      {/* <div>
        <Label className="font-medium  text-gray-700">Languages</Label>
        <div className="flex flex-wrap gap-4 mt-3">
          {languages.map((lan) => (
            <div key={lan.id} className="flex items-center gap-2">
              <Checkbox id={lan.value} />
              <Label
                htmlFor={lan.value}
                className="text-gray-700 font-normal cursor-pointer"
              >
                {lan.text}
              </Label>
            </div>
          ))}
        </div>
      </div> */}

      {/* <div>
        <Label className="mb-2 block">Can you drive?</Label>
        <RadioGroup className="flex gap-4 mt-2" defaultValue="comfortable">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="male" id="d1" />
            <Label
              htmlFor="d1"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="female" id="d2" />
            <Label
              htmlFor="d2"
              className="text-gray-700 font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div> */}

      {/* Bank Details */}
      {/* <div className="space-y-4">
        <h4 className="formHeading mt-6">Bank Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input label="Bank Name" name="bname" placeholder="Your bank name" />
          <Input
            label="Account Name"
            name="aname"
            placeholder="Your account name"
          />
          <Input
            label="Account Number"
            name="anumber"
            placeholder="Your account number"
          />
        </div>
      </div> */}

      {/* Remember Me */}
      {/* <div className="flex items-center gap-2 text-gray-700 text-sm mt-4">
        <Checkbox id="remember" />
        <Label htmlFor="remember" className="text-gray-700 cursor-pointer">
          Remember me
        </Label>
      </div> */}
    </div>
  );
};

export default Education;
