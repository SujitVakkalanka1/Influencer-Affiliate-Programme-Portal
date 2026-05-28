import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button.jsx";
export default function Modal({ open, title, children, onClose }) {
  return (
    <AnimatePresence>
      {open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
        <motion.div initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }} className="glass w-full max-w-md rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between"><h3 className="text-lg font-bold">{title}</h3><button className="rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white" onClick={onClose}><X className="h-5 w-5" /></button></div>
          {children}<Button className="mt-6 w-full" onClick={onClose}>Done</Button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  );
}
