import { motion } from 'motion/react'
import { profile } from '../data/portfolio.js'
import StaticStack from './StaticStack.jsx'

// The one load sequence on the page: hero lines fade up one after another.
const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } },
}

export default function Hero({ show3DFallback }) {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="mx-auto grid min-h-svh max-w-6xl items-center gap-12 px-5 pt-28 pb-16 sm:px-8 md:grid-cols-[1.15fr_1fr]"
    >
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.p variants={item} className="flex items-center gap-2 text-sm font-medium text-muted">
          <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
          {profile.location} · {profile.status}
        </motion.p>
        <motion.h1
          variants={item}
          id="hero-title"
          className="mt-6 text-[clamp(3rem,9vw,6.5rem)] leading-[0.95] font-extrabold tracking-[-0.035em]"
        >
          {profile.name}
        </motion.h1>
        <motion.p variants={item} className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
          {profile.tagline}
        </motion.p>
        <motion.div variants={item} className="mt-10 flex flex-wrap gap-3">
          <a href="#work" className="rounded-full bg-accent px-6 py-3 font-semibold text-bg hover:bg-text">
            See my work
          </a>
          <a href="#contact" className="rounded-full border border-white/15 px-6 py-3 font-semibold hover:border-accent">
            Get in touch
          </a>
        </motion.div>
      </motion.div>
      <div>{show3DFallback && <StaticStack />}</div>
    </section>
  )
}
