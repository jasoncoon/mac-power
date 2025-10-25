import type { ReactNode } from "react";

export interface Item {
  key?: string;
  label?: ReactNode;
  value: ReactNode;
}

export default function Descriptions({ title, items }: { title: string, items: Item[] }) {
  return (
    <table style={{ borderSpacing: '.5rem' }}>
      <thead>
        <tr>
          <th colSpan={2}>{title}</th>
        </tr>
      </thead>
      <tbody>
        {items.map(({ key, label, value }, index) => {
          const keyOrLabel = key ? key : typeof label === 'string' ? label : index;
          return (
            <tr key={keyOrLabel}>
              <th style={{ textAlign: 'right' }}>{label}</th>
              <td >{value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}