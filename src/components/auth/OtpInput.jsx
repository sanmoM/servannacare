"use client";

import { useRef } from "react";

export default function OTPInputs({ length = 6, value, onChange }) {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "");

    if (!val) {
      onChange(value.substring(0, index) + value.substring(index + 1));
      return;
    }

    let newValue = value.split("");
    newValue[index] = val[0];
    onChange(newValue.join(""));

    // Move to next box
    if (index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace -> move left
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="
            w-12 h-14 text-center text-xl font-semibold 
            border border-gray-300 rounded-md outline-none
            focus:border-primary focus:ring-2 focus:ring-primary
            shadow-sm transition-all
          "
        />
      ))}
    </div>
  );
}
