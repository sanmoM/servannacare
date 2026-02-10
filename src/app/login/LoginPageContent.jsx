"use client";

import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useLocalUser from "@/hooks/useLocalUser";
import { postApi } from "@/lib/apiHandler";
import { userRole } from "@/utilities/data";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const LoginPageContent = () => {
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loaded, refreshUser } = useLocalUser();

  const [redirectUrl, setRedirectUrl] = useState(null);

  useEffect(() => {
    const r = searchParams.get("redirect");
    if (r) setRedirectUrl(r);
  }, [searchParams]);

  useEffect(() => {
    if (!loaded || !user) return;

    if (user.role === "user") {
      router.replace(redirectUrl || "/dashboard");
    } else {
 
      if (redirectUrl?.includes("bookingForm")) {
        toast.error(`${user.role} can't make a booking`);
      }
      router.replace("/dashboard");
    }
  }, [user, loaded, redirectUrl, router]);

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    if (!email || !password) {
      toast.error("All fields are required!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const userInfo = {
      email,
      password,
    };
    try {
      const res = await postApi("/login", userInfo);
      const {
        token,
        is_profile_completed,
        role,
        subRole,
        is_profile_verified,
      } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          is_profile_completed,
          role,
          subRole,
          is_profile_verified,
        }),
      );

      toast.success("Login successful!");
      // router.push("/dashboard");
      // router.push(`/dashboard/${role}-profile`);
      // if (is_profile_completed) {
      //   router.push("/dashboard");
      //   return;
      // }
      if (refreshUser) refreshUser();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid email or password",
      );
    }
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
            <Link
              className="underline cursor-pointer text-sm"
              href={"/forgot-password"}
            >
              Forgot Password?
            </Link>
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
  
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default LoginPageContent;
