import { useState } from 'react'
import { profile } from '../data/portfolio.js'

const field =
  'w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-text focus:border-accent focus-visible:outline-2 focus-visible:outline-accent'

export default function ContactForm({ endpoint }) {
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    if (form.elements._gotcha.value) return // a bot filled the hidden field: send nothing
    setStatus('sending')
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(`The server replied with an error (${res.status}).`)
      form.reset()
      setStatus('success') // only after a 2xx response
    } catch (err) {
      setError(
        err.name === 'AbortError'
          ? 'The request timed out.'
          : err instanceof TypeError
            ? 'I could not reach the server.'
            : err.message,
      )
      setStatus('error')
    } finally {
      clearTimeout(timeout)
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative mt-12 grid max-w-2xl gap-5 sm:grid-cols-2">
      <label className="grid gap-2 text-sm font-medium">
        Name
        <input name="name" autoComplete="name" required className={field} />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Email
        <input name="email" type="email" autoComplete="email" required className={field} />
      </label>
      <label className="grid gap-2 text-sm font-medium sm:col-span-2">
        Message
        <textarea name="message" rows={5} required className={field} />
      </label>
      <input name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px" />
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-full bg-accent px-6 py-3 font-semibold text-bg hover:bg-text disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {status === 'success' && 'Thanks, your message was sent. I will reply by email.'}
          {status === 'error' && (
            <span className="text-[#ff9aa8]">
              {error} Your message was not sent. Please email me at {profile.email}.
            </span>
          )}
        </p>
      </div>
    </form>
  )
}
