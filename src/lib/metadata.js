const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPageMetadata(endpoint) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      next: {
        revalidate: 60,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch metadata");
    }

    const response = await res.json();

    const metadata = response?.data?.metadata;

    return {
      title: metadata?.title ,
      description: metadata?.description || "",
      keywords: metadata?.keywords || [],
    };
  } catch (error) {
    return {
      title: "",
      description: "",
      keywords: [],
    };
  }
}
