import BlogCard from '@/components/pageParts/blogParts/BlogCard';
import BlogCardSecond from '@/components/pageParts/blogParts/BlogCardSecond';
import Container from '@/components/shared/Container'
import PageBanner from '@/components/shared/PageBanner'
import { blogs } from '@/utilities/data';
import React from 'react'

const page = () => {


  return (
    <div>
      <PageBanner
      title='Our Blogs and Activity'
      image='https://cdn.culture.ru/images/480cdb17-69c2-5213-bfe5-c5e8487631b7'
      />

      <Container className={"grid grid-cols-1 gap-6 py-16 md:grid-cols-2"}>
        {/* <div className='col-span-3'>
            {blogs.map((blog,indx) => {
              return(
                <BlogCard blog={blog} key={indx}></BlogCard>
              )
            })}
        </div>
        <div className='col-span-2'>
            <h4 className='sectionHeading'>Recent Posts</h4>
            <hr />
            <div className='space-y-8 pt-6'>
              {
              blogs.map((blog,indx) => {
                return(
                  <BlogCardSecond key={indx} blog={blog}></BlogCardSecond>
                )
              })
            }
            </div>
        </div> */}
        {
          blogs.map((blog,indx) => {
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
