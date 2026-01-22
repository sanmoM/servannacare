import { X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import OTPInputs from "./OtpInput";

const OtpModal = ({ email, onVerify, onClose }) => {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (otp.length !== 6) {
      toast.error("OTP must be 6 character long!");
      return;
    }
    onVerify(otp);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white mx-2 w-full max-w-sm rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-lgl font-semibold text-center mb-4">
          Verify Your E-mail
        </h2>
        <p className="text-center text-xs text-gray-600 mb-4">
          We sent a 6-digit OTP to{" "}
          <span className="font-semibold text-sm">{email}</span>
        </p>

        <OTPInputs length={6} value={otp} onChange={setOtp} />

        <Button size={"lg"} className="w-full mt-8" onClick={handleVerify}>
          Verify OTP
        </Button>
      </div>
    </div>
  );
};

export default OtpModal;
