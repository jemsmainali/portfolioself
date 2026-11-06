export default function Section({ id, label, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <p className="text-sm font-semibold tracking-[0.16em] text-accent uppercase">{label}</p>
      <h2 id={`${id}-title`} className="mt-3 mb-12 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h2>
      {children}
    </section>
  )
}
