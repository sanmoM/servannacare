/**
 * Utility functions for event data formatting, image resolution,
 * and text processing.
 */

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "https://backend.cervannacare.com";

/**
 * Resolves full URL for an event or partner image from the API.
 * Supports relative backend paths or external URLs.
 */
export function getEventImageUrl(path, fallback = "") {
  if (!path) return fallback;
  if (typeof path !== "string") return fallback;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cleanBase = BACKEND_BASE_URL.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

/**
 * Strips HTML tags and decodes common HTML entities for previews
 */
export function stripHtml(html) {
  if (!html) return "";
  return String(html)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Generates clean text excerpt of requested length at word boundaries
 */
export function getExcerpt(html, maxLength = 160) {
  const plain = stripHtml(html);
  if (!plain) return "";
  if (plain.length <= maxLength) return plain;
  const trimmed = plain.substring(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(" ");
  return (lastSpace > 0 ? trimmed.substring(0, lastSpace) : trimmed) + "...";
}

/**
 * Sanitizes and cleans rich HTML content for safe, beautiful prose rendering.
 * Strips rigid inline styles (e.g. background-color: rgb(255,255,255))
 * so theme styles and contrast look crisp.
 */
export function cleanRichDescription(html) {
  if (!html) return "";
  return String(html)
    // Remove unwanted background and rigid black color from inline styles
    .replace(/style="[^"]*"/gi, (match) => {
      return match
        .replace(/background-color:\s*[^;"]+;?/gi, "")
        .replace(/color:\s*[^;"]+;?/gi, "");
    })
    // Remove empty <p><br></p> wrappers
    .replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, "")
    .trim();
}

/**
 * Formats an event date string into human friendly format
 */
export function formatEventDate(dateString, fallback = "") {
  if (!dateString) return fallback;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return String(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return String(dateString);
  }
}

/**
 * Detects edition badge category & color styling
 */
export function getEventEditionBadge(title = "") {
  const lower = title.toLowerCase();
  if (lower.includes("employer")) {
    return {
      label: "Employer Edition",
      badgeClass: "bg-purple-100 text-purple-900 border-purple-200",
      accentColor: "#72275B",
    };
  }
  if (lower.includes("house manager")) {
    return {
      label: "House Managers Edition",
      badgeClass: "bg-rose-100 text-rose-900 border-rose-200",
      accentColor: "#9b1c5c",
    };
  }
  return {
    label: "TFB Movement",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-200",
    accentColor: "#72275B",
  };
}

/**
 * Extracts key session topics and takeaways for display pills
 */
export function extractHighlights(event) {
  if (event?.highlights && event.highlights.length > 0) {
    return event.highlights;
  }
  const desc = stripHtml(event?.description || "");
  const list = [];

  if (desc.includes("Nutrition") || desc.includes("Nthenya")) {
    list.push({ icon: "🥗", title: "Child Nutrition & Wellbeing", speaker: "Nthenya" });
  }
  if (desc.includes("First Aid") || desc.includes("Jacaranda")) {
    list.push({ icon: "🩺", title: "First Aid & Emergency Care", speaker: "Jacaranda" });
  }
  if (desc.includes("Autistic") || desc.includes("Dr. Alice")) {
    list.push({ icon: "🧩", title: "Autism Support Caregiving", speaker: "Dr. Alice" });
  }
  if (desc.includes("Financial") || desc.includes("Kingdom Bank")) {
    list.push({ icon: "💰", title: "Financial Literacy", speaker: "Kingdom Bank & DPAK" });
  }
  if (desc.includes("Parenting") || desc.includes("Grace")) {
    list.push({ icon: "💛", title: "Emotional Support for Mothers", speaker: "Grace" });
  }
  if (desc.includes("Relationships") || desc.includes("Cate")) {
    list.push({ icon: "👥", title: "Manager-Employer Harmony", speaker: "Cate" });
  }

  return list.length > 0
    ? list
    : [
        { icon: "✨", title: "Caregiver Empowerment", speaker: "TFB" },
        { icon: "🤝", title: "Community & Dignity", speaker: "Servanna" },
      ];
}

/**
 * Creates clean URL friendly slug from title
 */
export function createEventSlug(title = "") {
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
