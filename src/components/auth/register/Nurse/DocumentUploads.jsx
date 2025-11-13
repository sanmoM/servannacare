"use client";

import React, { useState } from "react";
import FileUpload from "../FileUpload";
import {
  Camera,
  FileCheckCorner,
  FileText,
  IdCard,
  IdCardLanyard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";


const DocumentUploads = ({ defaultValues , onNext, onBack }) => {
  const [files, setFiles] = useState({
    idCopy: defaultValues.idCopy || null,
    profilePhoto: defaultValues.profilePhoto || null,
    goodConductCertificate: defaultValues.goodConductCertificate || null,
    drivingLicense: defaultValues.drivingLicense || null,
    referenceLetter: defaultValues.referenceLetter || null,
  });

  const documents = [
    {
      id: "idCopy",
      title: "ID Copy",
      accept: "application/pdf,image/*",
      icon: <IdCardLanyard size={32} />,
      required: true,
    },
    {
      id: "profilePhoto",
      title: "Profile Photo",
      accept: "image/*",
      icon: <Camera size={32} />,
      required: true,
    },
    {
      id: "goodConductCertificate",
      title: "Good Conduct Certificate",
      accept: "application/pdf,image/*",
      icon: <FileText size={32} />,
      required: true,
    },
    {
      id: "drivingLicense",
      title: "Driving License (Optional)",
      accept: "application/pdf,image/*",
      icon: <IdCard size={32} />,
      required: false,
      optional: true,
    },
    {
      id: "referenceLetter",
      title: "Reference Letter (Optional)",
      accept: "application/pdf,image/*",
      icon: <FileCheckCorner size={32} />,
      required: false,
      optional: true,
    },
  ];

  const handleFileSelect = (id, file) => {
    setFiles((prev) => ({ ...prev, [id]: file }));
  };

  const handleSubmit = () => {
    for (const doc of documents) {
      if (doc.required && !files[doc.id]) {
        toast.error(`Please upload ${doc.title}`);
        return;
      }
    }

    console.log(files);
    onNext(files);
  };

  return (
    <div>
      <h2 className="formHeading mb-4">Document Uploads</h2>

      <div className="p-3 bg-primary/20 rounded-xl flex gap-2 items-center mb-4">
        <FileText />
        <span className="text-sm text-gray-700">
          Upload PDF or images (max size: 2MB each)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <FileUpload
            key={doc.id}
            title={doc.title}
            accept={doc.accept}
            icon={doc.icon}
            optional={doc.optional || false}
            file={files[doc.id]}
            onFileSelect={(file) => handleFileSelect(doc.id, file)}
          />
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button type="button" size="lg" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" size="lg" onClick={handleSubmit}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploads;
