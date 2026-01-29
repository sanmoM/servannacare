import Image from "next/image";

 const FilePreview = ({ file, alt }) => {
  if (!file) return null;

  const isFile = file instanceof File;
  const isString = typeof file === "string";

  const isImage =
    (isFile && file.type.startsWith("image/")) ||
    (isString && file.match(/\.(jpg|jpeg|png|gif|webp)$/i));

  const fileUrl = isFile
    ? URL.createObjectURL(file)
    : isString
    ? file.startsWith("http")
      ? file
      : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${file}`
    : null;

  if (!fileUrl) return null;

  return (
    <div className="mt-2">
      {isImage ? (
        <Image
          src={fileUrl}
          alt={alt}
          width={120}
          height={120}
          className="rounded object-cover"
        />
      ) : (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm"
        >
          View document
        </a>
      )}
    </div>
  );
};
export default FilePreview
