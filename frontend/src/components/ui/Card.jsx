import { motion } from "framer-motion";
export default function Card({ children, className = "" }) {
  return <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className={`rounded-2xl border border-white/[0.08] bg-ink-850/90 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.28)] ${className}`}>{children}</motion.div>;
}
