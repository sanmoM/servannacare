"use client";

import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const UserForm = () => {
  const [showPass, setShowPass] = useState(false);

  const handleCreateUser = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    if (!name || !email || !password) {
      toast.error("All fields are required!")
      return;
    };

    if(password.length<6){
      toast.error("Password will be more than 6 character")
      return;
    };

    const newUser = {name,email,password}
    toast.success("User Create Successfully!");
    console.log(newUser)
  };

  const handleShowPassword = () => {
    setShowPass(!showPass);
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen px-2">
      <div className="w-full  max-w-[400px] bg-white">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-900">
          Continue as User
        </h2>
        <form onSubmit={handleCreateUser} className="space-y-5 " action="">
          <Input
            label="Name"
            name="name"
            type="text"
            placeholder="Enter Your Name"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter Your email"
          />
          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPass?"text":"password"}
              placeholder="Enter Your Password"
            />
            <div
              onClick={handleShowPassword}
              className="absolute cursor-pointer top-10 right-5"
            >
              {
                showPass?<EyeOff className="text-gray-600" />:<Eye className="text-gray-600"/>
              }
              
            </div>
          </div>
          <div className="flex items-center mt-6 gap-2">
            <Checkbox id="remember" />
            <Label
              htmlFor={"remember"}
              className="text-gray-700 font-normal cursor-pointer"
            >
              Remember me
            </Label>
          </div>
          <Button size={"lg"} className={"w-full "}>
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
