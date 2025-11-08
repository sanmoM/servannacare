"use client";

import {
  CheckCircle,
  FileText,
  FileCheck,
  Image as ImageIcon,
} from "lucide-react";
import React, { useState } from "react";

const DocumentUploads = () => {
  const documents = [
    {
      id: 1,
      title: "First Aid Certificate",
      accept: "application/pdf,image/*",
      icon: <FileCheck size={32} />,
    },
    {
      id: 2,
      title: "Good Conduct Certificate",
      accept: "application/pdf,image/*",
      icon: <FileCheck size={32} />,
    },
    {
      id: 3,
      title: "ID Copy",
      accept: "application/pdf,image/*",
      icon: <FileText size={32} />,
    },
    {
      id: 4,
      title: "Profile Photo",
      accept: "image/*",
      icon: <ImageIcon size={32} />,
    },
    {
      id: 5,
      title: "Driving License (Optional)",
      accept: "application/pdf,image/*",
      icon: <FileText size={32} />,
      optional: true,
    },
  ];

  const [files, setFiles] = useState({});

  const handleFileChange = (id, file) => {
    setFiles((prev) => ({ ...prev, [id]: file }));
  };

  return (
    <div className="w-full space-y-6">
      <h4 className="formHeading">Document Uploads</h4>

      <div className="p-3 bg-primary/20 rounded-xl flex gap-2 items-center">
        <FileText />
        <span className="text-xs text-gray-700">
          Upload PDF or images (max size: 2MB each)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => {
          const file = files[doc.id];
          const isImage = file && file.type.startsWith("image/");

          return (
            <label
              key={doc.id}
              className={`flex flex-col hover:bg-gray-50 items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors relative ${
                file ? "border-green-500" : "border-border"
              }`}
            >
              <input
                type="file"
                accept={doc.accept}
                onChange={(e) =>
                  handleFileChange(doc.id, e.target.files?.[0] || null)
                }
                className="hidden"
              />

              <div className="text-center space-y-3 w-full">
                <div className="flex justify-center">
                  {isImage ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={doc.title}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                  ) : (
                    doc.icon
                  )}
                </div>

                <h3 className="text-gray-700 text-sm font-medium ">{doc.title}</h3>

                {file && !isImage && (
                  <div className="flex text-xs text-gray-600 items-center justify-center gap-2 text-green-600 font-medium">
                    <CheckCircle />
                    <span>{file.name} is selected</span>
                  </div>
                )}

                {!file && (
                  <p className="text-xs text-gray-500">No file selected</p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentUploads;
