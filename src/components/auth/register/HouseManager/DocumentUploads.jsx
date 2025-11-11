"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FileText,  Image as ImageIcon, IdCardLanyard, IdCard, Cross } from "lucide-react";
import FileUpload from "../FileUpload";


const DocumentUploads = ({ defaultValues, onNext, onBack }) => {
  const documents = [
    {
      id: "firstAidCertificate",
      title: "First Aid Certificate",
      accept: "application/pdf,image/*",
      icon: <Cross size={32} />,
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
      id: "iDCopy",
      title: "ID Copy",
      accept: "application/pdf,image/*",
      icon: <IdCardLanyard size={32} />,
      required: true,
    },
    {
      id: "profilePhoto",
      title: "Profile Photo",
      accept: "image/*",
      icon: <ImageIcon size={32} />,
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
  ];

  const [files, setFiles] = useState({
    firstAidCertificate: defaultValues.firstAidCertificate || null,
    goodConductCertificate: defaultValues.goodConductCertificate || null,
    iDCopy: defaultValues.iDCopy || null,
    profilePhoto: defaultValues.profilePhoto || null,
    drivingLicense: defaultValues.drivingLicense || null,
  });

  const handleFileSelect = (id, file) => {
    setFiles((prev) => ({ ...prev, [id]: file }));
  };

  const handleSubmit = () => {
    // Validation
    for (const doc of documents) {
      if (doc.required && !files[doc.id]) {
        toast.error(`Please upload ${doc.title}`);
        return;
      }
    }

    onNext(files); // Pass all selected files to parent
  };

  return (
    <div className="space-y-6 w-full">
      <h4 className="formHeading">Document Uploads</h4>

      <div className="p-3 bg-primary/20 rounded-xl flex gap-2 items-center">
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
            optional={doc.optional}
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
