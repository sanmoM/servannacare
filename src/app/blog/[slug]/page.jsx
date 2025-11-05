"use client";

import BlogCardSecond from "@/components/pageParts/blogParts/BlogCardSecond";
import Container from "@/components/shared/Container";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { blogs } from "@/utilities/data";
import Image from "next/image";
import { notFound, useSearchParams } from "next/navigation";
import React from "react";

const BlogDetails = () => {
  const serarchParams = useSearchParams();
  const paramsId = serarchParams.get("id");

  const blog = blogs.find((blog) => blog.id === parseInt(paramsId));
  const slug = blog.title.toLowerCase().replace(/ /g, "-");

  if (!blog) {
    return notFound();
  }

  return (
    <div className="">
      <PageBanner title="Blog Details" />

      <Container className={" py-6 md:py-10 lg:py-16"}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-7">
          <div className="md:col-span-5">
            <h2 className="sectionHeading mb-4 lg:mb-6">{blog.title}</h2>
            <p className="text-gray-700 text-justify text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
              quod dolore modi neque. Accusamus dolorem maiores non commodi
              maxime? Dolorum tempora magni impedit totam, mollitia ea itaque et
              possimus eligendi vel recusandae nesciunt ab deserunt a vitae
              ipsum sed earum quibusdam corporis cumque? Ipsum iusto quo et enim
              nisi repudiandae alias! Quibusdam ratione odio vel ea quo, et
              voluptas sunt suscipit cumque obcaecati fugit deserunt nesciunt
              repellendus ipsam, similique optio. Est excepturi voluptatum ipsam
              accusamus tempora, eligendi tenetur reiciendis facere sit, atque
              sed molestiae dolore. Cum aperiam dolores dolorem explicabo
              similique blanditiis officia accusantium vitae porro iusto?
              Commodi, ipsam nobis.
            </p>
            <p className="text-gray-700 mt-3 text-justify text-sm">
              {blog.description}
            </p>
            <div className="flex flex-col md:flex-row gap-4 my-10">
              <div className="w-full">
                <Image
                  alt="blog"
                  src={blog?.image}
                  width={500}
                  height={200}
                  className="w-full rounded-md"
                />
              </div>
              <div className="w-full">
                <Image
                  alt="blog"
                  src={blog?.image}
                  width={500}
                  height={200}
                  className="w-full rounded-md"
                />
              </div>
            </div>
            <h2 className="sectionHeading ">{blog.title}</h2>
            <p className="text-gray-700 mt-4 lg:mt-6 text-justify text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
              accusamus quisquam saepe amet sequi ab aspernatur inventore
              voluptatem. Eius corrupti magni recusandae fuga ab, necessitatibus
              error eaque, quisquam dicta officiis laboriosam fugit ipsa sint
              sapiente cumque? Aut autem, necessitatibus facere ab nihil
              doloribus, delectus aliquam quasi sapiente nemo minus, voluptatem
              nam ut omnis vitae. Eum, distinctio fuga! Numquam earum, harum,
              assumenda repellat quo eligendi, ducimus nulla veniam sint aliquid
              odit!
            </p>

            <div className="mt-6 lg:mt-10">
              <h2 className="sectionHeading">Leave a Reply</h2>
              <form className="mt-3" action="">
                <label
                  className="text-gray-700 text-sm md:text-base"
                  htmlFor="comment"
                >
                  Comment*
                </label>
                <textarea
                  rows={7}
                  className="border mt-2 w-full outline-primary p-4 rounded-xl"
                  placeholder="Enter your comment..."
                  name="comment"
                  id="comment"
                ></textarea>
                <Button size={"lg"}>Send</Button>
              </form>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="md:sticky md:top-10 ">
              <h4 className="sectionHeading">Recent Posts</h4>
              <hr />
              <div className="space-y-6 pt-6">
                {blogs.slice(0, 5).map((blog, indx) => (
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
