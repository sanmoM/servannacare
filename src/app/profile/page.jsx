import { Suspense } from "react";

import LoadingSpinner from "@/components/shared/LoadingSpin";
import ProfilePageContent from "./ProfilePageContent";


export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProfilePageContent />
    </Suspense>
  );
}
