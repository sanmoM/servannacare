import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Twitter,
} from "lucide-react";
import { PiTiktokLogo } from "react-icons/pi";
import React from "react";
import Container from "../Container";

const TopBar = () => {
  return (
    <div className="bg-primary py-4 text-gray-200 hidden md:block md:text-sm">
      <Container className={"flex justify-between items-center"}>
        <div className="flex  gap-8">
          <div className="flex gap-2 items-center">
            <Mail />
            customersupport@cervannacare.com
          </div>
          <div className="flex gap-2 items-center">
            <Phone />
            +254 700 225533
          </div>
        </div>

        <div className="flex items-center space-x-5 mt-4 sm:mt-0">
          <a
            target="_blank"
            href="https://www.tiktok.com/@cervanna.care?_r=1&_t=ZS-94SWjmHqWzU"
            aria-label="Tiktok"
            className="text-gray-200 hover:text-white transition-colors duration-200"
          >
            <PiTiktokLogo size={20} />
          </a>
          <a
            target="_blank"
            href="https://www.instagram.com/cervannacare?igsh=MXV2NmN2a3Nra2g3OA=="
            aria-label="Instagram"
            className="text-gray-200 hover:text-white transition-colors duration-200"
          >
            <Instagram size={20} />
          </a>
          <a
            target="_blank"
            href="https://www.linkedin.com/company/cervanna-care/"
            aria-label="LinkedIn"
            className="text-gray-200 hover:text-white transition-colors duration-200"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </Container>
    </div>
  );
};

export default TopBar;
