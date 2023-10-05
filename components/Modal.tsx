import { motion } from "framer-motion";
// pesan buat bang bani:
//   mending pakai context g sih? nanti biar state Modal di simpen secara global
//   jadi nanti kita tinggal panggil function di client component
//   untuk nampilin modal. nah trus ada callback or something gitu.
export default function Modal({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ ease: "easeInOut" }}
      className={`z-20 rounded-lg shadow-md flex flex-col p-6 gap-2 bg-white max-w-lg ${className}`}
    >
      {children}
    </motion.div>
  );
}
