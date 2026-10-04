"use client";

import Container from "@/components/shared/Container";
import Input from "@/components/shared/Input";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { postApi } from "@/lib/apiHandler";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
const ContactClient = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [contacts, setcontacts] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    if (name === "name" && value.length > 15) return;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 15) {
      newErrors.name = "Name must be max 15 characters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setIsActionLoading(true);
    try {
      const res = await postApi("/contact-data", formData);
      if (!res.status) {
        throw new Error();
      }
      toast.success("Thanks for Contacting with us!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };
  const {
    data,
    isLoading,
    error
  } = useFetch("/contacts");
  useEffect(() => {
    if (data) {
      setcontacts(data?.data?.data ?? data);
    }
  }, [data]);
  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;
  return <div>
      <PageBanner title="Contact Us" image="https://static.tildacdn.com/tild3736-6138-4363-b864-396132643938/1620334808_33-phonot.jpg" />
      <Container>
        <div className=" py-10 lg:py-16 bg-card/50">
          <div className="mx-auto max-w-4xl">
            {contacts?.contact && <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  {contacts?.contact?.heading}
                </h2>
                <p className="text-muted-foreground">
                  {contacts?.contact?.sub_heading}
                </p>
              </div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contacts?.card?.map((item, indx) => <div key={indx} data-aos="fade-up" className="flex flex-col items-center p-8 rounded-lg border border-border bg-background hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
                    <span dangerouslySetInnerHTML={{
                  __html: item?.icon
                }} className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item?.title}
                  </h3>

                  <p className="text-center text-muted-foreground text-sm">
                    {item?.subtitle}
                  </p>
                </div>)}
            </div>
          </div>
        </div>

        {/* WhatsApp Call to Action Banner */}
        <div data-aos="fade-up" className="my-8 p-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 rounded-2xl shadow-lg text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-inner">
              <FaWhatsapp className="size-8 text-white drop-shadow-xs" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-100">
                  Instant WhatsApp Support
                </span>
              </div>
              <h3 className="text-xl font-bold">Chat With Us on WhatsApp</h3>
              <p className="text-emerald-100 text-sm mt-0.5 max-w-xl">
                Need immediate care assistance or have questions? Click to chat directly with our team for prompt support.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/message/BCDIGKLB5F4OF1"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-white hover:bg-emerald-50 text-emerald-700 px-6 py-3.5 rounded-full font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <FaWhatsapp className="size-5 text-[#25D366]" />
            <span>Open WhatsApp Chat</span>
          </a>
        </div>

        <div className="py-10 flex flex-col gap-6 lg:flex-row lg:py12">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-xl border-2 lg:max-w-7xl mx-auto" data-aos="fade-up">
              <Input type="text" name="name" placeholder="Enter your Name" label="Name" value={formData.name} onChange={handleChange} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              <Input type="email" name="email" placeholder="Enter your email" label="Email" value={formData.email} onChange={handleChange} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              <Input type="text" name="subject" placeholder="Subject" label="Subject" value={formData.subject} onChange={handleChange} />
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="">
                  Message
                </label>
                <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} className="border rounded-xl w-full px-4 py-3 text-sm outline-primary" rows={4} />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="mt-4 w-full sm:w-auto cursor-pointer" size="lg" isActionLoading={isActionLoading}>
                  Submit
                </Button>
              </div>
            </form>
          </div>
          <div className="flex-1">
            <div data-aos="fade-up" className="w-full h-[400px] lg:h-full rounded-xl overflow-hidden">
              <div className="w-full h-full" dangerouslySetInnerHTML={{
              __html: contacts?.contact?.map
            }} />
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
    </div>;
};
export default ContactClient;