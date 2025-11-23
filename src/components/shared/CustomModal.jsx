"use client";

import { X } from "lucide-react";
import React from "react";

const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] px-4"
      onClick={onClose}
    >
      <div
        className="
          bg-white rounded-2xl shadow-xl w-full max-w-7xl 
          max-h-[90vh] overflow-y-auto 
          p-6
        "
        onClick={(e) => e.stopPropagation()}
      >
         <div className="flex justify-end mb-4">
        
        <X   onClick={onClose} className="cursor-pointer"/>
      
      </div>
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
