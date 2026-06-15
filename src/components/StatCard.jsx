import { ArrowUpRight } from 'lucide-react';
import Card from './Card';

export default function StatCard({ label, value, delta, tone = 'neutral' }) {
  const glow = tone === 'red' ? 'text-red-400' : 'text-slate-300';
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">{value}</h3>
        </div>
        <div className={`flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-800 px-3 py-1 text-xs font-semibold ${glow}`}>
          <ArrowUpRight className="h-3.5 w-3.5" />
          {delta}
        </div>
      </div>
    </Card>
  );
}
