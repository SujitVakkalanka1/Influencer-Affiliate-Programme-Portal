export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10 text-red-500 shadow-[0_0_30px_rgba(229,9,20,0.2)]">
        <span className="font-semibold">I</span>
      </div>
      <div>
        <p className="font-heading text-lg font-bold uppercase tracking-[0.28em] text-white">Influence</p>
        <p className="-mt-0.5 text-[10px] uppercase tracking-[0.45em] text-zinc-500">Affiliate Portal</p>
      </div>
    </div>
  );
}
