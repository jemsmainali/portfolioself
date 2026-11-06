/* ==========================================================
   Jems Mainali portfolio: plain JavaScript, no libraries.
   Each effect lives in its own init function at the bottom.
   ========================================================== */
'use strict';

// Contact form backend (for example a Formspree URL: 'https://formspree.io/f/abcdwxyz').
// Leave it empty and the form stays hidden, so visitors only see my email address.
const FORM_ENDPOINT = '';
const EMAIL = 'jemsmainali@gmail.com';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// One rAF-throttled scroll/resize loop shared by every scroll effect.
const scrollHandlers = [];
let scrollQueued = false;
function onScrollFrame() {
  scrollQueued = false;
  scrollHandlers.forEach((fn) => fn());
}
function queueScroll() {
  if (!scrollQueued) {
    scrollQueued = true;
    requestAnimationFrame(onScrollFrame);
  }
}
window.addEventListener('scroll', queueScroll, { passive: true });
window.addEventListener('resize', queueScroll);

/* ==========================================================
   1. HERO CONTOUR MAP (marching squares)
   ----------------------------------------------------------
   A height field is sampled on a grid of points. For every
   contour level, marching squares looks at the 4 corners of
   each grid cell, builds a 4-bit index from which corners are
   above the level (0-15), and draws the line segment(s) that
   separate high corners from low ones. The cursor adds a
   Gaussian "hill" to the field, so rings bunch up around it.
   ========================================================== */
