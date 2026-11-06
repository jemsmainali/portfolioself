import { useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Edges, Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { scroll, pointer } from './input.js'
import { stackLayers } from '../data/portfolio.js'

const PACKETS = 6
const damp = THREE.MathUtils.damp

export default function Stack() {
  const group = useRef()
  const slabs = useRef([])
  const packets = useRef([])
  const s = useRef({ p: 0, x: 0, y: 0 }) // smoothed scroll and pointer
  const { camera, size } = useThree()

  // Shift the rendered image to the right so the stack sits beside the hero text.
  // The camera still orbits the origin, which keeps the scroll maths simple.
  useLayoutEffect(() => {
    const shift = size.width >= 1024 ? 0.25 : 0.16
    camera.setViewOffset(size.width, size.height, -size.width * shift, 0, size.width, size.height)
    return () => camera.clearViewOffset()
  }, [camera, size])

  useFrame((state, dt) => {
    const v = s.current
    v.p = damp(v.p, scroll.p, 4, dt)
    v.x = damp(v.x, pointer.x, 3, dt)
    v.y = damp(v.y, pointer.y, 3, dt)

    // 1. Slabs separate as you scroll: the gap grows from 0.75 to 1.85 units.
    const gap = 0.75 + v.p * 1.1
    const ys = stackLayers.map((_, i) => (1 - i) * gap)
    slabs.current.forEach((m, i) => (m.position.y = ys[i]))

    // 2. The whole stack tilts a little toward the cursor.
    group.current.rotation.y = -0.55 + v.x * 0.25
    group.current.rotation.x = 0.12 - v.y * 0.12

    // 3. The camera orbits around the stack and rises as you scroll.
    const angle = v.p * 1.1
    camera.position.set(Math.sin(angle) * 7.5, 0.8 + v.p * 2.4, Math.cos(angle) * 7.5)
    camera.lookAt(0, 0, 0)

    // 4. Packets: even ones travel down (requests), odd ones travel up (responses).
    const t = state.clock.elapsedTime
    packets.current.forEach((m, i) => {
      const seg = i % 2 // 0: Frontend <-> API, 1: API <-> Database
      const down = Math.floor(i / 2) % 2 === 0
      const u = (t * 0.45 + i / PACKETS) % 1
      const from = ys[seg]
      const to = ys[seg + 1]
      m.position.set(-0.6 + (i % 3) * 0.6, down ? from + (to - from) * u : to + (from - to) * u, down ? 0.25 : -0.25)
      m.scale.setScalar(Math.sin(u * Math.PI)) // grow out of one slab, shrink into the next
    })
  })

  return (
    <group ref={group} scale={0.82}>
      {stackLayers.map((label, i) => (
        <group key={label} ref={(el) => (slabs.current[i] = el)}>
          <RoundedBox args={[2.6, 0.2, 1.7]} radius={0.08} smoothness={4}>
            <meshPhysicalMaterial
              color="#c4d4ff"
              emissive="#5B8CFF"
              emissiveIntensity={0.12}
              transparent
              opacity={0.22}
              roughness={0.05}
              metalness={0}
              clearcoat={1}
              clearcoatRoughness={0.05}
              envMapIntensity={2.2}
              depthWrite={false}
            />
            <Edges threshold={20} color="#7fa4ff" />
          </RoundedBox>
          <Html position={[-1.45, 0, 0.9]} center zIndexRange={[1, 0]}>
            <span className="rounded-full border border-accent/40 bg-bg/80 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-text">
              {label}
            </span>
          </Html>
        </group>
      ))}
      {Array.from({ length: PACKETS }, (_, i) => (
        <mesh key={i} ref={(el) => (packets.current[i] = el)}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color="#cddbff" toneMapped={false} />
          {/* soft glow: a larger additive sphere around the bright core */}
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="#5B8CFF" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </mesh>
      ))}
    </group>
  )
}
