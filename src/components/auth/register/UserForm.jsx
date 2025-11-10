import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

const UserForm = () => {
  const handleCreateUser = (e) => {
    e.preventDefault();
    toast.success("User Create Successfully!")
  }
  return (
    <div className="w-full flex justify-center items-center min-h-screen px-2">
      <div className="w-full  max-w-[400px] bg-white">
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-900">
        Continue as User
      </h2>
      <form onClick={handleCreateUser} className="space-y-5 " action="">
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
            type="password"
            placeholder="Enter Your Password"
          />
          <div className="absolute top-10 right-5">
            <Eye className="text-gray-600" />
          </div>
        </div>
        <div className="flex items-center mt-6 gap-2">
        <Checkbox id="remember" />
        <Label htmlFor={"remember"} className="text-gray-700 font-normal cursor-pointer">
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
