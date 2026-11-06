import { useRef, useState } from 'react'
import { profile } from '../data/portfolio.js'

export default function CopyEmail() {
  const [msg, setMsg] = useState('')
  const emailRef = useRef(null)
  const timer = useRef()

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setMsg('Copied')
    } catch {
      // Clipboard blocked: select the address so it can be copied by hand.
      const range = document.createRange()
      range.selectNodeContents(emailRef.current)
      window.getSelection().removeAllRanges()
      window.getSelection().addRange(range)
      setMsg('Selected. Press Ctrl+C to copy.')
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMsg(''), 2500)
  }

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <a
        ref={emailRef}
        href={`mailto:${profile.email}`}
        className="text-[clamp(1.3rem,5vw,2.5rem)] font-bold tracking-tight break-all hover:text-accent"
      >
        {profile.email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold hover:border-accent"
      >
        Copy email
      </button>
      <span role="status" aria-live="polite" className="text-sm text-muted">
        {msg}
      </span>
    </div>
  )
}
