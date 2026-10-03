const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const SPECIALIST_PAGES = ["nurse-aide-or-assistant", "special-need-caregivers", "home-health-assistant", "house-manager", "physiotherapist", "nurse"];

export const CATEGORY_ALIASES = {
  home_health_assistant: "home-health-assistant",
  "special-need-caregiver": "special-need-caregivers",
  special_need_caregivers: "special-need-caregivers",
  special_need: "special-need-caregivers",
  nurse_assistant: "nurse-aide-or-assistant",
  "nurse-aide": "nurse-aide-or-assistant",
  house_manager: "house-manager",
};

export function extractSpecialistCategory(urlOrParams) {
  if (!urlOrParams) return "specialist";

  if (typeof urlOrParams === "object") {
    const rawVal = urlOrParams.category || urlOrParams.page || urlOrParams.subRole || urlOrParams.slug;
    if (rawVal && typeof rawVal === "string") {
      const clean = rawVal.toLowerCase().trim();
      return CATEGORY_ALIASES[clean] || SPECIALIST_PAGES.find((p) => p === clean) || clean;
    }
    return "specialist";
  }

  if (typeof urlOrParams === "string") {
    const cleanStr = urlOrParams.toLowerCase().trim();

    if (cleanStr.includes("?")) {
      try {
        const urlObj = new URL(cleanStr, "http://localhost");
        // const urlObj = new URL(cleanStr, "http://cervannacare.com");
        const queryCat = urlObj.searchParams.get("category");
        if (queryCat) {
          const cleanCat = queryCat.toLowerCase().trim();
          return CATEGORY_ALIASES[cleanCat] || SPECIALIST_PAGES.find((p) => p === cleanCat) || cleanCat;
        }
      } catch {
        const match = cleanStr.match(/category=([^&]+)/);
        if (match && match[1]) {
          const cleanCat = decodeURIComponent(match[1]).toLowerCase().trim();
          return CATEGORY_ALIASES[cleanCat] || SPECIALIST_PAGES.find((p) => p === cleanCat) || cleanCat;
        }
      }
    }

    for (const [alias, canonical] of Object.entries(CATEGORY_ALIASES)) {
      if (cleanStr.includes(alias)) {
        return canonical;
      }
    }

    for (const pageKey of SPECIALIST_PAGES) {
      if (
        cleanStr === pageKey ||
        cleanStr.endsWith(`/${pageKey}`) ||
        cleanStr.includes(`/${pageKey}/`) ||
        cleanStr.includes(`/${pageKey}?`) ||
        cleanStr.includes(`category=${pageKey}`)
      ) {
        return pageKey;
      }
    }

    if (cleanStr.includes("specialist")) {
      return "specialist";
    }
  }

  return "specialist";
}

export async function getPageMetadata(endpoint, urlOrParams = null) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      next: {
        revalidate: 60,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch metadata for ${endpoint}`);
    }

    const response = await res.json();

    const metadataList = Array.isArray(response?.metadata) ? response.metadata : Array.isArray(response?.data?.metadata) ? response.data.metadata : null;

    if (metadataList && metadataList.length > 0) {
      const targetCategory = extractSpecialistCategory(urlOrParams);

      const matched =
        metadataList.find((item) => item.page?.toLowerCase() === targetCategory.toLowerCase()) ||
        metadataList.find((item) => item.page?.toLowerCase() === "specialist") ||
        metadataList[0];

      return {
        title: matched?.title || "",
        description: matched?.description || "",
        keywords: matched?.keywords || [],
      };
    }

    const metadata = response?.data?.metadata || response?.metadata;

    return {
      title: metadata?.title || "",
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
