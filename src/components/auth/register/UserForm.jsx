import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import React from "react";

const UserForm = () => {
  return (
    <div className="sm:min-w-[400px] min-w-[300px] ">
      <h2 className="text-xl mb-4 text-center text-gray-900">
        Continue as User
      </h2>
      <form className="sm:space-y-5 space-y-3" action="">
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
        <div className="text-sm mt-8 flex gap-1 text-gray-700">
          <input id="reminder" type="checkbox" />
          <label htmlFor="reminder">Remember me</label>
        </div>
        <Button size={"lg"} className={"w-full "}>
          Register
        </Button>
      </form>
    </div>
  );
};

export default UserForm;
