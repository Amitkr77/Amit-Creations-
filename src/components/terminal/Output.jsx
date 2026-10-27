// Small text primitives for terminal output

export const Hl = ({ children }) => <span className="text-accent-soft">{children}</span>;
export const Dim = ({ children }) => <span className="text-white/40">{children}</span>;
export const Ext = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer" className="text-accent-soft underline underline-offset-2">
    {children}
  </a>
);

export function Rows({ rows }) {
  return (
    <div className="grid grid-cols-[minmax(7rem,auto)_1fr] gap-x-4 gap-y-0.5">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <Hl>{k}</Hl>
          <span className="text-white/60">{v}</span>
        </div>
      ))}
    </div>
  );
}
