export const KenyaPhoneInput = ({ value, onChange }) => {
  const handleKenyaPhone = (e) => {
    let digits = e.target.value.replace(/\D/g, ""); // only digits
    if (digits.length > 9) digits = digits.slice(0, 9); // 9 digits after 254

    // must start with 7 or 1
    if (digits.length >= 1 && digits[0] !== "7" && digits[0] !== "1") {
      digits = ""; // reject invalid first digit
    }

    onChange(digits);
  };

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Phone Number
      </label>

      <div className="flex items-center border rounded-md overflow-hidden bg-white">
        <span className="px-3 text-gray-600 bg-gray-100 border-r select-none">
          +254
        </span>

        <input
          type="tel"
          value={value}
          onChange={handleKenyaPhone}
          placeholder="7XXXXXXXX or 1XXXXXXXX"
          className="w-full px-3 py-3 outline-none"
        />
      </div>
    </div>
  );
};
