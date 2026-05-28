import { Menu, Search } from 'lucide-react';
import Logo from './Logo';

export default function Topbar({ title, subtitle, onMenuClick }) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/10 bg-black/30 px-5 py-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:px-8">
      <div className="flex items-center justify-between gap-3 xl:hidden">
        <Logo />
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-2xl border border-white/10 bg-white/5 p-3 text-zinc-200 transition hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <div>
        <p className="section-label">{subtitle}</p>
        <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{title}</h1>
      </div>
      <div className="flex flex-1 items-center gap-3 md:justify-end">
        <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-zinc-400 md:w-auto md:min-w-96">
          <Search className="h-4 w-4" />
          <input
            className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            placeholder="Search campaigns, creators, or payouts"
          />
        </div>
      </div>
    </header>
  );
}
