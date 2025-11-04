import { Calendar, MessageCircleMoreIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogCardSecond = ({ blog, slug }) => {
  const { id, title, description, image, category, comments, date } = blog;
  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="h-20 md:h-16 col-span-1">
        <Link className="" href={`/blog/${slug}?id=${id}`}>
          <Image
            src={image}
            height={100}
            width={100}
            quality={100}
            alt="blog image"
            className="h-full"
          />
        </Link>
      </div>
      <div className="col-span-3">
        <div className="flex items-center gap-2">
            <Calendar width={14} />
            <p className="text-xs">{date}</p>
          </div>
        <Link href={`/blog/${slug}?id=${id}`} className="text-sm  font-semibold cursor-pointer hover:text-primary">{title}</Link>
      </div>
    </div>
  );
};

export default BlogCardSecond;
