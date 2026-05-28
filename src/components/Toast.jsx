import { createContext, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const pushToast = (message, type = 'success') => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const value = useMemo(() => ({ pushToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[60] space-y-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex w-[320px] items-start gap-3 rounded-2xl border border-white/10 bg-[#121212] p-4 shadow-glow"
            >
              <div className={`rounded-full p-2 ${toast.type === 'success' ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-zinc-300'}`}>
                {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <Info className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{toast.message}</p>
                <p className="mt-1 text-xs text-zinc-500">Premium portal notification</p>
              </div>
              <button
                type="button"
                onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                className="text-zinc-500 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside a ToastProvider');
  }
  return context;
}
