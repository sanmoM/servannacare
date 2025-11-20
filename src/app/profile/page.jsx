"use client";

import Container from "@/components/shared/Container";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building, Check, Mail, Phone } from "lucide-react";
import React from "react";

const Profile = () => {

  return (
    <>
      <PageBanner
        title="Profile"
        image={
          "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/cf136a11386527.560f6e447cc13.jpg"
        }
      />
      <Container className={"py-16 grid md:grid-cols-6 gap-8"}>
        <div className=" md:col-span-2 ">
          <div className="p-4 rounded-md items-center relative border-t-primary justify-center  border flex flex-col border-t-4">
            
              <img
              className="object-cover h-40 w-40 lg:w-60 lg:h-60  rounded-full border-4 border-white shadow-lg"
              src={
                "https://images.unsplash.com/photo-1672843192615-5913ef88bf17?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt={`profile`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/160x160/6366f1/white?text=${profile.name.charAt(
                  0
                )}`;
              }}
            />
            <span className="text-xs  absolute top-3 right-3  bg-green-600 p-1 rounded-full px-2 text-white">Available Now</span>
          
            
            <h2 className="text-2xl mt-4 lg:text-3xl text-gray-800 font-semibold">
              Jhon Doe
            </h2>
            <p className="text-sm mt-2 font-semibold text-primary">
              House Manager
            </p>
          </div>
          <div className="p-4 mt-6 rounded-md border">
            <h2 className="subHeading mb-3">PERSONAL INFO</h2>
            <div className="flex gap-2 items-center">
              <Phone />
              <div>
                <Label className={"text-xs"}>Phone</Label>
                <p className="text-sm mt-1 text-gray-600">+ (123) 1800-567</p>
              </div>
            </div>

            <div className="flex gap-2 my-4 items-center">
              <Building />
              <div>
                <Label className={"text-xs"}>Office</Label>
                <p className="text-sm mt-1 text-gray-600">+ (123) 1800-567</p>
              </div>
            </div>

            <div className="flex gap-2 my-4 items-center">
              <Mail />
              <div>
                <Label className={"text-xs"}>Mail</Label>
                <p className="text-sm mt-1 text-gray-600">example@ex.com</p>
              </div>
            </div>
          </div>
          <Button className={"w-full mt-6"} size={"lg"}>Book Now</Button>
        </div>
        <div className=" md:col-span-4 ">
          <h2 className="subHeading border-b border-primary mb-4">BIO</h2>
          <p className="text-sm">
            Efficiently myocardinate market-driven innovation via open-source
            alignments. Dramatically engage high-Phosfluorescently expedite
            impactful supply chains via focused results. Holistically .
            Compellingly supply just in time catalysts for change through..
          </p>
          <p className="text-sm text-gray-600 my-6">
            Exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea
            commodo non habent claritatem insitamconsequat duis autem facilisis
            at vero eros vel eum iriure. Duis autem vel eum iriure dolor in
            hendrerit in vulputate velit esse molestie consequat, vel illum
            dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto
            odio dignissim qui blandit praesent luptatum zzril delenit augue
            duis dolore te feugait nulla facilisi.Exerci tation ullamcorper
          </p>
          <div className="my-8">
            <h2 className="subHeading border-b border-primary mb-4">
              BASIC INFO
            </h2>
            <span className="flex gap-1 flex-wrap ">
              <Label>Location :</Label>{" "}
              <p className="text-sm text-gray-500">USA</p>
            </span>
            <span className="flex gap-1 my-1 flex-wrap ">
              <Label>Age :</Label>{" "}
              <p className="text-sm text-gray-500">30 years old</p>
            </span>
            <span className="flex gap-1 flex-wrap ">
              <Label>Language Spoken :</Label>{" "}
              <p className="text-sm text-gray-500">Eglish, French, Arabic</p>
            </span>
          </div>

          <div className="mb-8">
            <h2 className="subHeading border-b border-primary mb-4">
              EDUCATION & SKILLS
            </h2>
            <span className="flex flex-wrap  gap-1">
              <Label>Degree :</Label>{" "}
              <p className="text-sm text-gray-500">Diploma In Nursing</p>
            </span>

            <span className="flex flex-wrap  gap-1 my-1">
              <Label>Experience in :</Label>{" "}
              <p className="text-sm text-gray-500">
                Basic Patient Care (Bathing, dressing, feeding, mobility),
                Medical Assistance, Communication skills
              </p>
            </span>

            <span className="flex gap-1 flex-wrap ">
              <Label>Intersted in :</Label>{" "}
              <p className="text-sm text-gray-500">
                ElDery Care, Disability Support, Post Surgery Care
              </p>
            </span>

             <span className="flex gap-1 mt-1 flex-wrap ">
              <Label>Can Drive :</Label>{" "}
              <p className="text-sm text-gray-500">
               Yes
              </p>
            </span>
          </div>

          <div>
            <h2 className="subHeading border-b border-primary mb-4">
              Experience
            </h2>
            <span className="flex gap-1 flex-wrap ">
              <Label>Years of Experience :</Label>{" "}
              <p className="text-sm text-gray-500">
               7
              </p>
            </span>
            <span className="flex gap-1 my-1 flex-wrap ">
              <Check className="text-primary" />
              <Label>Nursign Council of Kenya</Label>
            </span>
            <span className="flex gap-1 flex-wrap ">
              <Check className="text-primary" />
              <Label>Hospital Based Care</Label>
            </span>
             <span className="flex gap-1 mt-1 flex-wrap ">
              <Check className="text-primary" />
              <Label>Home Based Care</Label>
            </span>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Profile;
