import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatDate";
import { Calendar, MessageCircleMoreIcon, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogCard = ({ blog, slug }) => {
  const { id, title, description, image, category, comments } = blog;
  const date = new Date(blog.created_at);
  return (
    <div data-aos="fade-up" className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <div className="relative w-full h-56 md:h-64 lg:h-60 overflow-hidden rounded-md">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${image}`}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Text Section */}
      <div className="flex-1 flex flex-col h-full">
        <Link
          href={`/blog/${slug}?id=${id}`}
          className="text-base lg:text-lg font-semibold text-gray-900 cursor-pointer hover:text-primary"
        >
          {title}
        </Link>

        {/* Truncated Description */}
        <p className="text-gray-700 text-sm mt-2">
          {description.length > 60
            ? description.substring(0, 150) + "..."
            : description}
        </p>

        {/* <div className="flex items-center text-gray-600 gap-2 mt-2">
      <Calendar width={14} />
      <p className="text-xs">{formatDate(blog.date)}</p>
    </div> */}

        <div className="flex justify-between mt-auto pt-3">
          <Link href={`/blog/${slug}?id=${id}`}>
            <Button className={"cursor-pointer"}>Read More</Button>
          </Link>
          {/* <div className="flex gap-1 hover:text-primary cursor-pointer items-center">
            <MessageCircleMoreIcon />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
