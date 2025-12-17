"use client";

import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useLocalUser from "@/hooks/useLocalUser";
import { userRole } from "@/utilities/data";
import { generateToken } from "@/utilities/helperFunction";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [showPass, setShowPass] = useState(false);
  const {loaded,user} = useLocalUser();
  const router = useRouter();
  console.log(user)

  const handleCreateUser = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email?.value;
    const password = form.password?.value;

    if (user){
      toast.success("You are already Loged In");
      router.push("/dashboard")
      return;
    }

    if (!email || !password) {
      toast.error("All fields are required!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password will be more than 6 characters");
      return;
    }

    let role = ""
    if(email === "user@gmail.com"){
      role = "user"
    }else if (email === "specialist@gmail.com"){
      role = "specialist"
    }else if (email === "agency@gmail.com"){
      role = "agency"
    }else if (email === "careinstitution@gmail.com"){
      role = "care institution"
    }else{
      toast.error("Incorrect Email!")
      return;
    }

    const token = generateToken();
    

     const userInfo = {
      name,
      email,
      phoneNumber: null,
      location: null,
      joinedSince: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      role,
      token
      
    };
    localStorage.setItem("user", JSON.stringify(userInfo));
    
    router.push("/dashboard");
    toast.success("Login Success!");
  };

  const handleShowPassword = () => {
    setShowPass(!showPass);
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen px-2">
      <div className="w-full max-w-[400px] px-4 bg-white">
        <div className="flex justify-center mb-2">
          <Image
          src="/logo1.png"
          alt="logo"
          quality={100}
          width={80}
          height={80}
        />
        </div>
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-900">
          Welcome Back!
        </h2>
        <form onSubmit={handleCreateUser} className="space-y-5">
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

          <div className="flex justify-end">
            <Link className="underline cursor-pointer text-sm" href={"/forgot-password"}>Forgot Password?</Link>
          </div>

          <Button size={"lg"} className={"w-full"}>
            LOGIN
          </Button>
        </form>

        <div className="flex gap-2 mt-6 items-center">
          <p className="text-sm">Do not have an account?</p>
          
          <Dialog>
              <DialogTrigger asChild>
                <Button variant={"link"}>SIGN UP </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Select Your Role
                  </DialogTitle>
                  <DialogDescription className="text-center" />
                </DialogHeader>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 items-stretch">
                  {userRole.map((role, indx) => (
                    <DialogClose asChild key={indx}>
                      <Link
                        className="h-full"
                        href={`/register?role=${role.role}`}
                      >
                        <div className="h-full flex flex-col items-center p-2 py-3 sm:py-4 rounded-lg border hover:border-primary transition-all duration-500 border-border bg-background hover:shadow-md">
                          <div className="flex items-center justify-center w-6 h-6 sm:h-8 sm:w-8 rounded-full bg-cyan-100 mb-2 sm:mb-4">
                            <Image
                              src={role.icon}
                              alt="role"
                              quality={100}
                              className="h-full w-full"
                            />
                          </div>
                          <h3 className="text-[9px] sm:text-sm text-center font-semibold text-gray-700">
                            {role.text}
                          </h3>
                        </div>
                      </Link>
                    </DialogClose>
                  ))}
                </div>

                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Page;
