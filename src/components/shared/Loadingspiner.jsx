export default function LoadingSpinnerSecond() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-96px)]">
      {/* <p className="text-7xl font-thin">L</p> */}
      <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin mt-5 border-[#72275b]"></div>
      {/* <p className="text-7xl font-thin">ading....</p> */}
    </div>
  );
}