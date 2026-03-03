"use client"
import BlogCard from '@/components/pageParts/blogParts/BlogCard';
import Container from '@/components/shared/Container'
import LoadingSpinner from '@/components/shared/LoadingSpin';
import PageBanner from '@/components/shared/PageBanner'
import { useFetch } from '@/hooks/useFetch';
// import { blogs } from '@/utilities/data';
import React, { useEffect, useState } from 'react'

const page = () => {
  const [blogs, setBlogs] = useState(null);


  const { data, isLoading, error } = useFetch("/home");
  useEffect(() => {
    if (data) {
      setBlogs(data?.data?.data ?? data); 
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner/>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      <PageBanner
      title='Our Blogs and Activity'
      image='https://cdn.culture.ru/images/480cdb17-69c2-5213-bfe5-c5e8487631b7'
      />

      <Container className={"grid grid-cols-1 gap-6 py-10 md:py-16 md:grid-cols-2"}>
        {
          blogs?.blogs?.map((blog,indx) => {
            const slug = blog.title.toLowerCase().replace(/ /g, "-");
            return(
              <BlogCard key={indx} blog={blog} slug={slug}></BlogCard>
            )
          })
        }
      </Container>
    </div>
  )
}

export default page
