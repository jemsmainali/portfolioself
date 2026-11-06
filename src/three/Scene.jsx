import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import Stack from './Stack.jsx'
import { scroll, pointer } from './input.js'

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// One fixed canvas behind the page. It fades out before the Work section,
// and stops rendering (frameloop "never") once it is invisible or the tab is hidden.
export default function Scene() {
  const fadeRef = useRef(null)
  const [active, setActive] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const work = document.getElementById('work')
    const update = () => {
      // p reaches 1 when the Work section is 40% up the screen.
      const end = Math.max(1, work.offsetTop - window.innerHeight * 0.6)
      scroll.p = Math.min(1, Math.max(0, window.scrollY / end))
      const opacity = 1 - smoothstep(0.7, 1, scroll.p)
      if (fadeRef.current) fadeRef.current.style.opacity = opacity.toFixed(3)
      setActive(opacity > 0.001 && !document.hidden)
    }
    const move = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('visibilitychange', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <div ref={fadeRef} className="h-full w-full">
        <Canvas
          dpr={[1, 1.5]}
          frameloop={active ? 'always' : 'never'}
          camera={{ position: [0, 0.8, 7.5], fov: 35 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={() => setReady(true)}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 5, 4]} intensity={1.2} />
          {/* Reflections come from code-built light panels, no downloaded HDR file. */}
          <Environment resolution={128} frames={1}>
            <Lightformer intensity={2} position={[0, 5, -4]} scale={[10, 4, 1]} />
            <Lightformer intensity={1.5} color="#5B8CFF" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[10, 3, 1]} />
            <Lightformer intensity={1} position={[5, 1, 2]} rotation-y={-Math.PI / 2} scale={[10, 3, 1]} />
          </Environment>
          <Stack />
        </Canvas>
      </div>
    </div>
  )
}
