// Hover tilt is CSS 3D: the pointer position sets --rx / --ry, and .tilt in index.css applies them.
function tilt(e) {
  if (e.pointerType !== 'mouse') return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  el.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`)
  el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`)
}

function reset(e) {
  e.currentTarget.style.setProperty('--rx', '0deg')
  e.currentTarget.style.setProperty('--ry', '0deg')
}

export default function ProjectCard({ project }) {
  const { title, kind, summary, points, stack, link } = project
  return (
    <article
      onPointerMove={tilt}
      onPointerLeave={reset}
      className="tilt flex h-full flex-col rounded-2xl border border-white/8 bg-surface p-6 hover:border-accent/50 sm:p-8"
    >
      <p className="text-sm font-medium text-muted">{kind}</p>
      <h3 className="mt-2 text-2xl font-bold tracking-tight">{title}</h3>
      <p className="mt-4 text-muted">{summary}</p>
      <ul className="mt-5 space-y-2 text-sm">
        {points.map((p) => (
          <li key={p} className="flex gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {p}
          </li>
        ))}
      </ul>
      <ul className="mt-auto flex flex-wrap gap-2 pt-8" aria-label="Tools">
        {stack.map((s) => (
          <li key={s} className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-muted">
            {s}
          </li>
        ))}
      </ul>
      {link && (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 self-start text-sm font-semibold text-accent hover:text-text"
        >
          {link.label} <span aria-hidden="true">↗</span>
        </a>
      )}
    </article>
  )
}
