import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronRight,
} from "lucide-react";
import Container from "../Container";
import Image from "next/image";
import Link from "next/link";

const FooterLink = ({ href, children }) => (
  <li>
    <a
      href={href}
      className="flex items-center text-sm space-x-2 text-blue-200 hover:text-white transition-colors duration-200"
    >
      <ChevronRight size={16} />
      <span>{children}</span>
    </a>
  </li>
);

const Footer = () => {
  return (
    <footer className="bg-secondary font-inter text-blue-200">
      <Container className={"py-12"}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Logo, Description, Newsletter */}
          <div className="md:col-span-1">
            <div className="inline-block">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="logo"
                  quality={100}
                  width={80}
                  height={100}
                />
              </Link>
            </div>

            <p className="mt-4 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="#">Our Services</FooterLink>
              <FooterLink href="about-us">About Us</FooterLink>
              <FooterLink href="#">Contact Us</FooterLink>
              <FooterLink href="#">FAQ</FooterLink>
            </ul>
          </div>

          {/* Column 3: Health Consulting */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Health Consulting
            </h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="#">Planning</FooterLink>
              <FooterLink href="#">Health Information</FooterLink>
              <FooterLink href="#">Regulatory</FooterLink>
              <FooterLink href="#">Health Improvement</FooterLink>
              <FooterLink href="#">Telehealth</FooterLink>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Head Office Address
            </h3>
            <p className="mt-4 text-sm leading-relaxed">
              Lumbung Hidup St 425 East Java
              <br />
              Madiun City Block ABC 123
            </p>
            <h3 className="mt-8 text-lg font-semibold text-white">Days Open</h3>
            <p className="mt-4 text-sm">Monday - Friday 08 AM - 10 PM</p>
          </div>
        </div>

        <form className="mt-6 flex max-w-lg  rounded-lg overflow-hidden">
          <input
            type="email"
            placeholder="Email"
            aria-label="Email Address"
            className="w-full px-4 py-3 text-sm text-gray-900 bg-white border-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            className="px-6 cursor-pointer py-3 text-sm font-semibold text-white bg-primary hover:bg-c transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            SUBSCRIBE
          </button>
        </form>

        {/* Bottom section: Copyright and Socials */}
        <hr className="my-10 border-primary" />
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <p className="text-xs text-center sm:text-left">
            ALLRIGHT RESERVED - SERVANNACARE
          </p>
          <div className="flex items-center space-x-5 mt-4 sm:mt-0">
            <a
              href="#"
              aria-label="Facebook"
              className="text-blue-200 hover:text-white transition-colors duration-200"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-blue-200 hover:text-white transition-colors duration-200"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-blue-200 hover:text-white transition-colors duration-200"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-blue-200 hover:text-white transition-colors duration-200"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
