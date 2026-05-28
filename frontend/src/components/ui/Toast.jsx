import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
export default function Toast({ message }) {
  return <AnimatePresence>{message && <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-ember-500/30 bg-ink-900 px-5 py-3 text-sm text-white shadow-glow"><CheckCircle2 className="h-4 w-4 text-ember-500" />{message}</motion.div>}</AnimatePresence>;
}
