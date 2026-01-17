import BlogCard from "@/components/pageParts/blogParts/BlogCard";
import Faq from "@/components/pageParts/homeParts/Faq";
import HowItWorks from "@/components/pageParts/homeParts/HowItWorks";
import OurSpecialist from "@/components/pageParts/homeParts/OurSpecialist";
import Services from "@/components/pageParts/homeParts/Services";
import Slider from "@/components/pageParts/homeParts/Slider";
import Testimonials from "@/components/pageParts/homeParts/Testimonials";
import WhyChooseUs from "@/components/pageParts/homeParts/WhyChooseUs";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { getHomeData } from "@/lib/homeApi";
import { blogs } from "@/utilities/data";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {

    const homeData = await getHomeData();

  return (
    <div>
      <Slider />
      <Services />
      <HowItWorks  />
      <OurSpecialist/>

      {/* from our blog section  */}
      <div className="py-10  bg-[#ccb7c65b] md:py-16">
        <h2 className="text-center sectionHeading">From Our Blog</h2>
        <Container
          className={"grid grid-cols-1 gap-6 pt-10 md:pt-16 md:grid-cols-2"}
        >
          {blogs?.slice(0,4).map((blog, indx) => {
            const slug = blog.title.toLowerCase().replace(/ /g, "-");
            return <BlogCard data-aos="fade-up" key={indx} blog={blog} slug={slug}></BlogCard>;
          })}
        </Container>
         <Link href={"/blog"} className="mt-8 flex justify-center">
        <Button size={"lg"}>More <ChevronRight/></Button>
      </Link>
      </div>
      <Faq data={{faqHeader:homeData.data.faqHeader, faqs:homeData.data.faqs}}/>
      <WhyChooseUs/>
      <Testimonials/>
    </div>
  );
}
