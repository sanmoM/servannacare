import { Suspense } from "react";

import LoadingSpinner from "@/components/shared/LoadingSpin";
import LoginPageContent from "./LoginPageContent";

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginPageContent />
    </Suspense>
  );
}