function initContours() {
  const hero = document.querySelector('.hero');
  const canvas = hero && hero.querySelector('canvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const tag = hero.querySelector('.elev');
  const name = hero.querySelector('.hero-name');

  const CELL = 12;         // grid spacing in CSS pixels (smaller = smoother but slower)
  const STEP = 0.25;       // field units between two contour lines
  const BASE_M = 1400;     // field value 0 = 1,400 m, about the Kathmandu valley floor
  const M_PER_UNIT = 160;  // so one contour interval = 0.25 * 160 = 40 m
  const HILL = 2.2;        // height of the cursor hill in field units

  // Split the name into one <span> per letter so each letter can get its own weight.
  name.setAttribute('aria-label', name.textContent.replace(/\s+/g, ' ').trim());
  const letters = [];
  name.querySelectorAll('.w').forEach((word) => {
    const text = word.textContent;
    word.textContent = '';
    for (const char of text) {
      const span = document.createElement('span');
      span.className = 'ch';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = char;
      word.appendChild(span);
      letters.push(span);
    }
  });

  // Base terrain: five sine waves at random angles added together (cheap fake noise).
  const waves = Array.from({ length: 5 }, (_, i) => ({
    angle: Math.random() * Math.PI,
    freq: 0.0025 * (i + 1) * (0.7 + Math.random() * 0.6),
    phase: Math.random() * Math.PI * 2,
    amp: 0.9 / (i + 1),
  }));
  const terrain = (x, y) =>
    waves.reduce((sum, w) => sum + w.amp * Math.sin((x * Math.cos(w.angle) + y * Math.sin(w.angle)) * w.freq + w.phase), 0);

  let W = 0, H = 0, cols = 0, rows = 0, sigma = 100, base, field;
  const hill = { x: 0, y: 0, tx: 0, ty: 0 }; // current position and the target it eases towards

  // Size the canvas for the screen and pre-compute the terrain (it never changes).
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth;
    H = hero.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / CELL) + 1;
    rows = Math.ceil(H / CELL) + 1;
    sigma = Math.min(W, H) * 0.11 + 30; // hill radius
    base = new Float32Array(cols * rows);
    field = new Float32Array(cols * rows);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) base[j * cols + i] = terrain(i * CELL, j * CELL);
  }

  // Which cell edges each of the 16 corner patterns connects, as pairs.
  // Edges: 0 top, 1 right, 2 bottom, 3 left. Corner bits: top-left 8, top-right 4, bottom-right 2, bottom-left 1.
  // Cases 5 and 10 are "saddles" with two segments.
  const SEGMENTS = [[], [3, 2], [2, 1], [3, 1], [1, 0], [3, 0, 1, 2], [2, 0], [3, 0],
    [0, 3], [0, 2], [0, 1, 2, 3], [0, 1], [1, 3], [1, 2], [2, 3], []];
  const pt = new Float32Array(8); // x, y of the crossing point on each of the 4 edges

  function draw() {
    // Field = terrain + Gaussian hill under the cursor.
    const k = 1 / (2 * sigma * sigma);
    for (let j = 0; j < rows; j++) {
      const dy = j * CELL - hill.y;
      for (let i = 0; i < cols; i++) {
        const dx = i * CELL - hill.x, n = j * cols + i;
        field[n] = base[n] + HILL * Math.exp(-(dx * dx + dy * dy) * k);
      }
    }

    const thin = new Path2D(), thick = new Path2D(); // every 5th line is an "index contour"
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const n = j * cols + i;
        const a = field[n], b = field[n + 1], c = field[n + cols + 1], d = field[n + cols]; // tl tr br bl
        const lo = Math.min(a, b, c, d), hi = Math.max(a, b, c, d);
        const x = i * CELL, y = j * CELL;
        // Only visit the levels that actually pass through this cell.
        for (let L = Math.ceil(lo / STEP); L * STEP <= hi; L++) {
          const v = L * STEP;
          const seg = SEGMENTS[(a > v ? 8 : 0) | (b > v ? 4 : 0) | (c > v ? 2 : 0) | (d > v ? 1 : 0)];
          if (!seg.length) continue;
          // Linear interpolation: how far along each edge does the field equal v?
          pt[0] = x + (CELL * (v - a)) / (b - a); pt[1] = y;            // top
          pt[2] = x + CELL; pt[3] = y + (CELL * (v - b)) / (c - b);     // right
          pt[4] = x + (CELL * (v - d)) / (c - d); pt[5] = y + CELL;     // bottom
          pt[6] = x; pt[7] = y + (CELL * (v - a)) / (d - a);            // left
          const path = ((L % 5) + 5) % 5 === 0 ? thick : thin;
          for (let s = 0; s < seg.length; s += 2) {
            path.moveTo(pt[seg[s] * 2], pt[seg[s] * 2 + 1]);
            path.lineTo(pt[seg[s + 1] * 2], pt[seg[s + 1] * 2 + 1]);
          }
        }
      }
    }
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(10, 47, 143, 0.26)';
    ctx.stroke(thin);
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = 'rgba(10, 47, 143, 0.55)';
    ctx.stroke(thick);

    // Elevation tag at the summit.
    const metres = BASE_M + (terrain(hill.x, hill.y) + HILL) * M_PER_UNIT;
    tag.textContent = Math.round(metres).toLocaleString('en') + ' m';
    const flip = hill.x > W - 120 ? -tag.offsetWidth - 14 : 14;
    tag.style.transform = `translate(${Math.round(hill.x + flip)}px, ${Math.round(hill.y - 34)}px)`;

    // Letters near the hill get heavier. Read all positions first, then write all weights,
    // so the browser only has to recalculate layout once per frame.
    const box = hero.getBoundingClientRect();
    const rects = letters.map((l) => l.getBoundingClientRect());
    const reach = 2 * (sigma * 1.8) ** 2;
    rects.forEach((r, i) => {
      const dx = r.left + r.width / 2 - box.left - hill.x;
      const dy = r.top + r.height / 2 - box.top - hill.y;
      letters[i].style.setProperty('--w', Math.round(200 + 600 * Math.exp(-(dx * dx + dy * dy) / reach)));
    });
  }

  // Input: a mouse moves the hill; a tap on touch screens drops it where you tap.
  let pointerAt = -Infinity, frame = 0;
  function aim(e) {
    const r = hero.getBoundingClientRect();
    hill.tx = e.clientX - r.left;
    hill.ty = e.clientY - r.top;
    pointerAt = performance.now();
    if (reduceMotion) { hill.x = hill.tx; hill.y = hill.ty; draw(); } // jump, no easing
    else start();
  }
  hero.addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') aim(e); });
  hero.addEventListener('pointerdown', aim);

  // Animation loop: ease towards the target; drift slowly when nobody is pointing.
  function tick(now) {
    frame = 0;
    if (window.scrollY > hero.offsetHeight || document.hidden) return; // hero covered: stop
    if (now - pointerAt > 3000) {
      hill.tx = W * (0.64 + 0.24 * Math.sin(now / 5200));
      hill.ty = H * (0.4 + 0.2 * Math.sin(now / 3700));
    }
    hill.x += (hill.tx - hill.x) * 0.08;
    hill.y += (hill.ty - hill.y) * 0.08;
    draw();
    frame = requestAnimationFrame(tick);
  }
  function start() { if (!frame && !reduceMotion) frame = requestAnimationFrame(tick); }

  resize();
  hill.x = hill.tx = W * 0.66;
  hill.y = hill.ty = H * 0.4;
  tag.hidden = false;
  draw();
  start();
  scrollHandlers.push(start);
  document.addEventListener('visibilitychange', start);
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); draw(); start(); }, 120);
  });
}

