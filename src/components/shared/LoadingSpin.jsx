// export default function LoadingSpinner() {
//   return (
//     <div className="flex justify-center items-center min-h-[calc(100vh-96px)]">
//       <p className="text-7xl font-thin">L</p>
//       <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin mt-5 border-bg-primary"></div>
//       <p className="text-7xl font-thin">ading....</p>
//     </div>
//   );
// }


"use client";
import { motion } from "framer-motion";

export default function LoadingSpinner() {
  const brandColor = "#72275b";

  const grid = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="grid grid-cols-3 gap-2 w-24 h-24">
        {grid.map((i) => (
          <motion.div
            key={i}
            style={{ backgroundColor: brandColor }}
            className="w-full h-full rounded-sm shadow-sm"
            animate={{
              scale: [1, 0, 1],
              rotate: [0, 90, 0],
              borderRadius: ["10%", "50%", "10%"],
              opacity: [1, 0.3, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              
              delay: (i % 3) * 0.2 + Math.floor(i / 3) * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}