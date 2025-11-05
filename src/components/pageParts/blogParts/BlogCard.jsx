import { Button } from "@/components/ui/button";
import {
  Calendar,
  Facebook,
  Instagram,
  MessageCircleMoreIcon,
  User,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogCard = ({ blog,slug }) => {
  const { id, title, description, image, category, comments, date } = blog;
  return (
    // <div className="">
    //   <div className="w-full max-w-full  mx-auto">
    //     <Image
    //       src={image}
    //       alt="blog"
    //       width={500}
    //       height={300}
    //       quality={100}
    //       className="w-full h-full rounded-md object-cover"
    //     />
    //   </div>
    //   <div className="flex justify-between py-4">
    //     <div className="flex gap-2 items-center">
    //       <User width={30} height={30} className="border rounded-full " />
    //       <p className="text-xs md:text-sm text-gray-700">Admin</p>
    //     </div>
    //     <div className="text-gray-500 flex gap-4">
    //       <div className="flex items-center gap-2">
    //         <Calendar />
    //         <p className="text-sm">{date}</p>
    //       </div>
    //       <div className="flex gap-1 hover:text-primary cursor-pointer items-center">
    //         <MessageCircleMoreIcon />
    //         <p className="text-sm">{comments.length}</p>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="pb-8">
    //     <p className="text-sm text-gray-700">{category}</p>
    //     <h2 className="sectionHeading pb-2 text-primary">{title}</h2>
    //     <p className="text-gray-600 text-xs md:text-sm">{description}</p>
    //   </div>
    //   <hr />
    //   <div className="flex justify-between pt-4 pb-16">
    //     <div>
    //       <Link href={"#"}>
    //         <Button>Read More</Button>
    //       </Link>
    //     </div>
    //     <div className="flex gap-2">
    //       <Link href={"#"}>
    //         <Button className={"rounded-full h-8 w-8"} variant={"outline"}>
    //           <Facebook />
    //         </Button>
    //       </Link>
    //       <Link href={"#"}>
    //         <Button className={"rounded-full h-8 w-8"} variant={"outline"}>
    //           <Instagram />
    //         </Button>
    //       </Link>
    //       <Link href={"#"}>
    //         <Button className={"rounded-full h-8 w-8"} variant={"outline"}>
    //           <Youtube />
    //         </Button>
    //       </Link>
    //     </div>
    //   </div>
    // </div>
    <div data-aos="fade-up" className="flex flex-col lg:flex-row gap-4">
  {/* Image Section */}
  <div className="flex-1">
    <div className="relative w-full h-56 md:h-64 lg:h-60 overflow-hidden rounded-md">
      <Image
        src={image}
        alt="blog"
        fill
        quality={100}
        className="object-cover h-full"
        
      />
    </div>
  </div>

  {/* Text Section */}
  <div className="flex-1">
    

    <Link
      href={`/blog/${slug}?id=${id}`}
      className="text-base lg:text-lg font-semibold text-gray-900 cursor-pointer hover:text-primary"
    >
      {title}
    </Link>

    {/* Truncated Description */}
    <p className="text-gray-700 text-sm mt-1">
      {description.length > 60
        ? description.substring(0, 150) + "..."
        : description}
    </p>

    <div className="flex items-center text-gray-600 gap-2 mt-2">
      <Calendar width={14} />
      <p className="text-xs">{date}</p>
    </div>

    <div className="flex justify-between mt-3">
      <Link href={`/blog/${slug}?id=${id}`}>
        <Button>Read More</Button>
      </Link>
      <div className="flex gap-1 hover:text-primary cursor-pointer items-center">
        <MessageCircleMoreIcon />
        <p className="text-sm">{comments.length}</p>
      </div>
    </div>
  </div>
</div>

  );
};

export default BlogCard;
