"use client"

import LoadingSpinner from "@/components/shared/LoadingSpin";
import useLocalUser from "@/hooks/useLocalUser";

export default function DashboardPage() {
  const {user,loaded} = useLocalUser()
  if(!loaded){
    <LoadingSpinner/>
  }
  return (
    <div>
      <h1 className="sectionHeading">Hi <span className="text-primary">{user?.name || user?.email}!</span></h1>
      <p className="mt-2 text-gray-600">Welcome to your dashboard!</p>
    </div>
  );
}
