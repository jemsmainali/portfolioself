import Section from './Section.jsx'
import Reveal from './Reveal.jsx'
import ProjectCard from './ProjectCard.jsx'
import { projects, moreRepos } from '../data/portfolio.js'

export default function Work() {
  return (
    <Section id="work" label="Work" title="Selected projects">
      <ul className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal as="li" key={p.title} delay={(i % 2) * 0.08}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </ul>
      <Reveal className="mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
        <span className="text-muted">More on GitHub:</span>
        {moreRepos.map((r) => (
          <a key={r.href} href={r.href} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-accent">
            {r.label}
          </a>
        ))}
      </Reveal>
    </Section>
  )
}
