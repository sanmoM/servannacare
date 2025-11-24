import BlogCard from "@/components/pageParts/blogParts/BlogCard";
import HowItWorks from "@/components/pageParts/homeParts/HowItWorks";
import Services from "@/components/pageParts/homeParts/Services";
import Slider from "@/components/pageParts/homeParts/Slider";
import Testimonials from "@/components/pageParts/homeParts/Testimonials";
import Container from "@/components/shared/Container";
import { blogs } from "@/utilities/data";

export default function Home() {
  return (
    <div>
      <Slider />
      <Services />
      <HowItWorks />
      {/* from our blog section  */}
      <div className="py-10  bg-[#f7f7ff] md:py-16">
        <h2 className="text-center sectionHeading">From Our Blog</h2>
        <Container
          className={"grid grid-cols-1 gap-6 pt-10 md:pt-16 md:grid-cols-2"}
        >
          {blogs.slice(0, 4).map((blog, indx) => {
            const slug = blog.title.toLowerCase().replace(/ /g, "-");
            return <BlogCard data-aos="fade-up" key={indx} blog={blog} slug={slug}></BlogCard>;
          })}
        </Container>
      </div>
      <Testimonials />
    </div>
  );
}
