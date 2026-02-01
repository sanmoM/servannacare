import { Suspense } from "react";
import BookingFormClient from "./BookingFormClient";
import LoadingSpinner from "@/components/shared/LoadingSpin";

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BookingFormClient />
    </Suspense>
  );
}
