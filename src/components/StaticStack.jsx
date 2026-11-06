import { stackLayers } from '../data/portfolio.js'

// CSS-only version of the 3D stack for phones, reduced motion and browsers without WebGL.
export default function StaticStack() {
  return (
    <div className="static-stack" aria-hidden="true">
      {stackLayers.map((label, i) => (
        <div className="row" style={{ '--i': i }} key={label}>
          <div className="slab" />
          <span className="label rounded-full border border-accent/40 bg-bg px-2.5 py-1 text-xs font-semibold">
            {label}
          </span>
        </div>
      ))}
      <span className="packet" style={{ top: 92 }} />
      <span className="packet" style={{ top: 170, marginLeft: 18 }} />
    </div>
  )
}
