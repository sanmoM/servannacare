import LoadingSpinner from "@/components/shared/LoadingSpin";
import { Suspense } from "react";
import EmployerBookingFormClient from "./EmployerBookingFormClient";

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EmployerBookingFormClient />
    </Suspense>
  );
}
