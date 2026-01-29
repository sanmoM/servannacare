import { Suspense } from "react";
import BookingFormClient from "./BookingFormClient";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading booking form...</div>}>
      <BookingFormClient />
    </Suspense>
  );
}
