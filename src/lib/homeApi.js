import axiosPublic from "@/lib/axiosPublic";

export const getHomeData = async () => {
  const res = await axiosPublic.get("/api/home");
  return res.data;
};
