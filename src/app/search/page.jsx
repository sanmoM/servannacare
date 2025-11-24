"use client";

import Container from "@/components/shared/Container";
import ProfileCard from "@/components/profileCard";
import { fakeData, services } from "@/utilities/data";
import { notFound, useSearchParams } from "next/navigation";
import React, { useMemo, useState, Suspense } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageBanner from "@/components/shared/PageBanner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import LoadingSpinner from "@/components/shared/LoadingSpin";

const SearchContent = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const itemsPerPage = 8;
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const sortData = useMemo(() => {
    let data = [...fakeData];

    if (sortBy === "experience") {
      data.sort((a, b) => b.experience - a.experience);
    } else if (sortBy === "rating") {
      data.sort((a, b) => b.rating - a.rating);
    }
    return data;
  }, [sortBy]);

  // pagination
  const totalPages = Math.ceil(sortData.length / itemsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortData.slice(start, start + itemsPerPage);
  }, [currentPage, sortData]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!category) {
    return notFound();
  }

  return (
    <>
      <PageBanner title="Our Specialist" />
      <Container className={"lg:py-16 py-12"}>
        <div className="pb-8">
          <div className="flex flex-col border-b sm:flex-row sm:items-center pb-2 gap-4 justify-between">
            {
              startDate || endDate ?<h2 className="font-medium text-sm md:text-base">
              Search by <span className="text-gray-600">{category}</span> and{" "}
              <span className="text-gray-600">{startDate}</span> to{" "}
              <span className="text-gray-600">{endDate}</span>
            </h2>:<h2 className="font-medium text-sm md:text-base">
              Showing <span className="text-gray-600">{category}</span>  services <span className="text-gray-600">{currentData.length}</span>  of <span className="text-gray-600">{fakeData.length}</span> 
              
            </h2>
            }
            

            <Select
              onValueChange={(value) => {
                setSortBy(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] border-primary">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="experience">
                    Years of Experience
                  </SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {currentData.map((data, indx) => (
            <ProfileCard key={indx} profile={data} />
          ))}
        </div>

        <div className="mt-16">
          <Pagination className={"flex justify-center md:justify-end"}>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => goToPage(currentPage - 1)}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={() => goToPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => goToPage(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Container>
    </>
  );
};

const Search = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full py-20 text-center text-primary font-semibold">
          <LoadingSpinner/>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
};

export default Search;