/* ==========================================================
   2. STATEMENT: words light up as you scroll
   The section is 240vh tall with a sticky inner box. Scroll
   progress through it (0 to 1) decides how many words are lit.
   ========================================================== */
function initStatement() {
  const section = document.querySelector('.statement');
  const text = section && section.querySelector('.statement-text');
  if (!text) return;
  const words = text.textContent.trim().split(/\s+/);
  text.textContent = '';
  const spans = words.map((word, i) => {
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = word;
    text.append(span, i < words.length - 1 ? ' ' : '');
    return span;
  });
  if (reduceMotion) { spans.forEach((s) => s.classList.add('lit')); return; }

  function update() {
    const r = section.getBoundingClientRect();
    const travel = section.offsetHeight - window.innerHeight;
    // Start when the section is halfway up the screen, finish a little before it unpins.
    const progress = clamp((window.innerHeight * 0.5 - r.top) / (window.innerHeight * 0.5 + travel * 0.8), 0, 1);
    const lit = Math.round(progress * spans.length);
    spans.forEach((s, i) => s.classList.toggle('lit', i < lit));
  }
  scrollHandlers.push(update);
  update();
}

/* ==========================================================
   3. WORK: pinned horizontal scroll + title width + request dots
   On wide screens the section gets a height equal to the extra
   horizontal distance, and its inner box is sticky. Vertical
   scroll progress is turned into translateX on the track.
   ========================================================== */
