"use client";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { useFetch } from "@/hooks/useFetch";
import { postApi } from "@/lib/apiHandler";
import { Star, Send, CheckCircle2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SpecialistFeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, error, refetch } = useFetch("/specialist-feedback");

  const existingFeedback = data?.data?.data;
  const hasReviewed =
    Array.isArray(existingFeedback) && existingFeedback.length > 0;

  const feedback = hasReviewed ? existingFeedback[0] : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a rating");
    if (!message.trim()) return toast.error("Please enter a message");

    setIsSubmitting(true);
    try {
      const response = await postApi("/feedback", { rating, message });
      if (response?.status === 200) {
        toast.success("Feedback submitted successfully!");
        refetch();
      } else {
        toast.error("Failed to submit feedback");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mx-auto py-12 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Feedback</h1>
        <p className="text-gray-500 mt-2">
          Share your experience with us regarding your recent service.
        </p>
      </div>

      {!hasReviewed ? (
        <div className="bg-white shadow-xl border border-gray-100 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              <label className="block text-lg font-medium text-gray-700 mb-4">
                How would you rate the service?
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform active:scale-90"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        (hover || rating) >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                rows={4}
                className="w-full p-4 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Tell us what you liked or what we can improve..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-primary text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400 cursor-pointer"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-5 h-5" /> Submit Feedback
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-primary/20 border border-primary/30 rounded-lg p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Thank you!</h2>
          <p className="text-gray-600 mt-2">
            You have already submitted your feedback for this specialist.
          </p>

          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm text-left border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Your Review
              </span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < feedback.rating
                        ? "fill-yellow-400 text-yellow-400 cursor-pointer"
                        : "text-gray-200 cursor-pointer"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-800 italic">"{feedback.message}"</p>
            <div className="mt-4 pt-4 border-t text-xs text-gray-400">
              Submitted on:{" "}
              {(() => {
                const date = new Date(feedback?.created_at);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = String(date.getFullYear()).slice(-2);
                return `${day}-${month}-${year}`;
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SpecialistFeedbackPage;
