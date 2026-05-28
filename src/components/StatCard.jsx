import { ArrowUpRight } from 'lucide-react';
import Card from './Card';

export default function StatCard({ label, value, delta, tone = 'neutral' }) {
  const glow = tone === 'red' ? 'text-red-400' : 'text-zinc-300';
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">{label}</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">{value}</h3>
        </div>
        <div className={`flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold ${glow}`}>
          <ArrowUpRight className="h-3.5 w-3.5" />
          {delta}
        </div>
      </div>
    </Card>
  );
}