function initWork() {
  const section = document.getElementById('work');
  if (!section) return;
  const pin = section.querySelector('.work-pin');
  const track = section.querySelector('.work-track');
  const titles = [...section.querySelectorAll('.panel-title')];
  const wide = window.matchMedia('(min-width: 900px) and (min-height: 600px)');
  let pinned = false;

  function layout() {
    pinned = wide.matches && !reduceMotion;
    section.classList.toggle('is-pinned', pinned);
    section.style.height = '';
    track.style.transform = '';
    if (pinned) section.style.height = track.offsetWidth - window.innerWidth + window.innerHeight + 'px';
    update();
  }

  function update() {
    if (pinned) {
      const travel = section.offsetHeight - window.innerHeight;
      const p = clamp(-section.getBoundingClientRect().top / travel, 0, 1);
      track.style.transform = `translate3d(${(-p * (track.offsetWidth - window.innerWidth)).toFixed(1)}px, 0, 0)`;
    }
    if (reduceMotion) return;
    // Title width: 125 (wide) when the panel is centred, down to 75 (narrow) further away.
    const rects = titles.map((t) => t.getBoundingClientRect());
    rects.forEach((r, i) => {
      const d = pinned
        ? Math.abs(r.left + r.width / 2 - window.innerWidth / 2) / window.innerWidth
        : Math.abs(r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      titles[i].style.setProperty('--wdth', (125 - clamp(d * 1.6, 0, 1) * 50).toFixed(1));
    });
  }

  // Keyboard users: when a link inside an off-screen panel gets focus, scroll to that panel.
  section.addEventListener('focusin', (e) => {
    if (!pinned) return;
    pin.scrollLeft = 0;
    const item = e.target.closest('.panel, .work-outro');
    if (!item) return;
    const max = track.offsetWidth - window.innerWidth;
    const p = clamp((item.offsetLeft - (window.innerWidth - item.offsetWidth) / 2) / max, 0, 1);
    window.scrollTo({ top: section.offsetTop + p * (section.offsetHeight - window.innerHeight), behavior: 'auto' });
  });

  scrollHandlers.push(update);
  window.addEventListener('resize', layout);
  if (wide.addEventListener) wide.addEventListener('change', layout);
  if (document.fonts) document.fonts.ready.then(layout);
  layout();
  initDots(section);
}

// A dot travels along each diagram's .route path using getPointAtLength().
function initDots(section) {
  const items = [...section.querySelectorAll('.diagram')].map((svg) => {
    const path = svg.querySelector('.route');
    return { path, dot: svg.querySelector('.dot'), len: path.getTotalLength(), pingpong: svg.dataset.mode === 'pingpong' };
  });
  const place = (it, t) => {
    const p = it.path.getPointAtLength(t * it.len);
    it.dot.setAttribute('cx', p.x.toFixed(1));
    it.dot.setAttribute('cy', p.y.toFixed(1));
  };
  if (reduceMotion) { items.forEach((it) => place(it, 0.5)); return; }

  function frame(now) {
    const r = section.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight && !document.hidden) {
      items.forEach((it, i) => {
        let t = (now / (3200 + i * 400)) % 1;       // 0..1 repeating
        if (it.pingpong) t = t < 0.5 ? t * 2 : 2 - t * 2; // there and back
        place(it, t);
      });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ==========================================================
   5. STACK TABLE: highlight the hovered cell's row and column
   ========================================================== */
function initStack() {
  const table = document.querySelector('.stack-table');
  if (!table) return;
  const clear = () => table.querySelectorAll('.hl-row, .hl-col').forEach((el) => el.classList.remove('hl-row', 'hl-col'));
  table.addEventListener('pointerover', (e) => {
    const cell = e.target.closest('td, th');
    clear();
    if (!cell) return;
    const row = cell.parentElement;
    if (row.parentElement.tagName === 'TBODY') row.classList.add('hl-row');
    const col = cell.cellIndex;
    if (col > 0) table.querySelectorAll('tr').forEach((tr) => tr.cells[col] && tr.cells[col].classList.add('hl-col'));
  });
  table.addEventListener('pointerleave', clear);
}

/* ==========================================================
   6. CONTACT: rising peaks, copy button, clock, form
   ========================================================== */
function initPeaks() {
  const section = document.querySelector('.contact');
  const fill = section && section.querySelector('.peaks-fill');
  const edge = section && section.querySelector('.peaks-edge');
  if (!fill || !edge) return;
  // Two peaks in a 1000 x 200 box. p = 0 is flat, p = 1 is full height.
  const set = (p) => {
    const y = (k) => (200 - 190 * k * p).toFixed(1);
    const top = `M0 ${y(0.12)} L330 ${y(1)} L500 ${y(0.42)} L720 ${y(0.8)} L1000 ${y(0.1)}`;
    edge.setAttribute('d', top);
    fill.setAttribute('d', `${top} L1000 200 L0 200 Z`);
  };
  if (reduceMotion) { set(1); return; }
  const update = () => {
    const top = section.getBoundingClientRect().top;
    set(clamp((window.innerHeight - top) / (window.innerHeight * 0.7), 0.08, 1));
  };
  scrollHandlers.push(update);
  update();
}

function initCopy() {
  const button = document.querySelector('.copy');
  const status = document.querySelector('.copy-status');
  const email = document.querySelector('.email');
  if (!button) return;
  button.hidden = false;
  let timer;
  const say = (msg) => {
    status.textContent = msg;
    clearTimeout(timer);
    timer = setTimeout(() => { status.textContent = ''; }, 2500);
  };
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      say('Copied');
    } catch (err) {
      // Clipboard blocked (old browser or no permission): select the text instead.
      const range = document.createRange();
      range.selectNodeContents(email);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      say('Selected, press Ctrl+C to copy');
    }
  });
}

function initClock() {
  const el = document.querySelector('[data-clock]');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  });
  const tick = () => { el.textContent = fmt.format(new Date()); };
  tick();
  setInterval(tick, 1000);
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
}

function initForm() {
  const form = document.getElementById('contact-form');
  const fallback = document.getElementById('form-fallback');
  if (!form) return;
  if (!FORM_ENDPOINT) { form.hidden = true; fallback.hidden = false; return; } // no backend: email only

  form.hidden = false;
  fallback.hidden = true;
  form.action = FORM_ENDPOINT;
  const button = form.querySelector('.send');
  const status = form.querySelector('.form-status');
  const show = (state, msg) => { status.dataset.state = state; status.textContent = msg; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    if (form.elements._gotcha.value) return; // a bot filled the hidden field: send nothing

    button.disabled = true;
    show('sending', 'Sending…');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`The server replied with an error (${res.status}).`);
      form.reset();
      show('success', 'Thanks, your message was sent. I will reply by email.');
    } catch (err) {
      const reason = err.name === 'AbortError' ? 'The request timed out.'
        : err instanceof TypeError ? 'I could not reach the server.' : err.message;
      show('error', `${reason} Your message was not sent. Please email me at ${EMAIL}.`);
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
    }
  });
}

// Start everything. One broken effect should not stop the others.
[initContours, initStatement, initWork, initStack, initPeaks, initCopy, initClock, initForm].forEach((fn) => {
  try { fn(); } catch (err) { console.error(`${fn.name} failed:`, err); }
});
