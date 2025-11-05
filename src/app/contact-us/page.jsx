import Container from "@/components/shared/Container";
import Input from "@/components/shared/Input";
import PageBanner from "@/components/shared/PageBanner";
import { Mail, MapPin, Phone } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div>
      <PageBanner
        title="Contact Us"
        image="https://static.tildacdn.com/tild3736-6138-4363-b864-396132643938/1620334808_33-phonot.jpg"
      />
      <Container>
        <div className=" py-10 lg:py-16 bg-card/50">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Get In Touch
              </h2>
              <p className="text-muted-foreground">
                We are here to help and answer any question you might have
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Location Card */}
              <div data-aos="fade-up" className="flex flex-col items-center p-8 rounded-lg border border-border bg-background hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 mb-4">
                  <MapPin className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Location
                </h3>
                <p className="text-center text-muted-foreground text-sm">
                  123 Main Street
                  <br />
                  Nairobi, Kenya
                </p>
              </div>

              {/* Email Card */}
              <div data-aos="fade-up" className="flex flex-col items-center p-8 rounded-lg border border-border bg-background hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-cyan-100 mb-4">
                  <Mail className="h-7 w-7 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Mail Us
                </h3>
                <a
                  href="mailto:hello@example.com"
                  className="text-center text-muted-foreground text-sm hover:text-foreground transition-colors"
                >
                  hello@example.com
                </a>
              </div>

              {/* Phone Card */}
              <div data-aos="fade-up" className="flex flex-col items-center p-8 rounded-lg border border-border bg-background hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-purple-100 mb-4">
                  <Phone className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Phone Us
                </h3>
                <a
                  href="tel:+254712345678"
                  className="text-center text-muted-foreground text-sm hover:text-foreground transition-colors"
                >
                  +254 712 345 678
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="py-10 flex flex-col gap-6 lg:flex-row lg:py12">
          <div className="flex-1">
            <form
              className="md:max-w-xl space-y-4 border p-6 shadow-xl rounded-xl lg:max-w-7xl mx-auto"
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
            </form>
          </div>
          <div className="flex-1">
            <div data-aos="fade-up" className="w-full  h-[400px] lg:h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245310.35812319018!2d36.68258298900557!3d-1.3032035601563885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e1!3m2!1sen!2sbd!4v1762332901698!5m2!1sen!2sbd"
                className="w-full h-full rounded-xl border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default page;
