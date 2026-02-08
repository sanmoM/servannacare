"use client";

import { CheckCircle } from "lucide-react";
import React from "react";

const FileUpload = ({
  title,
  accept,
  icon,
  optional = false,
  file,
  onFileSelect,
}) => {
  const handleChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    if (onFileSelect) onFileSelect(selectedFile);
  };

  const isFileObject = file instanceof File;
  const isString = typeof file === "string" && file.length > 0;


  const isImage =
    (isFileObject && file.type?.startsWith("image/")) ||
    (isString && file.match(/\.(jpg|jpeg|png|gif|webp)$/i));


  const previewSrc = isFileObject
    ? URL.createObjectURL(file)
    : isString
    ? file.startsWith("http")
      ? file
      : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${file}`
    : null;

  return (
    <label
      className={`flex flex-col hover:bg-gray-50 items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors relative ${
        file ? "border-green-500" : "border-border"
      }`}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      <div className="text-center space-y-3 w-full">
        <div className="flex justify-center">
          {isImage && previewSrc ? (
            <img
              src={previewSrc}
              alt={title}
              className="h-24 w-24 object-cover rounded-md"
            />
          ) : (
            icon
          )}
        </div>

        <h3 className="text-gray-700 text-sm font-medium">
          {title}{" "}
          {optional && (
            <span className="text-gray-400 text-xs">(Optional)</span>
          )}
        </h3>

        {file && !isImage && (
          <div className="flex text-xs text-gray-600 items-center justify-center gap-2 text-green-600 font-medium">
            <CheckCircle size={14} />
            <span>
              {isFileObject ? `${file.name} is selected` : "File uploaded"}
            </span>
          </div>
        )}

        {!file && (
          <p className="text-xs text-gray-500">
            {accept === "application/pdf,image/*"
              ? "PDF or Image"
              : "Image"}{" "}
            Click to select file
          </p>
        )}
      </div>
    </label>
  );
};

export default FileUpload;
