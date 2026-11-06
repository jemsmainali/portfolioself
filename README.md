# Jems Mainali · portfolio

Vite, React, Tailwind CSS, three.js with @react-three/fiber and drei, and motion.

## Run it

```sh
npm ci
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve dist/ at http://localhost:4173
```

Contact form: create `.env.local` with `VITE_FORM_ENDPOINT=https://formspree.io/f/xxxx` (or any endpoint that accepts a POST). If it's empty, the site shows the email address with a copy button instead of the form. On Render, add the same variable under Environment and redeploy.

All content (projects, experience, skills, links) is in `src/data/portfolio.js`.

## How the 3D scene works

- **One fixed canvas.** `src/three/Scene.jsx` renders a single `<Canvas>` in a `position: fixed` layer behind the page, with `pointer-events: none` so the page stays clickable.
- **Loaded last.** `App.jsx` imports the scene with `React.lazy`, so three.js ends up in its own chunk. It only mounts after `requestIdleCallback`, which means the text paints first.
- **Only where it makes sense.** On phones (narrow or touch), with `prefers-reduced-motion`, or without WebGL, the scene never loads. `StaticStack.jsx` shows a CSS-only version instead (three rotated divs).
- **Geometry from code.** Each layer is a drei `RoundedBox` with a transparent `meshPhysicalMaterial` and `Edges`. Reflections come from an `Environment` built from `Lightformer` panels, so no model or HDR file is downloaded. The labels are drei `Html`, which is real DOM text using the page font.
- **Packets.** Six small spheres with an additive "glow" sphere around each. Every frame they move between two slabs. Even packets go down (requests) and odd ones go up (responses). Their scale follows `sin(progress · π)`, so they grow out of one slab and shrink into the next.
- **Input without re-renders.** Scroll and pointer values live in a plain object (`src/three/input.js`). DOM listeners write to it and `useFrame` reads it. Values are smoothed with `THREE.MathUtils.damp`, so motion eases out and React never re-renders on scroll.
- **Scroll choreography.** Scroll progress `p` goes from 0 at the top to 1 just before Work. As `p` rises, the gap between slabs grows, and the camera orbits around the stack (`sin`/`cos` of an angle) and rises. A pointer tilt adds a small rotation.
- **Fade and pause.** The canvas layer's opacity follows a smoothstep from `p = 0.7` to `1`, so Work is never drawn over. Once it's invisible, or the tab is hidden, `frameloop` switches to `"never"` and nothing renders. DPR is capped at 1.5.
- **Layout trick.** `camera.setViewOffset` shifts the rendered image to the right, so the stack sits beside the hero text while the camera still orbits the origin.

The project cards use a plain CSS 3D tilt (`.tilt` in `index.css`): pointer position sets `--rx`/`--ry`, with no WebGL involved.

## Deploy

`render.yaml` describes the Render static site: `npm ci && npm run build`, publish `dist`, auto-deploy on commit, and a rewrite from `/*` to `/index.html`. The old plain-HTML site is kept at git tag `pre-react`.
