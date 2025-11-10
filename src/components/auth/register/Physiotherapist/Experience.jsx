import Input from '@/components/shared/Input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import React from 'react'

const Experience = () => {
  return (
    <div>
      <h2 className="formHeading">Experience</h2>
      <div className="py-6">
        <Label className="mb-3 block">Hospital Based Care</Label>
        <RadioGroup className="flex gap-x-4 flex-wrap " defaultValue="comfortable">
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
      <div className='flex gap-6 sm:flex-row flex-col sm:gap-4'>
        <Input
        type="number"
        name="hospitalExperience"
        placeholder="Years of experience"
        label="Years of Experience"
        />
        <Input
        name="hospitalContact"
        placeholder="Reference contact"
        label="Reference Contact"
        />
      </div>

      <div className='mt-10'>
        <Label className="mb-3 block">Home Based Care</Label>
        <RadioGroup className="flex gap-x-4 flex-wrap " defaultValue="comfortable">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="d3" />
            <Label
              htmlFor="d3"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="d4" />
            <Label
              htmlFor="d4"
              className="text-gray-700 font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className='flex gap-6 sm:flex-row flex-col mt-6 sm:gap-4'>
        <Input
        type="number"
        name="homeExperience"
        placeholder="Years of experience"
        label="Years of Experience"
        />
        <Input
        name="homeContact"
        placeholder="Reference contact"
        label="Reference Contact"
        />
      </div>
    </div>
  )
}

export default Experience
