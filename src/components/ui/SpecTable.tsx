interface SpecItem {
  label: string;
  value: string;
}

interface SpecTableProps {
  specs: SpecItem[];
  label?: string;
}

export function SpecTable({ specs, label }: SpecTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant">
      <table className="w-full font-data-mono text-data-mono" aria-label={label}>
        <tbody>
          {specs.length === 0 ? (
            <tr>
              <td colSpan={2} className="py-6 px-5 text-center font-body-sm text-body-sm text-on-surface-variant">
                No specifications available.
              </td>
            </tr>
          ) : (
            specs.map((spec, i) => (
              <tr key={spec.label} className={`border-b border-surface-container-highest last:border-b-0 ${i % 2 === 0 ? "bg-surface" : "bg-surface-container-low/50"}`}>
                <th scope="row" className="text-on-surface-variant uppercase tracking-wider py-3.5 px-5 text-start font-data-mono text-[11px] font-normal w-[40%] align-top">
                  {spec.label}
                </th>
                <td className="text-on-background font-medium py-3.5 px-5 text-end text-[13px] break-words">
                  {spec.value}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
