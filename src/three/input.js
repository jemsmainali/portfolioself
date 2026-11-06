// Shared, mutable input state. Written by DOM listeners, read every frame in useFrame.
// Plain objects (not React state) so scrolling and mouse moves never re-render React.
export const scroll = { p: 0 } // 0 at the top of the page, 1 just before the Work section
export const pointer = { x: 0, y: 0 } // -1..1 across the window
