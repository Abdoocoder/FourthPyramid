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
    <div className="font-data-mono text-data-mono overflow-x-auto">
      <table className="w-full" aria-label={label}>
        <tbody>
          {specs.map((spec, i) => (
            <tr key={spec.label} className={`border-b border-surface-container-highest ${i % 2 === 0 ? "" : "bg-surface-container-low/50"}`}>
              <th scope="row" className="text-on-surface-variant uppercase tracking-wider py-3 pe-4 text-start font-data-mono text-data-mono font-normal w-1/2 align-top">{spec.label}</th>
              <td className="text-on-background font-medium text-end py-3 w-1/2 break-words">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
