"use client"

import { useSearchParams } from "next/navigation";
import React from "react";

const Profile = () => {
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const id = searchParams.get("id");

  return <div>
         {category}
         {id}
  </div>;
};

export default Profile;
