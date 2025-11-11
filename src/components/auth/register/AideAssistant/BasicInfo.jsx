import Input from '@/components/shared/Input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { languages } from '@/utilities/data'
import React from 'react'

const BasicInfo = () => {
  return (
    <div>
      <h2 className="formHeading">Basic Information</h2>
      <div className="flex flex-col  py-6 md:flex-row md:gap-4 gap-6">
        <div className="flex-1">
          <Input placeholder="Name" name="name" label="Full Name (as per ID)" />
        </div>
        <div className="flex-1 flex gap-6 md:gap-4 flex-col md:flex-row">
          <div className="md:w-1/2">
            <Input
              type="number"
              placeholder="Age"
              name="age"
              label="Age"
            />
          </div>
          <div className="md:w-1/2">
            <Label className={"mb-2"}>Gender?</Label>
            <RadioGroup className={"flex gap-4"} defaultValue="comfortable">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="default" id="r1" />
                <Label
                  className="text-gray-700 font-normal cursor-pointer"
                  htmlFor="r1"
                >
                  Male
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="comfortable" id="r2" />
                <Label
                  className="text-gray-700 font-normal cursor-pointer"
                  htmlFor="r2"
                >
                  Female
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 ">
        <div className="space-y-4 flex-1">
          <Label className={"mb-2 sm:mb-3"}>Bank Details</Label>
          <Input name="bankName" placeholder="Your bank name" />

          <Input name="bankAccountName" placeholder="Your account name" />
          <Input name="bankAccountNumber" placeholder="Your account number" />
        </div>
        <div className="flex-1">
          <Input label="Location" placeholder="Location" name="location" />
        </div>
      </div>

      <div className="py-8">
        <Label className={"mb-3"}>Languages Spoken</Label>
        <div className="flex flex-wrap gap-4 ">
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

      <div>
        <Label className="mb-3 block">Can you drive?</Label>
        <RadioGroup className="flex gap-4 " defaultValue="comfortable">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="d1" />
            <Label
              htmlFor="d1"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="d2" />
            <Label
              htmlFor="d2"
              className="text-gray-700 font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

export default BasicInfo
