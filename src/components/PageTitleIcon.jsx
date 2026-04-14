export default function PageTitleIcon({ icon, variant, label }) {
  return (
    <span
      className={`page-title-icon page-title-icon-${variant}`}
      aria-hidden="true"
      title={label}
    >
      <span className="page-title-icon-glyph">{icon}</span>
    </span>
  )
}
