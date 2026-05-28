export default function Table({ columns, rows, renderRow }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <table className="min-w-full divide-y divide-white/6 text-left text-sm">
        <thead className="bg-white/[0.02] text-xs uppercase tracking-[0.28em] text-zinc-500">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-5 py-4 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/6 text-zinc-300">{rows.map((row) => renderRow(row))}</tbody>
      </table>
    </div>
  );
}
