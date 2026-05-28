import { motion } from 'framer-motion';
import Logo from './Logo';

export default function AuthShell({ eyebrow, title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(229,9,20,0.18),transparent_25%),linear-gradient(180deg,#070707_0%,#0a0a0a_100%)] px-4 py-8 text-white md:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden h-full rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-8 lg:flex lg:flex-col"
        >
          <Logo />
          <div className="mt-auto max-w-xl pb-8">
            <p className="section-label">{eyebrow}</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-white">{title}</h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-zinc-400">{subtitle}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {['Premium', 'Minimal', 'Creator-first'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300">
                {item}
              </div>
            ))}
          </div>
        </motion.section>
        <section className="mx-auto w-full max-w-lg">{children}</section>
      </div>
    </main>
  );
}
