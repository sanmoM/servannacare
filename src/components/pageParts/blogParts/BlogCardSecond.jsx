import { Calendar, MessageCircleMoreIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogCardSecond = ({ blog, slug }) => {
  const { id, title, description, image, category, comments, created_at } =
    blog;
  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="h-20 md:h-16 col-span-1">
        <Link className="" href={`/blog/${slug}?id=${id}`}>
    
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${image}`}
            alt={title}
            // fill
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
            {new Date(created_at)
              .toLocaleDateString("en-GB")
              .replace(/\//g, "-")
              .slice(0, 8)}
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
  );
};

export default BlogCardSecond;
