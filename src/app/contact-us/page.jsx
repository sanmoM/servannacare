"use client";
import Container from "@/components/shared/Container";
import Input from "@/components/shared/Input";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { Mail, MapPin, Phone } from "lucide-react";
import React, { useEffect, useState } from "react";

const page = () => {
  const [contacts, setcontacts] = useState(null);

  const { data, isLoading, error } = useFetch("/contacts");
  useEffect(() => {
    if (data) {
      setcontacts(data?.data?.data ?? data);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      <PageBanner
        title="Contact Us"
        image="https://static.tildacdn.com/tild3736-6138-4363-b864-396132643938/1620334808_33-phonot.jpg"
      />
      <Container>
        <div className=" py-10 lg:py-16 bg-card/50">
          <div className="mx-auto max-w-4xl">
            {contacts?.contact && (
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  {contacts?.contact?.heading}
                </h2>
                <p className="text-muted-foreground">
                  {contacts?.contact?.sub_heading}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contacts?.card?.map((item, indx) => (
                <div
                  key={indx}
                  data-aos="fade-up"
                  className="flex flex-col items-center p-8 rounded-lg border border-border bg-background hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
                    <span
                      dangerouslySetInnerHTML={{ __html: item?.icon }}
                      className="w-6 h-6 text-primary"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item?.title}
                  </h3>

                  <p className="text-center text-muted-foreground text-sm">
                    {item?.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-10 flex flex-col gap-6 lg:flex-row lg:py12">
          <div className="flex-1">
            <form
              className="space-y-4  p-6 rounded-xl border-2 lg:max-w-7xl mx-auto"
              action=""
              data-aos="fade-up"
            >
              <Input
                type="text"
                name="name"
                placeholder="Enter your Name"
                label="Name"
              />
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                label="Email"
              />
              <Input
                type="text"
                name="subject"
                placeholder="Subject"
                label="Subject"
              />
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-700"
                  htmlFor=""
                >
                  Message
                </label>
                <textarea
                  placeholder="Message"
                  className="border rounded-xl w-full  px-4 py-3 text-sm outline-primary"
                  rows={4}
                  name=""
                  id=""
                ></textarea>
              </div>
              <div className="flex justify-end">
                <Button className={"mt-4 w-full sm:w-auto "} size={"lg"}>
                  Submit
                </Button>
              </div>
            </form>
          </div>
          <div className="flex-1">
            <div
              data-aos="fade-up"
              className="w-full h-[400px] lg:h-full rounded-xl overflow-hidden"
            >
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: contacts?.contact?.map }}
              />
            </div>

            <style jsx global>{`
              iframe {
                width: 100% !important;
                height: 100% !important;
                border: 0;
                border-radius: 0.75rem;
              }
            `}</style>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default page;
