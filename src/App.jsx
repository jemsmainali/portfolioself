import { lazy, Suspense, useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Work from './components/Work.jsx'
import Experience from './components/Experience.jsx'
import Skills from './components/Skills.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

// The 3D scene (three + R3F + drei) is split into its own chunk.
const Scene = lazy(() => import('./three/Scene.jsx'))

// 3D only on larger screens with a fine pointer, no reduced motion, and working WebGL.
function canUse3D() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (!window.matchMedia('(min-width: 768px) and (pointer: fine)').matches) return false
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function App() {
  const [use3D] = useState(canUse3D)
  const [mountScene, setMountScene] = useState(false)

  // Wait until the browser is idle so the text paints before the 3D chunk loads.
  useEffect(() => {
    if (!use3D) return
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 300))
    const cancel = window.cancelIdleCallback || clearTimeout
    const id = idle(() => setMountScene(true), { timeout: 1500 })
    return () => cancel(id)
  }, [use3D])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="fixed top-3 left-3 z-50 -translate-y-24 rounded-md bg-accent px-4 py-2 font-semibold text-bg focus:translate-y-0"
      >
        Skip to content
      </a>
      {mountScene && (
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      )}
      <Nav />
      <main id="main" className="relative z-10">
        <Hero show3DFallback={!use3D} />
        <About />
        <Work />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}
