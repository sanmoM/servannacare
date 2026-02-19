"use client";
import BlogCard from "@/components/pageParts/blogParts/BlogCard";
import Faq from "@/components/pageParts/homeParts/Faq";
import HowItWorks from "@/components/pageParts/homeParts/HowItWorks";
import OurSpecialist from "@/components/pageParts/homeParts/OurSpecialist";
import Services from "@/components/pageParts/homeParts/Services";
import Slider from "@/components/pageParts/homeParts/Slider";
import Testimonials from "@/components/pageParts/homeParts/Testimonials";
import WhyChooseUs from "@/components/pageParts/homeParts/WhyChooseUs";
import Container from "@/components/shared/Container";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { blogs } from "@/utilities/data";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [homeData, setHomeData] = useState(null);

  const { data, isLoading, error } = useFetch("/home");
  useEffect(() => {
    if (data) {
      setHomeData(data?.data?.data ?? data);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;

  // console.log("Home data stored in state:", homeData);

  // useEffect(() => {
  //   const getHomeAllData = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await api.get("/home");
  //       const homeData = res?.data?.data;
  //       setData(homeData);
  //     } catch (err) {
  //       console.log(err);
  //       setData([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getHomeAllData();
  // }, []);

  return (
    <div>
      <Slider homeData={homeData} />
      <Services homeData={homeData} />
      <HowItWorks homeData={homeData} />
      <OurSpecialist />
    

      {/* from our blog section  */}
      <div className="py-10  bg-[#ccb7c65b] md:py-16">
        <h2 className="text-center sectionHeading">From Our Blog</h2>
        <Container
          className={"grid grid-cols-1 gap-6 pt-10 md:pt-16 md:grid-cols-2"}
        >
          {homeData?.blogs?.slice(0, 4).map((blog, indx) => {
            const slug = blog.title.toLowerCase().replace(/ /g, "-");
            return (
              <BlogCard
                data-aos="fade-up"
                key={indx}
                blog={blog}
                slug={slug}
              ></BlogCard>
            );
          })}
        </Container>
        <Link href={"/blog"} className="mt-8 flex justify-center">
          <Button size={"lg"}>
            More <ChevronRight />
          </Button>
        </Link>
      </div>
      <Faq homeData={homeData} />
      <WhyChooseUs Data={homeData} />
      <Testimonials homeData={homeData} />
    </div>
  );
}
