import { Calendar, MessageCircleMoreIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogCardSecond = ({ blog, slug }) => {
  const { id, title, description, image, category, comments, created_at } =
    blog;
  return (
    <Link href={`/blog/${slug}?id=${id}`}>
      <div className="grid grid-cols-4 gap-2 cursor-pointer">
        <div className="h-20 md:h-16 col-span-1">
          <Link className="" href={`/blog/${slug}?id=${id}`}>
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${image}`}
              alt={title}
       
              width={500}
              height={200}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-md"
            />
          </Link>
        </div>
        <div className="col-span-3">
          <div className="flex items-center gap-2">
            <Calendar width={14} />
            <p className="text-xs">
              {(() => {
                const date = new Date(created_at);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = String(date.getFullYear()).slice(-2);
                return `${day}-${month}-${year}`;
              })()}
            </p>
          </div>
          <Link
            href={`/blog/${slug}?id=${id}`}
            className="text-sm  font-semibold cursor-pointer hover:text-primary"
          >
            {title}
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default BlogCardSecond;
