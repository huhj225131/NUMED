export default function Card({ children, className = '' }) {
  return (
    <article
      className={`rounded-2xl border border-slate-700/70 bg-slate-900/60 p-5 shadow-lg shadow-slate-950/30 ${className}`.trim()}
    >
      {children}
    </article>
  )
}
