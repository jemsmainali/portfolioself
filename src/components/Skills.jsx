import Section from './Section.jsx'
import { skills } from '../data/portfolio.js'

export default function Skills() {
  return (
    <Section id="skills" label="Skills" title="Tools I've used in these projects">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((s) => (
          <div key={s.group} className="rounded-2xl border border-white/8 bg-surface p-6">
            <h3 className="text-sm font-semibold tracking-[0.14em] text-accent uppercase">{s.group}</h3>
            <ul className="mt-4 space-y-2 font-medium">
              {s.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
