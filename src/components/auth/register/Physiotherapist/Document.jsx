import { Camera, FileCheck, FileText, IdCard, IdCardLanyard, ImageIcon } from "lucide-react";
import React from "react";
import FileUpload from "../FileUpload";

const Document = () => {
  const documents = [
    {
      id: 1,
      title: "ID Copy",
      accept: "application/pdf,image/*",
      icon: <IdCardLanyard size={32} />,
    },
    {
      id: 2,
      title: "Profile Photo",
      accept: "image/*",
      icon: <Camera size={32} />,
    },
    {
      id: 3,
      title: "Good Conduct Certificate",
      accept: "application/pdf,image/*",
      icon: <FileText size={32} />,
    },
    {
      id: 4,
      title: "Driving License (If applicabe)",
      accept: "application/pdf,image/*",
      icon: <IdCard size={32} />,
    },
    {
      id: 5,
      title: "Reference (Optional)",
      accept: "application/pdf,image/*",
      icon: <FileCheck size={32} />,
      optional: true,
    },
  ];
  return (
    <div>
      <div>
        <h2 className="formHeading">Document Uploads</h2>
        <div className="p-3 bg-primary/20 my-6 rounded-xl flex gap-2 items-center">
          <FileText />
          <span className="text-sm text-gray-700">
            Upload PDF or images (max size: 2MB each)
          </span>
        </div>
        <div className="grid grid-cols-1 mt-4 sm:grid-cols-2  gap-4">
          
            {documents.map((item, indx) => {
             return(
                <FileUpload
                key={indx}
                title={item.title}
                accept={item.accept}
                icon={item.icon}
                optional={item.optional}
                onFileSelect={(file) => handleFileSelect(item.id, file)}
              />
             )   
              
            })}
          
        </div>
      </div>
    </div>
  );
};

export default Document;
