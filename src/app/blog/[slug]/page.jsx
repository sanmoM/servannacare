"use client";

import BlogCardSecond from "@/components/pageParts/blogParts/BlogCardSecond";
import Container from "@/components/shared/Container";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import Image from "next/image";
import { notFound, useSearchParams } from "next/navigation";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

const BlogDetails = () => {
  const searchParams = useSearchParams();
  const paramsId = searchParams.get("id");

  const [blogData, setBlogData] = useState(null);


  const { data, isLoading, error } = useFetch("/home");

  useEffect(() => {
    if (data) {
      setBlogData(data?.data?.data ?? data);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;

  if (!blogData || !paramsId) return null;

  const blog = blogData?.blogs?.find((blog) => blog.id === parseInt(paramsId));
  const slug = blog.title.toLowerCase().replace(/ /g, "-");
  console.log("single blog show here ", blog);

  if (!blog) {
    return notFound();
  }
  return (
    <div className="">
      <PageBanner title="Blog Details" />

      <Container className={" py-6 md:py-10 lg:py-16"}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-7">
          <div className="md:col-span-5">
            <h2 className="sectionHeading mb-4 lg:mb-6">{blog?.title}</h2>

            <div className="text-gray-700 mt-3 text-justify text-sm" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog?.description || "") }} />
            {/* <div className="flex flex-col md:flex-row gap-4 my-10">
              <div className="w-full">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${blog.image}`}
                  alt={blog?.title}
                  // fill
                  width={500}
                  height={200}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-md"
                />
              </div>
              <div className="w-full">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${blog.image}`}
                  alt={blog?.title}
                  // fill
                  width={500}
                  height={200}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-md"
                />
              </div>
            </div> */}
            {/* <h2 className="sectionHeading ">{blog?.title}</h2>
            <p className="text-gray-700 mt-4 lg:mt-6 text-justify text-sm">
               {blog?.description}
            </p> */}
          </div>
          <div className="md:col-span-2">
            <div className="md:sticky md:top-10 ">
              <h4 className="sectionHeading">Recent Posts</h4>
              <hr />
              <div className="space-y-6 pt-6">
                {blogData?.blogs?.slice(0, 5).map((blog, indx) => (
                  <BlogCardSecond key={indx} slug={slug} blog={blog} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BlogDetails;
