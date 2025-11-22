"use client";

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
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
