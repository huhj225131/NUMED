export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyle = 'inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300'

  const variantStyle =
    variant === 'ghost'
      ? 'border border-slate-500/60 bg-slate-900/40 text-slate-100 hover:border-teal-400 hover:bg-slate-800/70'
      : 'bg-teal-400 text-slate-950 hover:bg-teal-300'

  return (
    <button type={type} className={`${baseStyle} ${variantStyle} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}
