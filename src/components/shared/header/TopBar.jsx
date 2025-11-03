import { Facebook, Instagram, Linkedin, Mail, Phone, Twitter } from "lucide-react";
import React from "react";
import Container from "../Container";

const TopBar = () => {
  return (
    <div className="bg-primary py-4 text-blue-200 hidden md:block md:text-sm">
      <Container className={"flex justify-between items-center"} >
        
          <div className="flex  gap-8">
            <div className="flex gap-2 items-center">
            <Mail />
            servannacare@mail.com
          </div>
          <div className="flex gap-2 items-center">
            <Phone />
            +98 876 543 321
          </div>
          </div>

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
        
      </Container>
    </div>
  );
};

export default TopBar;
