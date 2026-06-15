export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white">
        IA
      </div>
      <div>
        <p className="font-heading text-base font-bold text-white">Influencer Affiliate</p>
        <p className="text-xs text-slate-400">Programme Portal</p>
      </div>
    </div>
  );
}
