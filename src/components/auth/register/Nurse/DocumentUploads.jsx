import React from "react";
import FileUpload from "../FileUpload";
import {
  Camera,
  FileCheckCorner,
  FileText,
  IdCard,
  IdCardLanyard,
} from "lucide-react";

const DocumentUploads = () => {
  return (
    <div>
      <div>
        <h2 className="formHeading mb-4">Document Uploads</h2>
        <div className="p-3 bg-primary/20 rounded-xl flex gap-2 items-center">
          <FileText />
          <span className="text-sm text-gray-700">
            Upload PDF or images (max size: 2MB each)
          </span>
        </div>
        <div className="grid grid-cols-1 mt-4 sm:grid-cols-2  gap-4">
          <div>
            <FileUpload
              title="ID Copy"
              accept="application/pdf,image/*"
              icon={<IdCardLanyard size={32} />}
              optional=""
              onFileSelect={(file) => handleFileSelect(1, file)}
            />
          </div>

          <div>
            <FileUpload
              title="Profile Photo"
              accept="image/*"
              icon={<Camera size={32} />}
              optional=""
              onFileSelect={(file) => handleFileSelect(1, file)}
            />
          </div>

          <div>
            <FileUpload
              title="Good Conduct Certificate"
              accept="application/pdf,image/*"
              icon={<FileText size={32} />}
              optional=""
              onFileSelect={(file) => handleFileSelect(1, file)}
            />
          </div>

          <div>
            <FileUpload
              title="Driving License (If Applicable)"
              accept="application/pdf,image/*"
              icon={<IdCard size={32} />}
              optional=""
              onFileSelect={(file) => handleFileSelect(1, file)}
            />
          </div>

          <div>
            <FileUpload
              title="Reference Letter (Optional)"
              accept="application/pdf,image/*"
              icon={<FileCheckCorner size={32} />}
              optional=""
              onFileSelect={(file) => handleFileSelect(1, file)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploads;
