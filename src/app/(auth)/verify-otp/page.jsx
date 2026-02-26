import LoadingSpinner from "@/components/shared/LoadingSpin";
import { Suspense } from "react";
import VerifyOtpPage from "./verifOtp";

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VerifyOtpPage />
    </Suspense>
  );
}
