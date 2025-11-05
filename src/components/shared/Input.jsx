"use client";

import React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(
  (
    {
      label,
      type = "text",
      name,
      id,
      placeholder = "",
      icon: Icon,
      error,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={id || name}
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        {/* Input Wrapper */}
        <div
          className={cn(
            "flex items-center gap-2 rounded-md border border-input  text-sm transition-all",
            "focus-within:ring-1 focus-within:ring-primary focus-within:border-primary overflow-hidden text-gray-900 bg-white ",
            error && "border-destructive focus-within:ring-destructive",
            className
          )}
        >
          {/* Optional icon */}
          {Icon && <Icon className="size-4 text-muted-foreground" />}

          {/* Input field */}
          <input
            ref={ref}
            id={id || name}
            name={name}
            type={type}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-sm text-foreground px-4 py-3  placeholder:text-muted-foreground"
            {...props}
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
