"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Input from "@/components/shared/Input";
import { Eye, EyeOff } from "lucide-react";

import Link from "next/link";

const SignUpStart = ({ onSuccess }) => {
    const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    const email = form.email.value;
    const password = form.password.value

    const NewUserData = {email,password}; 

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    toast.success("Account created!");
    onSuccess(NewUserData);
  };

    const handleShowPassword = () => {
    setShowPass(!showPass);
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen px-2">
      <div className="w-full max-w-[400px] px-4 bg-white">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-900">
          Create an Account!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter Your Email"
          />

          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Enter Your Password"
            />
            <div
              onClick={handleShowPassword}
              className="absolute cursor-pointer top-10 right-5"
            >
              {showPass ? (
                <EyeOff className="text-gray-600" />
              ) : (
                <Eye className="text-gray-600" />
              )}
            </div>
          </div>
          <Button size={"lg"} className={"w-full"}>
            LOGIN
          </Button>
        </form>

        <div className="flex gap-2 mt-6 items-center">
          <p className="text-sm">Already have an account?</p>
          <Link href={"/login"}><Button variant={"link"}>Login</Button></Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpStart;
