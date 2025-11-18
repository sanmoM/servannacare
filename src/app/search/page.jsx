"use client";

import Container from "@/components/shared/Container";
import ProfileCard from "@/components/profileCard";
import { fakeData } from "@/utilities/data";
import { notFound, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Search = () => {
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  if(!category || !startDate || !endDate){
    return notFound()
  }
  
  return (
    <Container className={"lg:py-16 py-12"}>
      <div className="pb-8">
        <div className="flex flex-col border-b sm:flex-row sm:items-center pb-2 gap-4 justify-between">
          <h2 className="font-medium text-sm md:text-base">
            Search by <span className="text-gray-600">{category}</span> and{" "}
            <span className="text-gray-600">{startDate}</span> to{" "}
            <span className="text-gray-600">{endDate}</span>
          </h2>

          <Select>
            <SelectTrigger className="w-[180px] border-primary">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="experience">Years of Experience</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fakeData.map((data, indx) => (
          <ProfileCard key={indx} profile={data} />
        ))}
      </div>
    </Container>
  );
};

export default Search;
