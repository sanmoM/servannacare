"use client";

import Input from "@/components/shared/Input";
import PublicRoute from "@/components/shared/PublicRoute";
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
import { useAuth } from "@/hooks/useAuth";
import { getApi, postApi } from "@/lib/apiHandler";
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
  const { user, setUser, setRole, loading } = useAuth();

  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (loading) return;

    if (!user) return;

    if (user?.role === "user") {
      router.replace(redirect || "/dashboard");
    } else {
      if (redirect?.includes("bookingForm")) {
        toast.error(`${user.role} can't make a booking`);
      }
      router.replace("/dashboard");
    }
  }, [user, loading, redirect, router]);

  const handleLoginUser = async (e) => {
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

    const userInfo = { email, password };

    try {
      const res = await postApi("/login", userInfo);

      const { token } = res.data.data;
      localStorage.setItem("token", token);

      const profile = await getApi("/profile");
      setUser(profile?.data?.data);
      setRole(profile?.data?.data?.role);

      if (redirect && redirect.startsWith("/")) {
        router.replace(redirect);
      } else if (profile?.data?.data?.role === "user") {
        router.replace("/dashboard");
      } else {
        router.replace("/dashboard");
      }
    } catch (error) {
      if (error?.response?.data?.email_verified === null) {
        sessionStorage.setItem("verifyEmail", email);
        if (redirect) sessionStorage.setItem("redirectUrl", redirect);
        toast.error("Please Verify Your email with otp");
        router.replace("/verify-otp");
        return;
      }
      toast.error(
        error?.response?.data?.message || "Invalid email or password",
      );
    }
  };

  const handleShowPassword = () => {
    setShowPass(!showPass);
  };

  return (
    <PublicRoute>
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
          <form onSubmit={handleLoginUser} className="space-y-5">
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

            <Button size={"lg"} className={"w-full cursor-pointer"}>
              LOGIN
            </Button>
          </form>

          <div className="flex gap-2 mt-6 items-center">
            <p className="text-sm">Do not have an account?</p>

            {redirect ? (
              <Link href={`/register?role=user&redirect=${redirect}`}>
                <Button variant="link">SIGN UP</Button>
              </Link>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link">SIGN UP</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Select Your Role
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                    {userRole.map((role, indx) => (
                      <DialogClose asChild key={indx}>
                        <Link href={`/register?role=${role.role}`}>
                          <div className="h-full flex flex-col items-center p-3 rounded-lg border hover:border-primary">
                            <Image
                              src={role.icon}
                              alt="role"
                              width={40}
                              height={40}
                            />
                            <h3 className="text-sm text-center font-semibold mt-2">
                              {role.text}
                            </h3>
                          </div>
                        </Link>
                      </DialogClose>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};

export default LoginPageContent;
