import { motion } from 'motion/react'

// Small fade-up when an element first scrolls into view. Used on Work and Experience only.
export default function Reveal({ children, delay = 0, as = 'div', className }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </Tag>
  )
}
