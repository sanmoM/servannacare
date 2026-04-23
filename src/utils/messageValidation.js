export const containsRestrictedInfo = (message) => {
  if (!message) return false;


  const phoneRegex = /(\+?\d{1,4}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/;
  

  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;


  const socialRegex = /(facebook|twitter|instagram|tiktok|fb|ig|tw|tk|fb\.com|instagram\.com|twitter\.com|tiktok\.com)/i;

  const addressRegex = /\d+\s+([A-Za-z0-9\s]+)\s+(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Boulevard|Blvd|Way|Plaza|Sq|Square|Terrace|Ter)/i;

  return (
    phoneRegex.test(message) ||
    emailRegex.test(message) ||
    socialRegex.test(message) ||
    addressRegex.test(message)
  );
};

export const getRestrictedInfoType = (message) => {
  const phoneRegex = /(\+?\d{1,4}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const socialRegex = /(facebook|twitter|instagram|tiktok|fb|ig|tw|tk|fb\.com|instagram\.com|twitter\.com|tiktok\.com)/i;
  const addressRegex = /\d+\s+([A-Za-z0-9\s]+)\s+(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Boulevard|Blvd|Way|Plaza|Sq|Square|Terrace|Ter)/i;

  if (phoneRegex.test(message)) return "phone number";
  if (emailRegex.test(message)) return "email address";
  if (socialRegex.test(message)) return "social media link";
  if (addressRegex.test(message)) return "home address";
  return "restricted information";
};
