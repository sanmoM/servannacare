import Input from "@/components/shared/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages } from "@/utilities/data";
import {
  Camera,
  ClipboardPlus,
  Cross,
  FileText,
  IdCard,
  IdCardLanyard,
} from "lucide-react";
import React from "react";
import FileUpload from "../FileUpload";

const EmployeDetails = ({ employeeNumber = 1 }) => {
  const documents = [
    {
      id: 1,
      title: "First Aid Certificate",
      accept: "application/pdf,image/*",
      icon: <Cross size={32} />,
    },
    {
      id: 2,
      title: "Good Conduct Certificate / Letter from Chief ",
      accept: "application/pdf,image/*",
      icon: <FileText size={32} />,
    },
    {
      id: 3,
      title: "ID Copy",
      accept: "application/pdf,image/*",
      icon: <IdCardLanyard size={32} />,
    },
    {
      id: 4,
      title: "Profile Photo",
      accept: "image/*",
      icon: <Camera size={32} />,
    },
    {
      id: 5,
      title: "Driving License (Optional)",
      accept: "application/pdf,image/*",
      icon: <IdCard size={32} />,
      optional: true,
    },
  ];
  return (
    <div>
      <h2 className="formHeading mb-4">Employee Details</h2>
      <div>
        <h2 className="text-base font-semibold text-gray-700 border-primary border-b mb-6">
          Employee #{employeeNumber}
        </h2>
        <div className="flex sm:gap-4 gap-6 flex-col sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Name"
              name="name"
              label="Full Name (as per ID)"
            />
          </div>
          <div className="flex-1">
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="edu"
            >
              Education Level
            </label>
            <Select>
              <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                <SelectValue placeholder="Select education" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="bachlor">Bachelor Degree</SelectItem>
                  <SelectItem value="master">Master Degree</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4 pt-6 flex-col sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Type your location."
              label="Location"
              name="location"
            />
          </div>
          <div className="flex-1 flex gap-2">
            <div className="w-1/2">
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="edu"
              >
                Experince (Years)
              </label>
              <Select>
                <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">1 year</SelectItem>
                    <SelectItem value="2">2 years</SelectItem>
                    <SelectItem value="3">3 years</SelectItem>
                    <SelectItem value="4">4 years</SelectItem>
                    <SelectItem value="5">5 years</SelectItem>
                    <SelectItem value="5+">More than 5 years</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="edu"
              >
                Salary Range (KSh)
              </label>
              <Select>
                <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                  <SelectValue placeholder="Select salary range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="10-20">10,000 - 20,000</SelectItem>
                    <SelectItem value="20-30">20,000 - 30,000</SelectItem>
                    <SelectItem value="30-40">30,000 - 40,000</SelectItem>
                    <SelectItem value="40-50">40,000 - 50,000</SelectItem>
                    <SelectItem value="50+">50,000+</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col py-8 sm:flex-row  sm:gap-4 gap-8">
          <div className="flex-1 ">
            <Label className={"mb-3"}>Are you a mother?</Label>
            <RadioGroup className={"flex gap-4"} defaultValue="comfortable">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="default" id="r1" />
                <Label
                  className="text-gray-700 font-normal cursor-pointer"
                  htmlFor="r1"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="comfortable" id="r2" />
                <Label
                  className="text-gray-700 font-normal cursor-pointer"
                  htmlFor="r2"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex-1">
            <Label className={"mb-3"}>Preferred kid ages to work with</Label>
            <div className="flex flex-wrap gap-y-2 gap-x-4">
              <div className="flex items-center gap-2">
                <Checkbox id={"03"} />
                <Label
                  htmlFor={"03"}
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  0-3 years
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id={"41"} />
                <Label
                  htmlFor={"41"}
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  4-10 years
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id={"11+"} />
                <Label
                  htmlFor={"11+"}
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  11+ years
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col  sm:flex-row sm:gap-4 gap-8">
          <div className="flex-1 ">
            <Label className={"mb-3"}>Are you okay handling pets?</Label>
            <RadioGroup className={"flex gap-4"} defaultValue="comfortable">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="default" id="r3" />
                <Label
                  className="text-gray-700 font-normal cursor-pointer"
                  htmlFor="r3"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="comfortable" id="r4" />
                <Label
                  className="text-gray-700 font-normal cursor-pointer"
                  htmlFor="r4"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex-1 ">
            <Label className={"mb-3"}>Prefer being a:</Label>
            <RadioGroup className={"flex gap-4"} defaultValue="comfortable">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="default" id="r5" />
                <Label
                  className="text-gray-700 font-normal cursor-pointer"
                  htmlFor="r5"
                >
                  Nanny
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="comfortable" id="r6" />
                <Label
                  className="text-gray-700 font-normal cursor-pointer"
                  htmlFor="r6"
                >
                  House Keeper
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="pt-8">
          <Label className={"mb-3"}>Languages Spoken</Label>
          <div className="flex flex-wrap gap-x-4 gap-y-2 ">
            {languages.map((lan, indx) => (
              <div key={indx} className="flex items-center gap-2">
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
        </div>

        <div className="pt-4">
          <Label className="mt-5 mb-3">What areas are you strong at:</Label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="cooking"
              >
                Cooking
              </label>
              <Select>
                <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                  <SelectValue placeholder="Select proficiency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="strong">Strong</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="weak">Weak</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="cooking"
              >
                House Keeping
              </label>
              <Select>
                <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                  <SelectValue placeholder="Select proficiency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="strong">Strong</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="weak">Weak</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="cooking"
              >
                Childcare
              </label>
              <Select>
                <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                  <SelectValue placeholder="Select proficiency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="strong">Strong</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="weak">Weak</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className=" py-6">
          <Label className={"mb-3"}>Prefer being a:</Label>
          <RadioGroup className={"flex gap-4"} defaultValue="comfortable">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="default" id="r7" />
              <Label
                className="text-gray-700 font-normal cursor-pointer"
                htmlFor="r7"
              >
                Live In
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="comfortable" id="r8" />
              <Label
                className="text-gray-700 font-normal cursor-pointer"
                htmlFor="r8"
              >
                Dayburg
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="p-3 bg-primary/20 rounded-xl flex gap-2 items-center">
          <ClipboardPlus />
          <span className="text-sm text-gray-700">
            Please upload the following documents for this employee
          </span>
        </div>

        <div className="grid grid-cols-1 mt-4 sm:grid-cols-2  gap-4">
          {documents.map((data, indx) => {
            return (
              <div key={indx}>
                <FileUpload
                  title={data.title}
                  accept={data.accept}
                  icon={data.icon}
                  optional={data.optional}
                  onFileSelect={(file) => handleFileSelect(data.id, file)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployeDetails;
