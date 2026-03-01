"use client";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { useFetch } from "@/hooks/useFetch";
import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";

const page = () => {
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState({
    average: 0,
    totalReviews: 0,
    stars: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  });

  const { data, isLoading, error } = useFetch("/specialist-review");

  useEffect(() => {
    if (data) {
      const reviewsData = data?.data?.data ?? [];
      setReviews(reviewsData);

      const starCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let totalRating = 0;

      reviewsData?.forEach((review) => {
        const rating = review.rating;
        starCount[rating] = (starCount[rating] || 0) + 1;
        totalRating += rating;
      });

      const totalReviews = reviewsData.length;
      const averageRating =
        totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

      setRatings({
        average: averageRating,
        totalReviews,
        stars: starCount,
      });
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      <div className="mb-10">
        <h1 className="sectionHeading">Ratings & Feedback</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Average Rating */}
        <div className="bg-white shadow rounded-xl p-6 w-full lg:w-1/3 text-center">
          <h2 className="text-5xl font-bold text-yellow-500">
            {ratings.average}
          </h2>
          <div className="flex justify-center mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-7 h-7 ${
                  i < Math.round(ratings.average)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-gray-600">
            Based on {ratings.totalReviews} reviews
          </p>
        </div>

        {/* Right: Rating Distribution */}
        <div className="bg-white shadow rounded-xl p-6 w-full lg:w-2/3">
          {Object.keys(ratings.stars)
            .sort((a, b) => b - a)
            .map((star) => {
              const count = ratings.stars[star];
              const percentage =
                ratings.totalReviews > 0
                  ? (count / ratings.totalReviews) * 100
                  : 0;
              return (
                <div key={star} className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="font-semibold">{star}</span>
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  </div>

                  <div className="w-full bg-gray-200 h-3 rounded-lg overflow-hidden">
                    <div
                      style={{ width: `${percentage}%` }}
                      className="h-full bg-yellow-500 rounded-lg"
                    ></div>
                  </div>

                  <span className="text-sm text-gray-600 w-10">{count}</span>
                </div>
              );
            })}
        </div>
      </div>

      <div className="overflow-x-auto mt-10">
        <table className="w-full min-w-[600px] text-sm text-left border rounded-xl shadow">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Rating</th>
              <th className="px-6 py-3 font-semibold">Message</th>
              <th className="px-6 py-3 font-semibold">Date</th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((fb) => (
              <tr key={fb.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{fb.user?.name}</td>

                <td className="px-6 py-4 whitespace-nowrap flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < fb.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </td>

                <td className="px-6 py-4">{fb.review}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {(() => {
                    const date = new Date(fb.created_at);
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;
