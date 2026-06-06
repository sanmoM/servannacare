"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { postApi } from "@/lib/apiHandler";
import toast from "react-hot-toast";
import { Smartphone } from "lucide-react";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
const PaymentModal = ({
  open,
  onOpenChange,
  employeeIds = [],
  onSuccess
}) => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("KE");
  const totalAmount = employeeIds.length * 500;
  const handlePayment = async () => {
    if (!phoneNumber) {
      toast.error("Please enter M-Pesa phone number");
      return;
    }
    setLoading(true);
    setIsActionLoading(true);
    try {
const payload = {
        phone: phoneNumber,
        plan_id: 4,
        employee_ids: employeeIds,
        months: 1
      };
      const res = await postApi("/agency-employee-payment", payload);
      if (res?.status === 200 || res?.status === 201 || res?.data?.status) {
        toast.success(res?.data?.message || "Payment initiated successfully. Please check your phone to confirm.");
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(res?.data?.message || "Payment failed to initiate.");
      }
    }
    catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during payment.");
    } finally {
      setIsActionLoading(false);

      setLoading(false);
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-lg p-0 border-none bg-white overflow-hidden">
        <div className="bg-[#7A295A] p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone size={32} />
          </div>
          <DialogTitle className="text-2xl font-black">
            M-Pesa Checkout
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Enter your M-Pesa phone number below to initiate the payment prompt.
          </DialogDescription>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg flex justify-between items-center border border-emerald-100">
            <span className="font-medium">Total Amount:</span>
            <span className="text-xl font-bold">KSh {totalAmount}</span>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 block ml-1">
              Enter M-Pesa Number
            </label>
            <div className="phone-input-container">
              <PhoneInputWithCountrySelect className="w-full flex border rounded-2xl px-4 py-3 bg-slate-50 focus-within:ring-2 focus-within:ring-primary transition-all" international defaultCountry={country} value={phoneNumber} onChange={value => setPhoneNumber(value || "")} onCountryChange={countryCode => {
              setCountry(countryCode || "KE");
              const example = countryCode ? getExampleNumber(countryCode) : null;
              if (example) {
                setPhoneNumber(`+${example.countryCallingCode}`);
              } else {
                setPhoneNumber("");
              }
            }} />
            </div>
            {phoneNumber && !isValidPhoneNumber(phoneNumber) && <p className="text-red-500 text-[11px] font-bold mt-2 ml-1">
                Invalid phone number for {country}
              </p>}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button className="cursor-pointer" variant="outline" onClick={() => onOpenChange(false)} disabled={loading} isActionLoading={isActionLoading}>
              Cancel
            </Button>
            <Button className="cursor-pointer" onClick={handlePayment} disabled={loading} isActionLoading={isActionLoading}>
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default PaymentModal;