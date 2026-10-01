import HomeClient from "@/components/shared/HomeClient";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_URL}/home`, {
      next: {
        revalidate: 60,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch home metadata");
    }

    const response = await res.json();

    const metadata = response?.data?.metadata;

    return {
      title: metadata?.title || "Home",
      description: metadata?.description || "",
      keywords: metadata?.keywords || [],
    };
  } catch (error) {
    return {
      title: "Home",
      description: "",
    };
  }
}

export default function Home() {
  return <HomeClient />;
}