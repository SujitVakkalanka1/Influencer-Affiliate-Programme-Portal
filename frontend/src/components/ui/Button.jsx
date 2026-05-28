import { motion } from "framer-motion";
const variants = { primary: "bg-ember-500 text-white shadow-glow hover:bg-ember-600", secondary: "border border-white/10 bg-white/5 text-white hover:border-ember-500/70 hover:bg-ember-500/10", ghost: "text-white/70 hover:bg-white/5 hover:text-white" };
export default function Button({ children, variant = "primary", className = "", ...props }) {
  return <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`} {...props}>{children}</motion.button>;
}
