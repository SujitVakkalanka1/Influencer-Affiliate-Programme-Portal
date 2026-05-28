export default function Table({ columns, rows, renderRow }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-850/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase text-white/40"><tr>{columns.map((column) => <th key={column} className="px-5 py-4 font-semibold">{column}</th>)}</tr></thead>
          <tbody className="divide-y divide-white/[0.06]">{rows.map((row, index) => renderRow(row, index))}</tbody>
        </table>
      </div>
    </div>
  );
}
