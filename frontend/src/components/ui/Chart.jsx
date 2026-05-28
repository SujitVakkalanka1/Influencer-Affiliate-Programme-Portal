export default function Chart({ data }) {
  const max = Math.max(...data.map((item) => item.clicks));
  return (
    <div className="h-72 rounded-2xl border border-white/[0.08] bg-black/30 p-5">
      <div className="flex h-full items-end gap-3">
        {data.map((item) => (
          <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-3">
            <div className="relative flex h-full items-end overflow-hidden rounded-full bg-white/[0.04]">
              <div className="w-full rounded-full bg-gradient-to-t from-ember-700 via-ember-500 to-white/80 shadow-glow transition-all duration-700 hover:from-ember-600" style={{ height: `${(item.clicks / max) * 100}%` }} />
              <div className="absolute bottom-0 left-1/2 w-1/3 -translate-x-1/2 rounded-full bg-white/75" style={{ height: `${(item.conversions / max) * 100}%` }} />
            </div>
            <span className="text-center text-xs text-white/45">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
