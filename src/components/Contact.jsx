import Section from './Section.jsx'
import CopyEmail from './CopyEmail.jsx'
import ContactForm from './ContactForm.jsx'

const endpoint = import.meta.env.VITE_FORM_ENDPOINT || ''

export default function Contact() {
  return (
    <Section id="contact" label="Contact" title="Let's talk">
      <p className="mb-8 max-w-xl text-lg text-muted">
        I'm open to junior developer roles.{' '}
        {endpoint ? 'Email me or use the form below.' : 'Email is the quickest way to reach me.'}
      </p>
      <CopyEmail />
      {endpoint && <ContactForm endpoint={endpoint} />}
    </Section>
  )
}
