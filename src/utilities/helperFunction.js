// utilities/helper.js

export const numericInputFilter = (value, maxLength = null) => {
  let cleaned = value.replace(/\D/g, "");

  if (maxLength) cleaned = cleaned.slice(0, maxLength);

  return cleaned;
};

export const blockInvalidKeys = (e) => {
  const invalid = ["e", "E", "+", "-", ".", ","];

  if (invalid.includes(e.key)) {
    e.preventDefault();
  }
};

export const generateToken = () => {
  return (
    "token_" +
    Math.random().toString(36).substring(2) +
    Date.now().toString(36)
  );
};
