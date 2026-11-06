import Section from './Section.jsx'
import Reveal from './Reveal.jsx'
import { experience } from '../data/portfolio.js'

export default function Experience() {
  return (
    <Section id="experience" label="Experience" title="Where I've worked and studied">
      <ol className="border-b border-white/10">
        {experience.map((e) => (
          <Reveal
            as="li"
            key={e.role}
            className="grid gap-2 border-t border-white/10 py-8 md:grid-cols-[180px_1fr_1fr] md:gap-8"
          >
            <p className="text-sm font-medium text-muted tabular-nums">{e.period}</p>
            <div>
              <h3 className="text-xl font-bold tracking-tight">{e.role}</h3>
              <p className="mt-1 text-muted">{e.org}</p>
            </div>
            {e.points.length > 0 && (
              <ul className="space-y-1 text-sm text-muted">
                {e.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
