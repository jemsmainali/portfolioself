import Section from './Section.jsx'
import { about } from '../data/portfolio.js'

export default function About() {
  return (
    <Section id="about" label="About" title="I work across the whole stack.">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <div className="max-w-xl space-y-5 text-lg text-muted">
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <dl className="space-y-5 md:max-w-xs">
          {about.facts.map((f) => (
            <div key={f.label} className="border-t border-white/10 pt-4">
              <dt className="text-sm text-muted">{f.label}</dt>
              <dd className="mt-1 font-semibold">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
