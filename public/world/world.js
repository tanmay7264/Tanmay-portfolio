// World engine distilled from GCL Campus (site/scene.js). Everything visible comes from world.config.js.
import * as THREE from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';
import { WORLD } from './world.config.js';
import { makeFigure, pose, sitY } from './figures.js';

const $ = s => document.querySelector(s);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const N = WORLD.size, C = N / 2;
const at = (x, z, y = 0) => new THREE.Vector3(x - C, y, z - C);   // grid units 0..N, centred at the origin
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Required credit (Tanmay's BM Ecosystem Builder). The world refuses to run if it is removed, hidden or changed.
const PORTFOLIO = 'https://www.tanmayportfolio.me/', REPO = 'https://github.com/tanmay7264/tanmays-bm-ecosystem-builder';
const CREDIT = `Built and designed by <a href="${PORTFOLIO}" target="_blank" rel="noopener">Tanmay</a> · <a href="${REPO}" target="_blank" rel="noopener">BM Ecosystem Builder</a>`;
const credit = document.createElement('p'); credit.className = 'card credit'; credit.innerHTML = CREDIT; document.body.append(credit);
const creditOk = () => {
  const el = document.querySelector('.credit'), s = el && getComputedStyle(el), r = el?.getBoundingClientRect();
  return !!el && el.isConnected && el.innerHTML === CREDIT && s.display !== 'none' && s.visibility === 'visible' && +s.opacity >= 0.9
    && r.width > 40 && r.height > 10 && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight;
};
let creditTimer;
function creditError() {
  clearInterval(creditTimer); renderer?.setAnimationLoop(null);
  document.body.innerHTML = `<div class="credit-error" role="alert"><h1>Credit required</h1><p>This world was made with Tanmay's BM Ecosystem Builder, which requires the credit
    "Built and designed by Tanmay" with links to <a href="${PORTFOLIO}">${PORTFOLIO}</a> and <a href="${REPO}">${REPO}</a>.</p><p>Restore the credit to use this world.</p></div>`;
  throw new Error("Credit removed: Tanmay's BM Ecosystem Builder requires the credit to stay visible.");
}

const canvas = $('#scene');
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
catch { document.body.classList.add('no-webgl'); $('.nogl').hidden = false; throw new Error('No WebGL'); }
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);                                   // sky gradient is CSS behind the canvas
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(WORLD.colors.haze, N * 5, N * 8);

const mats = new Map();
const mat = (c, key = c) => { if (!mats.has(key)) mats.set(key, new THREE.MeshStandardMaterial({ color: c, roughness: 0.85 })); return mats.get(key); };
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const mesh = (geo, m, x = 0, y = 0, z = 0, shadow = true) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = shadow; o.receiveShadow = true; return o; };
let seed = WORLD.seed || 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; // same world every visit
const pick = a => a[Math.floor(rnd() * a.length)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v)), sstep = (a, b, x) => { const k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
const ease = k => 1 - Math.pow(1 - clamp(k, 0, 1), 3);
const ZONE = Object.fromEntries(WORLD.zones.map(z => [z.id, z]));
const litMats = [];                                                     // materials that glow at night (windows, lamps)
const glowAtNight = (m, c = '#FFD27A', k = 1) => { m.emissive = new THREE.Color(c); m.emissiveIntensity = 0; m.userData.k = k; litMats.push(m); return m; };

/* ---------- Themes: dark navy and light. Scene materials by role, recoloured on switch ---------- */
const THEMES = {
  dark: { ground: '#2A3A52', lawn: '#2E4560', path: '#475569', edge: '#334155', slab: '#1E293B', trim: '#3B82F6', sea: '#0C1B2E', haze: '#0F172A', sky: ['#1E293B', '#0B1222'], skyN: ['#0B1020', '#03050B'] },
  light: { ground: '#E8DFC9', lawn: '#CBDBA9', path: '#D2C6AE', edge: '#B8AA8E', slab: '#F4EEE1', trim: '#C8A46A', sea: '#B9D6E0', haze: '#EDE6D6', sky: ['#FFF8EC', '#E9DEC6'], skyN: ['#3A4466', '#1B2036'] },
};
const TM = Object.fromEntries(['ground', 'lawn', 'path', 'edge', 'slab', 'trim', 'sea'].map(r => [r, new THREE.MeshStandardMaterial({ color: THEMES.dark[r], roughness: 0.9 })]));
const LAWN = '#2E4560';                                                 // lawn colour in the config = themed lawn
let theme = [new URLSearchParams(location.search).get('theme'), localStorage.getItem('tw-theme')].map(t => t === 'cream' ? 'light' : t).find(t => t in THEMES) || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');   // ?theme=dark|light wins; the old name 'cream' still works

/* ---------- Camera: orthographic isometric, tilt locked, spin allowed ---------- */
const FR = N * 0.62, OFFSET = new THREE.Vector3(60, 52, 60);
const HOME = at(WORLD.home.x, WORLD.home.z), HOME_ZOOM = WORLD.home.zoom;
const camera = new THREE.OrthographicCamera(-FR, FR, FR, -FR, 20, 260);
camera.position.copy(HOME).add(OFFSET);
const controls = new MapControls(camera, canvas);
controls.target.copy(HOME);
controls.enableDamping = !reduceMotion; controls.dampingFactor = 0.08;
controls.minZoom = 0.35; controls.maxZoom = 5; controls.zoomToCursor = true;
controls.minPolarAngle = controls.maxPolarAngle = new THREE.Spherical().setFromVector3(OFFSET).phi;

const hemi = new THREE.HemisphereLight('#E6EEFF', WORLD.colors.ground, 1.45); scene.add(hemi);
const sun = new THREE.DirectionalLight('#FFF1DC', 2.1);
sun.position.set(N * 0.9, N * 1.4, N * 0.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -N * 1.4, right: N * 1.4, top: N * 1.4, bottom: -N * 1.4, near: 1, far: N * 5 }); scene.add(sun.target);   // the sun follows the camera (see loop)
sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02; scene.add(sun);

/* ---------- Ground: one presentation slab per island, like an architect's model (layers never coplanar) ---------- */
for (const s of WORLD.islands) {
  const p = at(s.x + s.w / 2, s.z + s.d / 2);
  scene.add(mesh(box(s.w, 0.06, s.d), TM.ground, p.x, -0.03, p.z, false));
  scene.add(mesh(box(s.w + 0.04, 0.08, s.d + 0.04), TM.trim, p.x, -0.1, p.z, false));
  scene.add(mesh(box(s.w, 0.9, s.d), TM.slab, p.x, -0.6, p.z));
}
{ const sea = mesh(new THREE.PlaneGeometry(600, 600), TM.sea, 0, -1.2, 0, false); sea.rotation.x = -Math.PI / 2; scene.add(sea); }
const flatM = (x, z, w, d, y, m) => scene.add(mesh(box(w, 0.02, d), m, x - C + w / 2, y, z - C + d / 2, false));
for (const [x, z, w, d, c] of WORLD.areas || []) flatM(x, z, w, d, 0.006, c === LAWN ? TM.lawn : mat(c));
for (const [x, z, w, d] of WORLD.paths || []) { flatM(x - 0.07, z - 0.07, w + 0.14, d + 0.14, 0.011, TM.edge); flatM(x, z, w, d, 0.015, TM.path); }
const flags = [];
for (const [x, z, cols] of WORLD.flags || []) {
  const p = at(x, z); scene.add(mesh(new THREE.CylinderGeometry(0.03, 0.04, 2.4, 8), mat('#CBD5E1'), p.x, 1.2, p.z));
  const f = new THREE.Group(); f.position.set(p.x, 2.25, p.z); scene.add(f); flags.push(f);
  cols.forEach((c, i) => f.add(mesh(box(0.8, 0.16, 0.02), mat(c), 0.42, -i * 0.16, 0)));
}

/* ---------- Background city: houses, flats, shops, half-timbered Bamberg houses and the cathedral ---------- */
const fillGlass = glowAtNight(new THREE.MeshStandardMaterial({ color: '#9CC3DE', roughness: 0.4 }), '#FFD27A', 0.9);
const winSpots = [];
function prism(len, base, height, m, x, y, z, alongX = false) {     // triangular gable roof; base sits at y
  const r = base / (2 * Math.sin(Math.PI / 3)), geo = new THREE.CylinderGeometry(r, r, len, 3, 1);
  geo.rotateX(-Math.PI / 2); if (alongX) geo.rotateY(Math.PI / 2);
  const o = mesh(geo, m, x, y + r / 2 * (height / (1.5 * r)), z); o.scale.y = height / (1.5 * r); return o;
}
function hipRoof(w, d, hh, m, y) { const geo = new THREE.ConeGeometry(1, hh, 4); geo.rotateY(Math.PI / 4); const r = mesh(geo, m, 0, y + hh / 2, 0); r.scale.set(w / 1.414 * 1.12, 1, d / 1.414 * 1.12); return r; }
for (const [x, z, w, d, h, kind] of WORLD.fillers || []) {
  const g = new THREE.Group(); g.position.copy(at(x + w / 2, z + d / 2)); scene.add(g);
  const wall = { house: pick(['#F1E3C8', '#E8C9A0', '#CFE3E0', '#F3D5C0', '#E4E9F2']), flats: pick(['#D9D4CC', '#CBD5E1', '#E7DCCB', '#C9D6C3']), shop: '#F5EBDD', timber: '#F4EBD6', cathedral: '#D8C3A0' }[kind];
  if (kind === 'cathedral') {
    g.add(mesh(box(1.6, h, d - 1.4), mat(wall), 0, h / 2, 0), prism(d - 1.4, 1.7, 0.9, mat('#6B8F84'), 0, h, 0));
    for (const sx of [-0.6, 0.6]) for (const sz of [-(d / 2 - 0.4), d / 2 - 0.4]) {
      g.add(mesh(box(0.7, h + 1.5, 0.7), mat(wall), sx, (h + 1.5) / 2, sz));
      const sp = new THREE.ConeGeometry(0.46, 1.5, 4); sp.rotateY(Math.PI / 4); g.add(mesh(sp, mat('#5F8F7E'), sx, h + 1.5 + 0.75, sz));
      for (let k = 0; k < 2; k++) winSpots.push([g, sx, h * 0.5 + k * 0.7, sz + 0.36, 0]);
    }
    continue;
  }
  g.add(mesh(box(w, h, d), mat(wall), 0, h / 2, 0));
  if (kind === 'house') g.add(hipRoof(w, d, Math.min(w, d) * 0.45, mat(pick(['#B45309', '#9A3412', '#7C2D12', '#475569'])), h));
  if (kind === 'flats') { g.add(mesh(box(w + 0.1, 0.12, d + 0.1), mat('#94A3B8'), 0, h + 0.06, 0), mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.4, 10), mat('#64748B'), w / 4, h + 0.32, -d / 4)); }
  if (kind === 'shop') { g.add(mesh(box(w + 0.1, 0.12, d + 0.1), mat('#A8A29E'), 0, h + 0.06, 0)); const aw = mesh(box(w * 0.9, 0.05, 0.5), mat(pick(['#DC2626', '#16A34A', '#2563EB', '#D97706'])), 0, h * 0.62, d / 2 + 0.2); aw.rotation.x = 0.35; g.add(aw); }
  if (kind === 'timber') {
    g.add(prism(d + 0.15, w + 0.15, 1.1, mat('#9A3412'), 0, h, 0));
    const beam = mat('#5B3A1E');
    for (const y of [0.05, h / 2, h - 0.04]) g.add(mesh(box(w, 0.06, 0.03), beam, 0, y, d / 2 + 0.015, false));
    for (const bx of [-w / 2 + 0.05, -w / 6, w / 6, w / 2 - 0.05]) g.add(mesh(box(0.06, h, 0.03), beam, bx, h / 2, d / 2 + 0.015, false));
    for (const s of [-1, 1]) { const dg = mesh(box(0.05, h * 0.62, 0.03), beam, s * w / 3, h * 0.25, d / 2 + 0.016, false); dg.rotation.z = s * 0.55; g.add(dg); }
  }
  const rows = Math.max(1, Math.floor((h - 0.35) / 0.62)), cols = Math.max(1, Math.floor(w / 0.62)), colsD = Math.max(1, Math.floor(d / 0.62));
  for (let r = 0; r < rows; r++) {
    const y = 0.5 + r * 0.62; if (kind === 'shop' && r === 0) continue;
    for (let c = 0; c < cols; c++) winSpots.push([g, -w / 2 + (c + 0.5) * (w / cols), y, d / 2 + 0.012, 0]);
    for (let c = 0; c < colsD; c++) winSpots.push([g, w / 2 + 0.012, y, -d / 2 + (c + 0.5) * (d / colsD), 1]);
  }
}
{ const im = new THREE.InstancedMesh(box(0.26, 0.3, 0.02), fillGlass, winSpots.length), o3 = new THREE.Object3D();
  winSpots.forEach(([g, x, y, z, r], i) => { g.updateMatrixWorld(); o3.position.set(x, y, z).applyMatrix4(g.matrixWorld); o3.rotation.set(0, r ? Math.PI / 2 : 0, 0); o3.updateMatrix(); im.setMatrixAt(i, o3.matrix); });
  scene.add(im); }

/* ---------- Textures: signboards and the in-room presentation board ---------- */
function signTexture(text, colour) {
  const c = document.createElement('canvas'); c.width = 640; c.height = 108;
  const g = c.getContext('2d');
  g.fillStyle = colour; g.beginPath(); g.roundRect(4, 4, 632, 100, 18); g.fill();
  g.fillStyle = '#FFFFFF'; g.font = '700 48px "Space Grotesk", Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text.toUpperCase(), 320, 58, 600);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function wrap(g, text, maxW, maxLines) {
  const lines = []; let cur = '';
  for (const w of String(text).split(' ')) { const t = cur ? cur + ' ' + w : w; if (cur && g.measureText(t).width > maxW) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] += ' …'; }
  return lines;
}
function drawBoard(b, colour, kicker, title, text) {
  const g = b.ctx, W = 1024, H = 512;
  g.clearRect(0, 0, W, H);
  g.fillStyle = '#0F172A'; g.beginPath(); g.roundRect(6, 6, W - 12, H - 12, 30); g.fill();
  g.strokeStyle = colour; g.lineWidth = 10; g.stroke();
  g.textBaseline = 'top'; g.fillStyle = colour; g.font = '700 30px "Space Grotesk", Arial, sans-serif'; g.fillText(kicker.toUpperCase(), 50, 44, W - 100);
  g.fillStyle = '#FFFFFF'; g.font = '700 58px "Space Grotesk", Arial, sans-serif';
  const tl = wrap(g, title, W - 100, 2); tl.forEach((l, i) => g.fillText(l, 50, 92 + i * 66));
  g.fillStyle = '#CBD5E1'; g.font = '400 36px "Space Grotesk", Arial, sans-serif';
  wrap(g, text, W - 100, 5).forEach((l, i) => g.fillText(l, 50, 110 + tl.length * 66 + i * 46));
  b.tex.needsUpdate = true;
}

/* ---------- People: jointed figures from Twin Nagar ---------- */
const SKIN = ['#C68E6A', '#8D5524', '#E0AC69', '#F1C27D', '#A0673F', '#6B4226'], HAIR = ['#1B1612', '#3B2A1E', '#6B4F3A', '#1A1A1A', '#8D8A86', '#A15C2F'];
const SHIRTS = ['#2563EB', '#DC2626', '#16A34A', '#9333EA', '#EA580C', '#0891B2', '#DB2777', '#4B5563', '#CA8A04', '#F8FAFC'], PANTS = ['#1E293B', '#3A3F55', '#4B3A2A', '#1F2937', '#334155', '#57534E'];
const person = (scale, o = {}) => makeFigure(o.shirt || pick(SHIRTS), scale, o.pants || pick(PANTS), o.skin || pick(SKIN), o.hair || pick(HAIR), o.style || null);
const crowd = [];                                                        // { f, mode, ph, rate, room? }

/* ---------- Interiors: what you see when a building opens (low walls, props, people, presentation board) ---------- */
const glow = new THREE.MeshStandardMaterial({ color: '#38BDF8', emissive: '#38BDF8', emissiveIntensity: 0.7 });
const goldM = new THREE.MeshStandardMaterial({ color: '#FACC15', metalness: 0.6, roughness: 0.3 });
const COMM = [[-1.25, 0.55], [-0.8, 0.95], [0.8, 0.95], [1.25, 0.55], [-1.45, -0.05], [1.45, -0.05]];
const PROPS = {
  desk(p, x, z, r = 0) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = r; p.add(g);
    g.add(mesh(box(0.6, 0.36, 0.34), mat('#94A3B8'), 0, 0.18, 0), mesh(box(0.7, 0.04, 0.42), mat('#B98A55'), 0, 0.38, 0),
      mesh(box(0.3, 0.2, 0.02), mat('#1E293B'), 0, 0.52, -0.12), mesh(box(0.26, 0.16, 0.012), glow, 0, 0.52, -0.105, false),
      mesh(box(0.24, 0.05, 0.24), mat('#334155'), 0, 0.24, 0.36)); },
  stool(p, x, z, c = '#3B82F6') { p.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.24, 10), mat(c), x, 0.12, z)); },
  plant(p, x, z) { p.add(mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.2, 8), mat('#B45309'), x, 0.1, z), mesh(new THREE.IcosahedronGeometry(0.18, 0), mat('#3AA17A'), x, 0.34, z)); },
  shelf(p, x, z, r = 0) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = r; p.add(g);
    g.add(mesh(box(0.9, 0.95, 0.24), mat('#7C5A3A'), 0, 0.475, 0));
    for (let row = 0; row < 3; row++) for (let i = 0; i < 6; i++) g.add(mesh(box(0.1, 0.22, 0.18), mat(['#EF4444', '#3B82F6', '#22C55E', '#EAB308', '#A855F7', '#F97316'][(i + row) % 6]), -0.33 + i * 0.13, 0.17 + row * 0.3, 0.04, false)); },
  sofa(p, x, z, c) { p.add(mesh(box(0.9, 0.2, 0.4), mat(c), x, 0.1, z), mesh(box(0.9, 0.3, 0.1), mat(c), x, 0.25, z - 0.18)); },
  rug(p, x, z, w, d, c) { p.add(mesh(box(w, 0.01, d), mat(c), x, 0.005, z, false)); },
  car(p, x, z, c, r = 0) { const g = vehicle(c, false); g.position.set(x, 0, z); g.rotation.y = r; g.scale.setScalar(1.1); p.add(g); },
  booth(p, x, z, c) { p.add(mesh(box(0.8, 0.4, 0.3), mat('#E2E8F0'), x, 0.2, z), mesh(box(0.8, 0.5, 0.03), mat(c), x, 0.95, z - 0.15), mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 6), mat('#64748B'), x - 0.38, 0.6, z - 0.15), mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 6), mat('#64748B'), x + 0.38, 0.6, z - 0.15)); },
  trophy(p, x, z, s = 1) { p.add(mesh(box(0.36, 0.3 * s, 0.36), mat('#E2E8F0'), x, 0.15 * s, z), mesh(new THREE.CylinderGeometry(0.11, 0.05, 0.22, 12), goldM, x, 0.3 * s + 0.16, z), mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.05, 10), goldM, x, 0.3 * s + 0.03, z)); },
  rack(p, x, z) { p.add(mesh(box(0.38, 1.0, 0.36), mat('#1E293B'), x, 0.5, z)); for (let i = 0; i < 4; i++) p.add(mesh(box(0.28, 0.03, 0.01), glow, x, 0.25 + i * 0.2, z + 0.185, false)); },
  seats(p, x, z, n) { for (let i = 0; i < n; i++) p.add(mesh(box(0.24, 0.22, 0.24), mat('#3B82F6'), x + i * 0.28, 0.11, z), mesh(box(0.24, 0.24, 0.05), mat('#1D4ED8'), x + i * 0.28, 0.3, z - 0.1)); },
  crib(p, x, z) { p.add(mesh(box(0.7, 0.04, 0.42), mat('#FDE68A'), x, 0.3, z)); for (let i = 0; i < 6; i++) p.add(mesh(box(0.03, 0.5, 0.03), mat('#F8FAFC'), x - 0.33 + i * 0.13, 0.25, z + 0.2), mesh(box(0.03, 0.5, 0.03), mat('#F8FAFC'), x - 0.33 + i * 0.13, 0.25, z - 0.2)); },
  blocks(p, x, z) { ['#EF4444', '#3B82F6', '#22C55E', '#EAB308'].forEach((c, i) => p.add(mesh(box(0.12, 0.12, 0.12), mat(c), x + (i % 2) * 0.14, 0.06 + Math.floor(i / 2) * 0.12, z))); },
};
const ROOMS = {   // (props, w, d): keep the back-centre free for Tanmay, who presents in front of the board
  campus(p, w, d) { for (const sx of [-1, 1]) for (const z of [-0.35, 0.45]) for (const k of [0.75, 1.45]) if (k < w / 2 - 0.35) { PROPS.desk(p, sx * k, z, Math.PI); PROPS.stool(p, sx * k, z + 0.36, '#64748B'); } },
  office(p, w, d) { for (const sx of [-1, 1]) { PROPS.desk(p, sx * (w / 2 - 0.6), -0.2, Math.PI); PROPS.desk(p, sx * (w / 2 - 0.6), 0.6, Math.PI); } PROPS.plant(p, -w / 2 + 0.3, -d / 2 + 0.35); },
  villa(p, w, d) { PROPS.rug(p, -0.9, 0.2, 1.2, 0.9, '#FCD34D'); PROPS.sofa(p, -0.9, -0.2, '#EA580C'); p.add(mesh(box(0.8, 0.22, 1.0), mat('#F8FAFC'), 1.15, 0.11, 0.1), mesh(box(0.8, 0.12, 0.25), mat('#94A3B8'), 1.15, 0.28, -0.35)); PROPS.plant(p, -w / 2 + 0.3, 0.9); },
  home(p, w, d) { PROPS.rug(p, -0.8, 0.3, 1.1, 1.0, '#FDE68A'); PROPS.crib(p, 1.0, -0.4); PROPS.blocks(p, -0.9, 0.3); PROPS.sofa(p, -0.9, -0.6, '#A78BFA'); },
  community(p, w, d) { COMM.forEach(([x, z], i) => PROPS.stool(p, x, z, ['#22C55E', '#EAB308', '#3B82F6', '#EF4444'][i % 4])); PROPS.plant(p, w / 2 - 0.35, -d / 2 + 0.35); },
  library(p, w, d) { PROPS.stool(p, 0.9, -0.08, '#64748B'); PROPS.shelf(p, -w / 2 + 0.25, -0.2, Math.PI / 2); PROPS.shelf(p, -w / 2 + 0.25, 0.8, Math.PI / 2); PROPS.shelf(p, w / 2 - 0.25, 0.3, -Math.PI / 2); p.add(mesh(box(0.8, 0.4, 0.5), mat('#B98A55'), 0.9, 0.2, -0.5)); },
  lab(p, w, d) { PROPS.rack(p, -w / 2 + 0.35, -0.3); PROPS.rack(p, -w / 2 + 0.35, 0.3); PROPS.rack(p, w / 2 - 0.35, -0.3); PROPS.desk(p, 1.1, 0.6, Math.PI); },
  hall(p, w, d) { [-2, -1.3, 1.3, 2].forEach((x, i) => Math.abs(x) < w / 2 - 0.2 && PROPS.trophy(p, x, -0.6 + (i % 2) * 0.9, 1 + (i % 2) * 0.4)); PROPS.rug(p, 0, 0.4, 1.2, 1.3, '#B91C1C'); },
  terminal(p, w, d) { PROPS.seats(p, -w / 2 + 0.3, 0.6, 3); PROPS.seats(p, w / 2 - 0.86, 0.6, 3); PROPS.plant(p, w / 2 - 0.3, -d / 2 + 0.35); },
  garage(p, w, d) { PROPS.car(p, -0.75, -0.1, '#E11D48', 0.3); PROPS.car(p, 0.85, 0.5, '#F8FAFC', -0.4); },
  fair(p, w, d) { ['#84CC16', '#3B82F6', '#F97316', '#A855F7'].forEach((c, i) => PROPS.booth(p, (i < 2 ? -1 : 1) * (w / 2 - 0.55), -0.6 + (i % 2) * 1.0, c)); },
};
// Who is in each room: [x, z, facing (0 = +z), pose, seat height]. Facing a point: Math.atan2(dx, dz).
const toward = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
const OCC = {
  campus: (w) => { const a = []; for (const sx of [-1, 1]) for (const z of [-0.35, 0.45]) for (const k of [0.75, 1.45]) if (k < w / 2 - 0.35) a.push([sx * k, z + 0.36, Math.PI, 'sit-work', 0.24]); return a.filter((_, i) => i % 3 !== 2); },
  office: (w) => [[-(w / 2 - 0.6), -0.56, 0, 'sit-work', 0.265], [w / 2 - 0.6, -0.56, 0, 'sit-work', 0.265], [w / 2 - 0.6, 0.24, 0, 'sit-work', 0.265]],
  villa: () => [[-1.1, -0.1, 0, 'sit', 0.2], [-0.7, -0.1, 0, 'sit-eat', 0.2], [1.15, 0.85, Math.PI, 'talk']],
  home: () => [[0.5, -0.35, Math.PI / 2, 'stand'], [-0.9, -0.5, 0, 'sit', 0.2], [-0.5, 0.55, -Math.PI / 2, 'stand', null, 0.32]],
  community: () => COMM.map(([x, z]) => [x, z, toward(x, z, 0, -0.85), 'sit', 0.24]),
  library: (w) => [[-w / 2 + 0.7, -0.2, -Math.PI / 2, 'stand']],
  lab: (w) => [[1.1, 0.24, 0, 'sit-work', 0.265], [-w / 2 + 0.75, 0, -Math.PI / 2, 'stand']],
  hall: () => [[-1.3, 0.3, Math.PI, 'stand'], [1.3, 0.75, Math.PI, 'talk']],
  terminal: (w) => [[-w / 2 + 0.3, 0.6, 0, 'sit', 0.22], [-w / 2 + 0.86, 0.6, 0, 'sit-eat', 0.22], [w / 2 - 0.58, 0.6, 0, 'sit', 0.22]],
  garage: () => [[0.1, -0.7, 0.4, 'talk'], [0.55, -0.25, -2.4, 'stand']],
  fair: (w) => [[-(w / 2 - 0.55) + 0.55, -0.6, toward(-(w / 2 - 0.55) + 0.55, -0.6, -0.6, -0.15), 'talk'], [w / 2 - 1.1, 0.4, Math.PI / 2, 'talk'], [0.5, 0.75, Math.PI, 'stand']],
};
// Where Tanmay goes in each kind of room, and what he does there (aisle = walk the centre aisle first, so he never cuts through desks)
const MESPOT = {
  campus: () => ({ at: [0.75, 0.01], face: Math.PI, mode: 'sit-work', seat: 0.24, aisle: true }),      // a desk in the class, facing the professor
  office: (w) => ({ at: [-(w / 2 - 0.6), 0.24], face: 0, mode: 'sit-work', seat: 0.265, aisle: true }), // his own desk
  library: () => ({ at: [0.9, -0.08], face: Math.PI, mode: 'sit-work', seat: 0.24, aisle: true }),       // reading at the table
  lab: () => ({ at: [1.1, 0.24], face: 0, mode: 'sit-work', seat: 0.265, aisle: true }),
  terminal: (w) => ({ at: [w / 2 - 0.86, 0.6], face: 0, mode: 'sit', seat: 0.22, aisle: true }),         // waiting at the gate
  community: (w, d) => ({ at: [0, -d / 2 + 0.75], face: 0, mode: 'present' }),                          // he leads the workshop
  villa: () => ({ at: [0.2, 0.35], face: -0.7, mode: 'talk' }),                                         // hosting guests
  home: () => ({ at: [0.15, 0.2], face: 2.2, mode: 'talk' }),
  hall: () => ({ at: [0, 0.15], face: Math.PI, mode: 'stand' }),
  garage: () => ({ at: [-0.2, 0.65], face: 2.4, mode: 'talk' }),                                       // consulting by the cars
  fair: (w) => ({ at: [-0.6, -0.15], face: toward(-0.6, -0.15, -(w / 2 - 0.55) + 0.55, -0.6), mode: 'talk' }),   // pitching to a recruiter
};
const meSpot = z => z.shape ? { at: [0, z.d / 2 + 0.45], face: Math.PI, mode: 'stand', outside: true } : MESPOT[z.room](z.w, z.d);
const nameTags = [];                                                     // professors and other named people, shown when their building opens
function room(z, g) {
  const { w, d, h } = z, H = h * 0.85, inside = new THREE.Group(), props = new THREE.Group();
  inside.position.y = 0.16; inside.visible = false; inside.add(props); g.add(inside);
  const wallM = mat('#E2E8F0', 'iwall'), trim = mat(z.color);
  inside.add(mesh(box(w - 0.06, 0.04, d - 0.06), mat('#F1E6D2', 'ifloor'), 0, -0.02, 0, false));
  inside.add(mesh(box(w, H, 0.08), wallM, 0, H / 2, -d / 2 + 0.04), mesh(box(0.08, H, d), wallM, -w / 2 + 0.04, H / 2, 0),   // the two far walls stay tall
    mesh(box(w, 0.06, 0.1), trim, 0, H, -d / 2 + 0.04), mesh(box(0.1, 0.06, d), trim, -w / 2 + 0.04, H, 0),
    mesh(box(w, 0.28, 0.08), wallM, 0, 0.14, d / 2 - 0.04), mesh(box(0.08, 0.28, d), wallM, w / 2 - 0.04, 0.14, 0));   // near walls cut low
  ROOMS[z.room](props, w, d);
  const bh = Math.min(1.05, H * 0.55), bw = Math.min(bh * 2, w * 0.62);
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const board = { ctx: c.getContext('2d'), tex, key: '' };
  inside.add(mesh(box(bw + 0.08, bw / 2 + 0.08, 0.03), trim, 0, H * 0.55, -d / 2 + 0.1, false));
  inside.add(mesh(new THREE.PlaneGeometry(bw, bw / 2), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }), 0, H * 0.55, -d / 2 + 0.12, false));
  const mine = meSpot(z).at;
  const seatPeople = [...(OCC[z.room]?.(w, d) || []).filter(([x, zz]) => Math.hypot(x - mine[0], zz - mine[1]) > 0.25).map(([x, zz, face, mode, seat, scale]) => ({ at: [x, zz], face, mode, seat, scale })), ...(z.people || []).map(pp => pp.board ? { ...pp, at: [-(bw / 2 + 0.25), -d / 2 + 0.42], face: 0.35, mode: pp.mode || 'present' } : { ...pp, face: toward(pp.at[0], pp.at[1], mine[0], mine[1]) })];   // teachers stand at the board; others turn to Tanmay
  for (const pp of seatPeople) {
    const f = person(pp.scale || 0.5, pp); f.g.position.set(pp.at[0], pp.seat != null ? sitY(f, pp.seat) : 0, pp.at[1]); f.g.rotation.y = pp.face ?? 0;
    inside.add(f.g); crowd.push({ f, mode: pp.mode || 'stand', ph: rnd() * 20, rate: 2.2, zone: z.id });
    if (pp.name) nameTags.push({ zone: z.id, name: pp.name, note: pp.note || '', anchor: at(z.x + pp.at[0], z.z + pp.at[1], 0.95) });
  }
  return { inside, board };
}
function vehicle(c, rick) {                                             // low-poly car or auto-rickshaw, nose along +x
  const g = new THREE.Group();
  const wheel = (x, zz, r = 0.09) => { const w = mesh(new THREE.CylinderGeometry(r, r, 0.06, 12), mat('#111827'), x, r, zz); w.rotation.x = Math.PI / 2; g.add(w); };
  if (rick) {
    g.add(mesh(box(0.55, 0.24, 0.4), mat('#FACC15'), 0, 0.22, 0), mesh(box(0.3, 0.2, 0.36), mat('#16A34A'), -0.1, 0.44, 0), mesh(box(0.6, 0.05, 0.44), mat('#111827'), -0.03, 0.56, 0));
    wheel(0.22, 0); wheel(-0.2, 0.18); wheel(-0.2, -0.18);
  } else {
    g.add(mesh(box(0.9, 0.2, 0.42), mat(c), 0, 0.18, 0), mesh(box(0.5, 0.17, 0.38), mat('#CBD5E1'), -0.05, 0.36, 0));
    for (const [x, zz] of [[0.28, 0.2], [-0.28, 0.2], [0.28, -0.2], [-0.28, -0.2]]) wheel(x, zz);
  }
  return g;
}

/* ---------- Landmarks: Berlin Wall + Eiffel Tower in place of a building ---------- */
function landmarks(z, g, wallMat) {
  const { w } = z;
  g.add(mesh(box(w, 0.1, z.d), mat('#94A3B8'), 0, 0.05, 0));
  let body;
  for (let i = 0; i < 4; i++) {
    const x = -w / 2 + 0.6 + i * 0.92, seg = mesh(box(0.88, 1.2, 0.2), wallMat, x, 0.7, 0.55); g.add(seg); body ??= seg;
    const cap = mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.88, 10), wallMat, x, 1.3, 0.55); cap.rotation.z = Math.PI / 2; g.add(cap);
    g.add(mesh(box(0.6, 0.3, 0.01), mat(['#EF4444', '#3B82F6', '#22C55E', '#EAB308'][i]), x, 0.75, 0.66, false), mesh(box(0.3, 0.18, 0.01), mat(['#F472B6', '#FDE047', '#38BDF8', '#A78BFA'][i]), x + 0.12, 1.0, 0.661, false));
  }
  const tower = new THREE.Group(); tower.position.set(w / 2 - 1.1, 0.1, -0.4); g.add(tower);
  const iron = mat('#8B6F47');
  for (const [rt, rb, hh, y] of [[0.34, 0.8, 0.9, 0.45], [0.15, 0.32, 1.0, 1.45], [0.02, 0.14, 1.1, 2.5]]) { const f = mesh(new THREE.CylinderGeometry(rt, rb, hh, 4), iron, 0, y, 0); f.rotation.y = Math.PI / 4; tower.add(f); }
  tower.add(mesh(box(0.85, 0.06, 0.85), iron, 0, 0.92, 0), mesh(box(0.4, 0.05, 0.4), iron, 0, 1.96, 0));
  for (const [x, zz, fc] of [[-0.6, 1.2, Math.PI], [0.9, 1.15, -2.6]]) { const f = person(0.55); f.g.position.set(x, 0.1, zz); f.g.rotation.y = fc; g.add(f.g); crowd.push({ f, mode: 'stand', ph: rnd() * 9, rate: 2 }); }   // tourists
  return body;
}

/* ---------- Construction: chapters Tanmay has not reached yet are building sites ---------- */
const scaffoldM = new THREE.MeshStandardMaterial({ color: '#F59E0B', roughness: 0.7 }), craneM = mat('#FACC15', 'crane');
function site(w, d, h, g) {
  const sc = new THREE.Group(); g.add(sc);
  const bars = [], W = w / 2 + 0.14, D = d / 2 + 0.14, H = h + 0.25;
  for (let x = -W; x <= W + 0.01; x += (2 * W) / Math.max(2, Math.round(2 * W / 0.9))) for (const zz of [-D, D]) bars.push([x, H / 2, zz, 0.04, H, 0.04]);
  for (let zz = -D; zz <= D + 0.01; zz += (2 * D) / Math.max(2, Math.round(2 * D / 0.9))) for (const x of [-W, W]) bars.push([x, H / 2, zz, 0.04, H, 0.04]);
  for (const y of [H * 0.34, H * 0.67, H]) { for (const zz of [-D, D]) bars.push([0, y, zz, 2 * W, 0.04, 0.04]); for (const x of [-W, W]) bars.push([x, y, 0, 0.04, 0.04, 2 * D]); }
  const im = new THREE.InstancedMesh(box(1, 1, 1), scaffoldM, bars.length), o3 = new THREE.Object3D();
  bars.forEach(([x, y, zz, sx, sy, sz], i) => { o3.position.set(x, y, zz); o3.scale.set(sx, sy, sz); o3.updateMatrix(); im.setMatrixAt(i, o3.matrix); }); im.castShadow = true; sc.add(im);
  sc.add(mesh(box(w + 0.7, 0.02, d + 0.7), mat('#A16207', 'dirt'), 0, 0.012, 0, false));
  let jib = null;
  if (w >= 4) {                                                         // tower crane on the bigger sites
    const mh = h + 2.3, mx = -W - 0.4, mz = -D - 0.3;
    sc.add(mesh(box(0.16, mh, 0.16), craneM, mx, mh / 2, mz));
    jib = new THREE.Group(); jib.position.set(mx, mh, mz); sc.add(jib);
    jib.add(mesh(box(w + 1.4, 0.1, 0.1), craneM, (w + 1.4) / 2 - 0.4, 0, 0), mesh(box(0.45, 0.25, 0.25), mat('#475569'), -0.55, -0.05, 0), mesh(box(0.015, 1.1, 0.015), mat('#1F2937'), w * 0.65, -0.55, 0), mesh(box(0.14, 0.1, 0.14), mat('#1F2937'), w * 0.65, -1.12, 0));
  }
  return { sc, jib };
}

/* ---------- Zones: buildings whose shell fades and roof lifts to reveal the room inside ---------- */
const pickables = [], objects = {};
for (const z of WORLD.zones) {
  const { id, x, z: zz, w, d, h, roof = 'hip', color } = z;
  const g = new THREE.Group(); g.position.copy(at(x, zz)); scene.add(g);
  const shellMats = [], sm = c => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, transparent: true }); shellMats.push(m); return m; };
  const ext = new THREE.Group(); g.add(ext);
  let o;
  if (z.shape === 'landmarks') {
    const body = landmarks(z, ext, new THREE.MeshStandardMaterial({ color: '#9CA3AF', roughness: 0.9 }));
    o = objects[id] = { group: g, body, ext, size: new THREE.Vector3(w, 1.4, d), top: at(x, zz, 3.4), baseTop: 3.4, r: Math.max(w, d) * 0.7, open: 0 };
  } else {
    g.add(mesh(box(w + 0.2, 0.14, d + 0.2), mat('#D6CCBA'), 0, 0.07, 0));                // plinth stays when the building opens
    const roofG = new THREE.Group(); ext.add(roofG);
    const body = mesh(box(w, h, d), sm(z.wall || '#F6F1E8'), 0, h / 2, 0); ext.add(body);
    const glass = glowAtNight(sm('#9CC3DE'));
    for (let i = 0; i < Math.floor(w / 0.9); i++) ext.add(mesh(box(0.42, h * 0.32, 0.04), glass, -w / 2 + 0.45 + i * 0.9 + (w % 0.9) / 2, h * 0.55, d / 2 + 0.02, false));
    for (let i = 0; i < Math.floor(d / 0.9); i++) ext.add(mesh(box(0.04, h * 0.32, 0.42), glass, w / 2 + 0.02, h * 0.55, -d / 2 + 0.45 + i * 0.9 + (d % 0.9) / 2, false));
    ext.add(mesh(box(0.5, h * 0.45, 0.05), sm('#6B5A48'), 0, h * 0.225, d / 2 + 0.03, false)); // door, faces +z
    let top;
    if (roof === 'flat') { roofG.add(mesh(box(w + 0.16, 0.18, d + 0.16), sm(color), 0, h + 0.09, 0)); top = h + 0.18; }
    else { const geo = new THREE.ConeGeometry(1, Math.min(w, d) * 0.45, 4); geo.rotateY(Math.PI / 4); const r = mesh(geo, sm(color), 0, h + Math.min(w, d) * 0.225, 0); r.scale.set(w / 1.414 * 1.12, 1, d / 1.414 * 1.12); roofG.add(r); top = h + Math.min(w, d) * 0.45; }
    const signM = new THREE.MeshBasicMaterial({ map: signTexture(z.name, color), transparent: true }); shellMats.push(signM);
    ext.add(mesh(new THREE.PlaneGeometry(Math.min(w * 0.8, 3), 0.5), signM, 0, h * 0.86, d / 2 + 0.05, false));
    o = objects[id] = { group: g, body, ext, roofG, shellMats, size: new THREE.Vector3(w, h, d), top: at(x, zz, top + 0.3), baseTop: top + 0.3, r: Math.max(w, d) * 0.75, open: 0 };
    if (z.room) o.room = room(z, g);
  }
  Object.assign(o, site(w, d, z.shape ? 2.6 : h, g), { built: false, bk: 0 });
  g.traverse(m => { if (m.isMesh) { m.userData.id = id; pickables.push(m); } });
}
function showOnBoard(id, kicker, title, text) {
  const b = objects[id]?.room?.board, key = kicker + title; if (!b || b.key === key) return;
  b.key = key; drawBoard(b, ZONE[id].color, kicker, title, text);
}

/* ---------- Nature: collision-aware seeded scatter per island (never on paths, zones, fillers or solid areas) ---------- */
const blockers = [...WORLD.zones.map(o => [o.x - o.w / 2, o.z - o.d / 2, o.w, o.d]), ...(WORLD.paths || []), ...(WORLD.areas || []).filter(a => a[5]), ...(WORLD.fillers || []).map(([x, z, w, d]) => [x, z, w, d])];
const blocked = (x, z, pad) => blockers.some(([bx, bz, bw, bd]) => x > bx - pad && x < bx + bw + pad && z > bz - pad && z < bz + bd + pad);
const trees = [];
for (const s of WORLD.islands) for (let n = 0, tries = 0; n < s.trees && tries < 5000; tries++) {
  const x = s.x + 0.7 + rnd() * (s.w - 1.4), z = s.z + 0.7 + rnd() * (s.d - 1.4);
  if (!blocked(x, z, 0.9) && trees.every(([a, b]) => Math.hypot(a - x, b - z) > 1.3)) { trees.push([x, z]); n++; }
}
const inst = (geo, m, list, fn, shadow = true) => {
  const im = new THREE.InstancedMesh(geo, m, list.length); im.castShadow = shadow; im.receiveShadow = true;
  const o = new THREE.Object3D(); list.forEach((v, i) => { o.position.set(0, 0, 0); o.scale.set(1, 1, 1); const col = fn(o, v, i); o.updateMatrix(); im.setMatrixAt(i, o.matrix); if (col) im.setColorAt(i, new THREE.Color(col)); });
  scene.add(im); return im;
};
const white = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.9, flatShading: true }); // instance colours tint it
inst(new THREE.CylinderGeometry(0.08, 0.12, 0.8, 6), mat('#7A5A3E'), trees, (o, [x, z]) => { o.position.copy(at(x, z, 0.4)); });
inst(new THREE.IcosahedronGeometry(0.62, 0), white, trees, (o, [x, z]) => { o.position.copy(at(x, z, 1.15)); o.scale.setScalar(0.8 + rnd() * 0.5); return WORLD.colors.foliage[Math.floor(rnd() * WORLD.colors.foliage.length)]; });

/* ---------- Streets: polylines shared by Tanmay, pedestrians, traffic and street lamps ---------- */
function prepLine(R) { const RL = [0]; for (let i = 1; i < R.length; i++) RL.push(RL[i - 1] + Math.hypot(R[i][0] - R[i - 1][0], R[i][1] - R[i - 1][1])); return { R, RL }; }
function along({ R, RL }, s) {                                         // point + unit direction at distance s
  s = clamp(s, 0, RL.at(-1)); let i = 0; while (i < R.length - 2 && RL[i + 1] < s) i++;
  const L = RL[i + 1] - RL[i] || 1, k = (s - RL[i]) / L, dx = (R[i + 1][0] - R[i][0]) / L, dz = (R[i + 1][1] - R[i][1]) / L;
  return { x: R[i][0] + dx * L * k, z: R[i][1] + dz * L * k, dx, dz };
}
const STREETS = [{ line: prepLine(WORLD.tour.legs[0].route), side: -1, rick: true }, { line: prepLine(WORLD.tour.legs[2].route), side: 1, rick: false }];   // India drives on the left, Germany on the right
const lampM = glowAtNight(new THREE.MeshStandardMaterial({ color: '#FEF3C7', roughness: 0.5 }), '#FFD27A', 1.6), lamps = [];
for (const { line } of STREETS) for (let s = 1.2, k = 0; s < line.RL.at(-1); s += 3.4, k++) { const p = along(line, s), side = k % 2 ? 1 : -1; lamps.push([p.x - p.dz * 0.95 * side, p.z + p.dx * 0.95 * side]); }
inst(new THREE.CylinderGeometry(0.03, 0.04, 1.3, 6), mat('#475569'), lamps, (o, [x, z]) => { o.position.copy(at(x, z, 0.65)); });
inst(new THREE.SphereGeometry(0.1, 10, 8), lampM, lamps, (o, [x, z]) => { o.position.copy(at(x, z, 1.33)); }, false);
const movers = [];                                                       // pedestrians and vehicles going back and forth along a street
for (const st of STREETS) {
  const L = st.line.RL.at(-1);
  for (let i = 0; i < (st.rick ? 10 : 6); i++) { const f = person(0.58); scene.add(f.g); movers.push({ f, st, s: rnd() * L, dir: rnd() < 0.5 ? 1 : -1, v: 0.55 + rnd() * 0.3, off: (rnd() < 0.5 ? -1 : 1) * 0.6, ph: rnd() * 9 }); }
  for (let i = 0; i < (st.rick ? 6 : 3); i++) { const g = vehicle(pick(['#DC2626', '#2563EB', '#F8FAFC', '#111827', '#16A34A', '#9CA3AF']), st.rick && i % 2 === 0); g.scale.setScalar(0.85); scene.add(g); movers.push({ g, st, s: rnd() * L, dir: rnd() < 0.5 ? 1 : -1, v: 1.3 + rnd() * 0.6, car: true }); }
}
function stepMovers(dt) {
  for (const m of movers) {
    const L = m.st.line.RL.at(-1); m.s += m.dir * m.v * dt;
    if (m.s > L) { m.s = L; m.dir = -1; } if (m.s < 0) { m.s = 0; m.dir = 1; }
    const p = along(m.st.line, m.s), dx = p.dx * m.dir, dz = p.dz * m.dir;
    const off = m.car ? 0.32 * m.st.side : m.off;                       // cars keep to their lane, people to the pavement edge
    const pos = at(p.x - dz * off, p.z + dx * off);
    if (m.car) { m.g.position.copy(pos); m.g.rotation.y = Math.atan2(-dz, dx); }
    else { m.f.g.position.copy(pos); m.f.g.rotation.y = Math.atan2(dx, dz); m.ph += dt * 6; pose(m.f, 'walk', m.ph); }
  }
}
/* ---------- Tanmay ---------- */
const yaw = (dx, dz) => Math.atan2(-dz, dx);                                        // the plane faces +x
const face = (dx, dz) => Math.atan2(dx, dz);                                        // people face +z
const me = makeFigure('#3B82F6', 0.62, '#1E293B', '#C68B5E', '#1A1410', 'short');
scene.add(me.g); let mePose = 'stand', mePh = 0;
const meAnchor = new THREE.Vector3();
const spot = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.6, 48), new THREE.MeshBasicMaterial({ color: WORLD.colors.accent, transparent: true, opacity: 0.6, depthWrite: false }));
spot.rotation.x = -Math.PI / 2; scene.add(spot);

/* ---------- The plane: parked at an airport, flies Tanmay between islands ---------- */
const plane = new THREE.Group(); scene.add(plane);
{ const wht = mat('#F8FAFC'), blue = mat('#3B82F6'), vio = mat('#7C3AED');
  const body = mesh(new THREE.CylinderGeometry(0.2, 0.17, 2.0, 14), wht, 0, 0, 0); body.rotation.z = Math.PI / 2;
  const nose = mesh(new THREE.SphereGeometry(0.2, 14, 10), wht, 1.0, 0, 0); nose.scale.set(1.6, 1, 1);
  plane.add(body, nose, mesh(box(1.9, 0.05, 0.41), blue, 0, -0.04, 0, false),
    mesh(box(0.6, 0.05, 2.5), wht, 0.1, -0.05, 0), mesh(box(0.4, 0.05, 0.9), wht, -0.9, 0.06, 0), mesh(box(0.42, 0.5, 0.05), vio, -0.88, 0.3, 0));
  for (const s of [-0.65, 0.65]) { const e = mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 10), mat('#94A3B8'), 0.2, -0.15, s); e.rotation.z = Math.PI / 2; plane.add(e); }
}
plane.scale.setScalar(1.6);
const AIR = WORLD.tour.airports;
const parkPlane = code => { const a = AIR[code]; plane.position.copy(at(a.park[0], a.park[1], 0.4)); plane.rotation.set(0, yaw(a.dir[0], a.dir[1]), 0); };
parkPlane('in');

/* ---------- Flight: take-off run → rotate and climb → banked cruise → approach → touchdown → rollout ---------- */
const bez = (a, c1, c2, b, u) => { const v = 1 - u; return a.clone().multiplyScalar(v * v * v).addScaledVector(c1, 3 * v * v * u).addScaledVector(c2, 3 * v * u * u).addScaledVector(b, u * u * u); };
function flightPlan(f, t) {
  const A = AIR[f], B = AIR[t], P = (c, y) => at(c[0], c[1], y), G = 0.4;              // G = wheels on the runway
  const dA = P(A.roll, 0).sub(P(A.park, 0)).normalize(), dB = P(B.touch, 0).sub(P(B.approach, 0)).normalize();
  const c0 = P(A.climb, 3), c3 = P(B.approach, 3.2), D = Math.min(c0.distanceTo(c3) * 0.38, 20);
  return [
    { kind: 'takeoff', a: P(A.park, G), b: P(A.roll, G), dur: 3.2, ease: 'in' },        // accelerate down the runway
    { kind: 'takeoff', a: P(A.roll, G), b: c0, dur: 1.9 },                               // lift off and climb out straight ahead
    { kind: 'cruise', a: c0, c1: c0.clone().addScaledVector(dA, D).setY(8.5), c2: c3.clone().addScaledVector(dB, -D).setY(8.5), b: c3, dur: 8 },
    { kind: 'landing', a: c3, b: P(B.touch, G), dur: 2.4 },                              // line up and descend onto the runway
    { kind: 'landing', a: P(B.touch, G), b: P(B.park, G), dur: 2.8, ease: 'out' },      // brake to a stop
  ];
}
const planeFwd = new THREE.Vector3();
function stepFlight(dt) {                                                           // true once the plane has stopped at the gate
  const fl = tour.fl; if (dt <= 0) return false;
  if (reduceMotion) { fl.k = fl.segs.length - 1; fl.t = fl.segs[fl.k].dur; }
  fl.t += dt; let sg = fl.segs[fl.k];
  while (fl.t >= sg.dur && fl.k < fl.segs.length - 1) { fl.t -= sg.dur; sg = fl.segs[++fl.k]; }
  if (sg.kind !== fl.kind) { fl.kind = sg.kind; refresh(); }
  let u = clamp(fl.t / sg.dur, 0, 1); u = sg.ease === 'in' ? u * u : sg.ease === 'out' ? 1 - (1 - u) * (1 - u) : u;
  const pos = sg.c1 ? bez(sg.a, sg.c1, sg.c2, sg.b, u) : sg.a.clone().lerp(sg.b, u), dv = pos.clone().sub(plane.position);
  const flat = Math.hypot(dv.x, dv.z);
  if (flat > 1e-4) {
    const want = yaw(dv.x, dv.z), turn = Math.atan2(Math.sin(want - plane.rotation.y), Math.cos(want - plane.rotation.y));
    plane.rotation.y += turn * Math.min(1, dt * 10);
    const pitch = pos.y > 0.45 || sg.kind === 'takeoff' && fl.k === 0 && u > 0.85 ? Math.atan2(dv.y, flat) + (fl.k === 0 ? 0.12 * (u - 0.85) / 0.15 : 0) : 0;   // nose up at rotation
    plane.rotation.z += (pitch - plane.rotation.z) * Math.min(1, dt * 6);
    const bank = pos.y > 1.2 ? clamp(-turn / dt * 0.18, -0.55, 0.55) : 0;           // bank into turns once airborne
    plane.rotation.x += (bank - plane.rotation.x) * Math.min(1, dt * 3);
  }
  plane.position.copy(pos); me.g.position.copy(pos);
  return fl.k === fl.segs.length - 1 && fl.t >= sg.dur;
}
plane.rotation.order = 'YZX';

/* ---------- The journey: legs of walking (street polyline + stops) and flights between countries ---------- */
function prepLeg(l) {
  const leg = { ...l, ...prepLine(l.route) };
  leg.stops = l.stops.map(item => {
    const spec = typeof item === 'string' ? { id: item } : item, z = ZONE[spec.id];
    const door = [z.x, z.z + z.d / 2 + 0.45];
    const sp = meSpot(z);
    return { z, door, sp, in: sp.outside ? door : [z.x + sp.at[0], z.z + sp.at[1]], aisle: sp.aisle ? [z.x, z.z + sp.at[1], 0.16] : null, s: spec.at === 'end' ? leg.RL.at(-1) : routeS(leg, ...door), beats: spec.inside || z.inside || [[z.name, z.step]] };
  });
  const f = ZONE[l.from]; leg.fromS = f ? routeS(leg, f.x, f.z + f.d / 2 + 0.45) : 0;   // where the leg starts (e.g. the arrival airport)
  return leg;
}
function routeAt(leg, s) { const p = along(leg, s); return [p.x, p.z]; }
function routeS({ R, RL }, x, z) {                                                 // distance along the route of its closest point
  let best = [Infinity, 0];
  for (let i = 0; i < R.length - 1; i++) {
    const [ax, az] = R[i], [bx, bz] = R[i + 1], L = RL[i + 1] - RL[i];
    const k = clamp(((x - ax) * (bx - ax) + (z - az) * (bz - az)) / (L * L), 0, 1);
    const dd = Math.hypot(ax + (bx - ax) * k - x, az + (bz - az) * k - z);
    if (dd < best[0]) best = [dd, RL[i] + k * L];
  }
  return best[1];
}
const LEGS = WORLD.tour.legs.map(l => l.fly ? l : prepLeg(l));
const STEPS = LEGS.reduce((n, l) => n + (l.fly ? 1 : l.stops.length), 0);
const stepBase = li => LEGS.slice(0, li).reduce((n, l) => n + (l.fly ? 1 : l.stops.length), 0);
const GSTOPS = LEGS.flatMap((l, li) => l.fly ? [] : l.stops.map((st, i) => ({ li, i, st })));        // every stop in order
const gIndex = (li, i) => GSTOPS.findIndex(e => e.li === li && e.i === i);
const BEAT = WORLD.tour.beat || 6;

const tour = { leg: 0, i: 0, phase: 'walk', beat: 0, beatT: 0, here: null, fromS: 0, paused: false, path: null, L: null, s: 0, u: 0 };
const SIM = { speed: 1, dayPh: 0.12 };
const stop = () => LEGS[tour.leg].stops?.[tour.i];
function walk(cells) {                                                              // cells: [x, z] or [x, z, y]
  const pts = [me.g.position.clone(), ...cells.map(c => at(c[0], c[1], c[2] || 0))];
  const L = [0]; for (let k = 1; k < pts.length; k++) L.push(L[k - 1] + pts[k].distanceTo(pts[k - 1]));
  Object.assign(tour, { path: pts, L, s: reduceMotion ? L.at(-1) : 0 }); mePose = 'walk';
}
function stepWalk(dt) {                                                             // true once the walk is done
  const { path: p, L } = tour; tour.s = Math.min(L.at(-1), tour.s + 2.2 * dt);
  let i = 0; while (i < L.length - 2 && L[i + 1] < tour.s) i++;
  me.g.position.lerpVectors(p[i], p[i + 1], (tour.s - L[i]) / (L[i + 1] - L[i] || 1));
  const dv = p[i + 1].clone().sub(p[i]); if (dv.lengthSq() > 1e-6) me.g.rotation.y = face(dv.x, dv.z);
  return tour.s >= L.at(-1);
}
const exitFrom = st => st && !st.sp.outside ? [...(st.aisle ? [st.aisle] : []), st.door] : [];   // leave the way he came in
function startLeg(li) {
  const leg = LEGS[tour.leg = li];
  if (leg.fly) {                                                                    // walk out to the plane, then board
    const st = LEGS[li - 1].stops.at(-1), a = AIR[leg.fly[0]];
    walk([...exitFrom(st), a.park]); Object.assign(tour, { phase: 'board', here: null, lastStop: null }); refresh(); return;   // after boarding there is no building to walk out of
  }
  tour.fromS = leg.fromS;
  startStop(0);
}
function startStop(i) {
  const leg = LEGS[tour.leg], st = leg.stops[i], a = tour.fromS, b = st.s;
  const mid = leg.R.filter((_, k) => leg.RL[k] > a + 0.01 && leg.RL[k] < b - 0.01);
  Object.assign(tour, { i, phase: 'walk', here: null, fromS: b });
  walk([...exitFrom(tour.lastStop), routeAt(leg, a), ...mid, routeAt(leg, b), st.door, ...(st.aisle ? [st.aisle] : []), [...st.in, st.sp.outside ? 0 : 0.16]]);
  refresh();
}
function arrive() {
  const st = stop(), id = st.z.id;
  Object.assign(tour, { phase: 'dwell', beat: 0, beatT: 0, here: id, lastStop: st }); mePose = st.sp.mode;
  me.g.rotation.y = st.sp.face; if (st.sp.seat != null) me.g.position.y = 0.16 + sitY(me, st.sp.seat);   // sit down, or stand and take part
  build(id);
  if (!reached.has(id)) { reached.add(id); if (st.z.milestone) toast(st.z.milestone); }
  showBeat(); refresh();
}
function showBeat() { const st = stop(), [t, x] = st.beats[tour.beat]; showOnBoard(st.z.id, `${st.z.kicker} · ${tour.beat + 1}/${st.beats.length}`, t, x); }
function nextBeat() {
  if (++tour.beat < stop().beats.length) { tour.beatT = 0; showBeat(); refresh(); return; }
  if (tour.i < LEGS[tour.leg].stops.length - 1) startStop(tour.i + 1);
  else if (tour.leg < LEGS.length - 1) startLeg(tour.leg + 1);
  else { Object.assign(tour, { phase: 'end', beatT: 0, here: null }); mePose = 'stand'; toast('🎬 That is the journey so far. Starting again…'); refresh(); }
}
function updateTour(dt) {
  if (tour.phase === 'walk') {
    const left = tour.L.at(-1) - tour.s;
    if (left < 7) build(stop().z.id);                                               // the next chapter rises as he approaches
    if (left < 2.4) tour.here = stop().z.id;                                        // and its doors open
    if (stepWalk(dt)) arrive();
  } else if (tour.phase === 'dwell') { if ((tour.beatT += dt) >= BEAT) nextBeat(); }
  else if (tour.phase === 'board') {
    if (stepWalk(dt)) { me.g.visible = false; Object.assign(tour, { phase: 'fly', fl: { segs: flightPlan(...LEGS[tour.leg].fly), k: 0, t: 0, kind: 'takeoff' } }); refresh(); }
  } else if (tour.phase === 'fly') {
    if (stepFlight(dt)) { const t = LEGS[tour.leg].fly[1]; me.g.position.copy(plane.position).setY(0); me.g.visible = true; startLeg(tour.leg + 1); }
  } else if (tour.phase === 'end' && (tour.beatT += dt) >= 6) jumpTo(0);            // journey complete: start again
}
function skip() {
  if (tour.phase === 'dwell') nextBeat();
  else if (tour.phase === 'walk' || tour.phase === 'board') tour.s = tour.L.at(-1);
  else if (tour.phase === 'fly') { const f = tour.fl; f.k = f.segs.length - 1; f.t = f.segs[f.k].dur; }
}
// Jump to any stop: everything before it is built and counted, everything after goes back to a building site
const reached = new Set();
function jumpTo(g) {
  const { li, i } = GSTOPS[g], leg = LEGS[li];
  reached.clear(); for (const o of Object.values(objects)) { o.built = false; o.bk = 0; }
  GSTOPS.slice(0, g).forEach(e => { reached.add(e.st.z.id); Object.assign(objects[e.st.z.id], { built: true, bk: 1 }); });
  lastStats = null; $('#toasts').replaceChildren();
  parkPlane(li === 2 ? 'de' : 'in'); me.g.visible = true;
  const from = i > 0 ? leg.stops[i - 1].s : leg.fromS;
  me.g.position.copy(at(...routeAt(leg, from)));
  Object.assign(tour, { leg: li, fromS: from, paused: false, lastStop: null }); select(null); setFollow(true); startStop(i);
}
function build(id) { const o = objects[id]; if (o && !o.built) o.built = true; }

/* ---------- Live HUD: era, place, counters and the chapter timeline. Updates itself as the journey proceeds ---------- */
const hud = $('#hud'), toastsEl = $('#toasts');
function toast(msg) {
  const d = document.createElement('div'); d.className = 'toast'; d.textContent = msg; toastsEl.append(d);
  while (toastsEl.children.length > 3) toastsEl.firstChild.remove();
  setTimeout(() => d.classList.add('out'), 6500 / Math.sqrt(SIM.speed)); setTimeout(() => d.remove(), 7200 / Math.sqrt(SIM.speed));
}
let lastStats = null;
function stats() {
  const s = Object.fromEntries(WORLD.stats.map(([k, , , start = 0]) => [k, start]));
  for (const id of reached) for (const [k, v] of Object.entries(ZONE[id].gain || {})) { const def = WORLD.stats.find(d => d[0] === k); s[k] = def?.[4] === 'max' ? Math.max(s[k], v) : s[k] + v; }
  return s;
}
const CHAPTERS = GSTOPS.map((e, g) => ({ ...e, g })).filter(e => /^CHAPTER/.test(e.st.z.kicker || '') && !(typeof WORLD.tour.legs[e.li].stops[e.i] === 'object'));
function curG() { const l = LEGS[tour.leg]; return l.fly ? gIndex(tour.leg + 1, 0) : gIndex(tour.leg, tour.i); }
function renderHud() {
  const leg = LEGS[tour.leg], st = stop(), cg = curG();
  const era = tour.phase === 'end' ? '2017 → 2026' : leg.fly ? `✈ ${leg.title}` : st.z.era || '';
  const where = tour.phase === 'end' ? 'Journey complete' : leg.fly ? (leg.fly[1] === 'de' ? 'India → Germany' : 'Germany → India') : `${st.z.where || ''} · ${tour.phase === 'dwell' ? 'inside ' + st.z.name : 'walking to ' + st.z.name}`;
  const s = stats(), changed = lastStats ? Object.keys(s).filter(k => s[k] !== lastStats[k]) : []; lastStats = s;
  hud.innerHTML = `<div class="hudtop"><span class="era">${esc(era)}</span><span class="where">${esc(where)}</span><span class="sp"></span>
      <button data-sim="play" aria-label="Pause or play">${tour.paused ? '▶' : '❚❚'}</button><button data-sim="speed" aria-label="Speed">${SIM.speed}×</button>
      <button data-sim="follow" class="${follow ? 'on' : ''}" aria-pressed="${follow}">Follow</button><button data-sim="restart">↺</button>
      <button data-sim="theme" aria-label="Switch theme">${theme === 'light' ? '🌙 Dark' : '☀ Light'}</button></div>
    <div class="chips">${WORLD.stats.map(([k, icon, label]) => `<span class="${changed.includes(k) ? 'bump' : ''} ${s[k] ? '' : 'zero'}">${icon} ${k === 'community' ? (s[k] ? s[k].toLocaleString() + '+' : 0) : s[k]} ${label}</span>`).join('')}</div>
    <div class="tl" aria-label="Chapters">${CHAPTERS.map(c => `<button data-jump="${c.g}" class="${c.g < cg ? 'done' : c.g === cg ? 'cur' : ''}" title="${esc(c.st.z.kicker + ': ' + c.st.z.name)}" aria-label="${esc(c.st.z.name)}"></button>${c.st.z.id === 'gcl' ? '<span class="flag">✈</span>' : c.st.z.id === 'europe' ? '<span class="flag">✈</span>' : ''}`).join('')}</div>`;
  if (changed.length) setTimeout(() => hud.querySelectorAll('.chips .bump').forEach(e => e.classList.remove('bump')), 900);
  const r = hud.getBoundingClientRect(); toastsEl.style.top = `${r.bottom + 10}px`;
}
function refresh() { renderStory(); renderHud(); if (!selected) renderPanel(); }
hud.addEventListener('click', e => {
  const j = e.target.closest('[data-jump]'); if (j) return jumpTo(+j.dataset.jump);
  const a = e.target.closest('[data-sim]')?.dataset.sim;
  if (a === 'play') togglePause();
  if (a === 'speed') { SIM.speed = { 1: 2, 2: 4, 4: 1 }[SIM.speed]; refresh(); }
  if (a === 'follow') { if (!follow) select(null); setFollow(!follow); }
  if (a === 'restart') jumpTo(0);
  if (a === 'theme') applyTheme(theme === 'light' ? 'dark' : 'light');
});
function togglePause() { tour.paused = !tour.paused; refresh(); }
addEventListener('keydown', e => {
  if (e.target.closest('input, textarea, select')) return;
  if (e.code === 'Space') { e.preventDefault(); togglePause(); }
  if (e.key === 'f') { if (!follow) select(null); setFollow(!follow); }
});

let follow = false;                                                                 // camera follows Tanmay until the visitor takes over
function setFollow(on) { if (follow !== on) { follow = on; refresh(); } }
const storyEl = $('#story');
function renderStory() {
  const leg = LEGS[tour.leg], st = stop(), base = stepBase(tour.leg);
  let kicker, title, text, prog;
  if (tour.phase === 'end') { kicker = 'THE JOURNEY · COMPLETE'; title = 'Where technology and business meet'; text = "That's the story so far. Starting the walk again…"; prog = 1; }
  else if (leg.fly) { const kind = tour.phase === 'fly' ? tour.fl.kind : 'board'; kicker = { board: '✈ BOARDING', takeoff: '✈ TAKE-OFF', cruise: '✈ CRUISING', landing: '✈ LANDING' }[kind]; title = leg.title; text = kind === 'landing' ? `Final approach and touchdown in ${leg.fly[1] === 'de' ? 'Germany' : 'India'}.` : kind === 'takeoff' ? `Take-off run, rotate and climb out of ${leg.fly[0] === 'de' ? 'Germany' : 'India'}.` : leg.text; prog = (base + (tour.phase === 'fly' ? 0.5 : 0)) / STEPS; }
  else if (tour.phase === 'dwell') { const [t, x] = st.beats[tour.beat]; kicker = `${st.z.kicker} · ${tour.beat + 1}/${st.beats.length}`; title = t; text = x; prog = (base + tour.i + (tour.beat + 1) / st.beats.length) / STEPS; }
  else { kicker = `NEXT · ${st.z.kicker}`; title = st.z.name; text = st.z.step || ''; prog = (base + tour.i) / STEPS; }
  storyEl.innerHTML = `<small class="kicker">${esc(kicker)}</small><h3>${esc(title)}</h3><p>${esc(text)}</p>`
    + `<div class="bar"><b style="width:${(prog * 100).toFixed(1)}%"></b></div><div class="row">`
    + (tour.phase === 'end' ? '' : `<button class="btn" data-tour="next">Next ⏭</button>`)
    + (st && !leg.fly && tour.phase !== 'end' ? `<button class="btn ghost" data-tour="open">Details</button>` : '')
    + `<button class="btn ghost" data-tour="pause">${tour.paused ? '▶ Resume' : '❚❚ Pause'}</button>`
    + (follow ? '' : `<button class="btn ghost" data-tour="follow">◎ Follow</button>`) + '</div>';
}
document.addEventListener('click', e => {
  const a = e.target.closest('[data-tour]')?.dataset.tour;
  if (a === 'next') skip();
  if (a === 'open') select(stop().z.id);
  if (a === 'pause') togglePause();
  if (a === 'follow') { select(null); setFollow(true); }
});

/* ---------- Theme switch + day/night ---------- */
function applyTheme(name) {
  theme = name; localStorage.setItem('tw-theme', name);
  const T = THEMES[name]; document.body.classList.toggle('light', name === 'light');
  for (const [r, m] of Object.entries(TM)) m.color.set(T[r]);
  scene.fog.color.set(T.haze); hemi.groundColor.set(T.ground);
  lastNight = -1; if (hud.innerHTML) renderHud();
}
let lastNight = -1;
function dayNight(dt) {
  SIM.dayPh = (SIM.dayPh + dt / 100) % 1;                                          // one day every 100 s of journey time
  const ph = SIM.dayPh, night = sstep(0.62, 0.7, ph) * (1 - sstep(0.9, 0.98, ph));
  if (Math.abs(night - lastNight) < 0.005) return; lastNight = night;
  sun.intensity = 0.35 + 1.75 * (1 - night); hemi.intensity = 0.7 + 0.75 * (1 - night);
  sun.color.set(new THREE.Color('#FFF1DC').lerp(new THREE.Color('#9DB4FF'), night));
  for (const m of litMats) m.emissiveIntensity = night * 0.9 * (m.userData.k ?? 1);
  const T = THEMES[theme], mix = (a, b) => new THREE.Color(a).lerp(new THREE.Color(b), night).getStyle();
  document.documentElement.style.setProperty('--sky1', mix(T.sky[0], T.skyN[0])); document.documentElement.style.setProperty('--sky2', mix(T.sky[1], T.skyN[1]));
}

/* ---------- Selection: outline, bobbing pin, pulsing ring, smooth fly-to ---------- */
const ACCENT = WORLD.colors.accent;
const pin = new THREE.Group(), pinMat = new THREE.MeshStandardMaterial({ color: ACCENT, roughness: 0.4 });
{ const tip = mesh(new THREE.ConeGeometry(0.22, 0.55, 20), pinMat, 0, 0.36, 0); tip.rotation.x = Math.PI; pin.add(mesh(new THREE.SphereGeometry(0.28, 20, 14), pinMat, 0, 0.72, 0), tip); }
const marker = new THREE.Group(); marker.add(pin); marker.visible = false; scene.add(marker);
const ring = new THREE.Mesh(new THREE.RingGeometry(1, 1.1, 56), new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.6 }));
ring.rotation.x = -Math.PI / 2; ring.visible = false; scene.add(ring);
let outline = null, selected = null, anim = null;
const offset = () => camera.position.clone().sub(controls.target);
const tween = (toT, toZ, toOff = null) => { anim = { t: reduceMotion ? 1 : 0, fromT: controls.target.clone(), toT, fromZ: camera.zoom, toZ, fromOff: offset(), toOff }; };

function select(id) {
  if (id && !objects[id]) id = null;
  selected = id; if (id) setFollow(false);
  if (outline) { outline.parent.remove(outline); outline.geometry.dispose(); outline = null; }
  const o = objects[id], z = ZONE[id];
  ring.visible = marker.visible = !!o;
  if (o) {
    outline = new THREE.LineSegments(new THREE.EdgesGeometry(box(o.size.x + 0.14, o.size.y, o.size.z + 0.14)), new THREE.LineBasicMaterial({ color: ACCENT }));
    outline.position.y = o.size.y / 2; o.group.add(outline);
    ring.position.set(o.group.position.x, 0.04, o.group.position.z); ring.scale.setScalar(o.r);
    if (tour.here !== id) showOnBoard(id, z.kicker || '', z.name, z.blurb || z.step || '');
    tween(o.group.position.clone().setY(0), Math.max(camera.zoom, 2.4));
  }
  renderPanel();
  history.replaceState(null, '', id ? '#' + id : location.pathname);
}

/* ---------- Info panel (HTML card over the canvas) ---------- */
const panel = $('#panel');
function renderPanel() {
  const z = ZONE[selected];
  document.body.classList.toggle('psheet', !z);                                   // phones: the overview collapses to a bar
  panel.innerHTML = z
    ? `<small class="kicker" style="color:${z.color}">${esc(z.kicker || WORLD.title)}</small><h2>${esc(z.name)}</h2><p>${esc(z.blurb || '')}</p>
       ${z.facts ? `<dl>${z.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
       ${z.inside ? `<h4 class="kicker">WHAT HAPPENED HERE</h4><ol class="beats">${z.inside.map(([t, x]) => `<li><b>${esc(t)}</b><span>${esc(x)}</span></li>`).join('')}</ol>` : ''}
       <button class="btn" data-close>Back to overview</button>`
    : `<button class="ptog" data-ptog aria-label="Show or hide the chapter list">☰ Chapters <span>${reached.size} / ${WORLD.zones.length} built</span></button><small class="kicker">WELCOME</small><h2>${esc(WORLD.title)}</h2><p>${esc(WORLD.intro)}</p>
       ${WORLD.islands.map(s => `<h4 class="kicker"><button class="isle" data-isle="${s.id}">${esc(s.name)} ↗</button></h4><ul>${WORLD.zones.filter(o => o.x >= s.x && o.x <= s.x + s.w && o.z >= s.z && o.z <= s.z + s.d).map(o => `<li class="${reached.has(o.id) ? 'done' : ''}"><button data-select="${o.id}"><i style="background:${o.color}"></i>${esc(o.name)}<em>${reached.has(o.id) ? '✓ built' : o.id === tour.here || o.id === stop()?.z.id ? '● next' : '🔨'}</em></button></li>`).join('')}</ul>`).join('')}
       <p class="muted">Click any building · drag to pan · scroll to zoom · Space pauses</p>`;
}
document.addEventListener('click', e => {
  const isle = WORLD.islands.find(s => s.id === e.target.closest('[data-isle]')?.dataset.isle);
  if (isle) { select(null); setFollow(false); return tween(framed(at(isle.x + isle.w / 2, isle.z + isle.d / 2), 0.9), 0.9); }
  if (e.target.closest('[data-ptog]')) { document.body.classList.toggle('popen'); measured = 0; return; }
  const s = e.target.closest('[data-select]'); if (s) { document.body.classList.remove('popen'); return select(s.dataset.select); }
  if (e.target.closest('[data-close]')) { select(null); tween(framed(HOME, HOME_ZOOM), HOME_ZOOM, OFFSET.clone()); }
  const a = e.target.closest('[data-action]')?.dataset.action; if (a) setFollow(false);
  if (a === 'zoomin' || a === 'zoomout') tween(controls.target.clone(), THREE.MathUtils.clamp(camera.zoom * (a === 'zoomin' ? 1.3 : 1 / 1.3), controls.minZoom, controls.maxZoom));
  if (a === 'spin') tween(controls.target.clone(), camera.zoom, offset().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4));
  if (a === 'home') tween(framed(HOME, HOME_ZOOM), HOME_ZOOM, OFFSET.clone());
});
addEventListener('keydown', e => { if (e.key === 'Escape') select(null); });

/* ---------- Picking + hover ---------- */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
const pickAt = e => {
  const r = canvas.getBoundingClientRect();
  ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  return ray.intersectObjects(pickables, false).find(h => { for (let o = h.object; o; o = o.parent) if (!o.visible) return false; return true; })?.object.userData.id ?? null;
};
let down = null, hovered = null;
canvas.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; anim = null; });
canvas.addEventListener('pointerup', e => { if (down && Math.hypot(e.clientX - down[0], e.clientY - down[1]) < 5) select(pickAt(e)); down = null; }); // a click, not a drag
canvas.addEventListener('wheel', () => setFollow(false), { passive: true });
canvas.addEventListener('pointermove', e => {
  if (e.buttons) { if (down && Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) setFollow(false); return; }
  const id = pickAt(e); if (id === hovered) return;
  objects[hovered]?.body.material.emissive.set('#000000');
  hovered = id; objects[id]?.body.material.emissive.set(ACCENT).multiplyScalar(0.12);
  canvas.style.cursor = id ? 'pointer' : '';
});

/* ---------- HTML labels pinned to 3D anchors, decluttered every frame ---------- */
const labels = WORLD.zones.map(z => {
  const el = document.createElement('button'); el.type = 'button'; el.className = 'maplabel';
  el.innerHTML = `<i style="background:${z.color}"></i>${esc(z.name)}`;
  el.addEventListener('click', () => select(z.id)); $('#labels').append(el);
  return { id: z.id, el, anchor: objects[z.id].top, x: 0, y: 0, w: 0, h: 0 };
});
for (const s of WORLD.islands) {                                                    // island names: click to fly there
  const el = document.createElement('button'); el.type = 'button'; el.className = 'maplabel isle'; el.textContent = s.name;
  const c = at(s.x + s.w / 2, s.z + s.d / 2);
  el.addEventListener('click', () => { select(null); setFollow(false); tween(framed(c, 0.9), 0.9); }); $('#labels').append(el);
  labels.push({ id: 'isle-' + s.id, el, anchor: at(s.label[0], s.label[1], 0.6), x: 0, y: 0, w: 0, h: 0 });
}
for (const t of nameTags) {                                                         // professors: visible when their building is open
  const el = document.createElement('span'); el.className = 'maplabel person'; el.innerHTML = `${esc(t.name)}${t.note ? ` <small>${esc(t.note)}</small>` : ''}`; $('#labels').append(el);
  labels.push({ id: 'tag-' + t.zone + t.name, el, anchor: t.anchor, x: 0, y: 0, w: 0, h: 0, when: () => objects[t.zone].open > 0.7 });
}
{ const el = document.createElement('button'); el.type = 'button'; el.className = 'maplabel me'; el.textContent = 'Tanmay';
  el.addEventListener('click', () => { select(null); setFollow(true); }); $('#labels').append(el);
  labels.push({ id: 'me', el, anchor: meAnchor, x: 0, y: 0, w: 0, h: 0, when: () => me.g.visible || tour.phase === 'fly' }); }
let measured = 0, panels = [];
const prio = l => (l.id === selected) * 4 + (l.id === 'me') * 3 + (l.id.startsWith('tag-')) * 2;
function declutter() {             // priority labels first; hide any that would overlap a placed label, a UI card or the edge
  if (performance.now() - measured > 400) {
    measured = performance.now();
    for (const l of labels) { l.w = l.el.offsetWidth; l.h = l.el.offsetHeight; }
    panels = [...document.querySelectorAll('.card, .toast')].map(e => e.getBoundingClientRect()).filter(r => r.width);
  }
  const placed = [], cw = canvas.clientWidth, ch = canvas.clientHeight;
  for (const l of [...labels].sort((a, b) => prio(b) - prio(a))) {
    const r = { left: l.x - l.w / 2 - 3, top: l.y - l.h - 9, right: l.x + l.w / 2 + 3, bottom: l.y + 3 };
    const hit = q => r.left < q.right && r.right > q.left && r.top < q.bottom && r.bottom > q.top;
    const off = (l.when && !l.when()) || !l.w || r.left < 0 || r.right > cw || r.top < 0 || r.bottom > ch || panels.some(hit) || placed.some(hit);
    l.el.classList.toggle('hid', off); l.el.classList.toggle('on', l.id === selected); l.el.classList.toggle('live', l.id === tour.here);
    if (objects[l.id]) l.el.classList.toggle('soon', !objects[l.id].built);
    if (!off) placed.push(r);
  }
}

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight, a = w / h, fr = a < 1 ? FR / a * 0.75 : FR; // portrait: widen
  renderer.setSize(w, h, false);
  Object.assign(camera, { left: -fr * a, right: fr * a, top: fr, bottom: -fr }); camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(canvas); resize();
camera.zoom = HOME_ZOOM; camera.updateProjectionMatrix();

// Put a point in the middle of the free part of the screen (right of the HUD/story on desktop, above the story card / bottom sheet on phones)
const SR = new THREE.Vector3(), SU = new THREE.Vector3();
function framed(p, zoom = camera.zoom) {
  const w = canvas.clientWidth, h = canvas.clientHeight, upp = (camera.right - camera.left) / zoom / w;   // world units per pixel
  const top = hud.getBoundingClientRect().bottom, bottom = storyEl.getBoundingClientRect().top || h;   // free band between the HUD and the story card
  const dx = w > 900 ? 182 : 0, dy = h / 2 - (top + bottom) / 2;
  camera.updateMatrixWorld();
  SR.setFromMatrixColumn(camera.matrixWorld, 0); SU.setFromMatrixColumn(camera.matrixWorld, 1);
  return p.clone().setY(0).addScaledVector(SR, dx * upp).addScaledVector(SU, -dy * upp);
}
// Keep the camera over the islands
const ISL = WORLD.islands, MINP = at(Math.min(...ISL.map(s => s.x)), Math.min(...ISL.map(s => s.z))), MAXP = at(Math.max(...ISL.map(s => s.x + s.w)), Math.max(...ISL.map(s => s.z + s.d)));
controls.target.copy(framed(HOME)); camera.position.copy(controls.target).add(OFFSET);   // open on the overview, clear of the panel
const v = new THREE.Vector3(), clock = new THREE.Clock(), LIFT = 1.9;
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime, sim = tour.paused ? 0 : dt * SIM.speed;
  if (anim) {                                              // 0.9s cubic ease-out
    anim.t = Math.min(1, anim.t + dt / 0.9); const k = 1 - Math.pow(1 - anim.t, 3);
    controls.target.lerpVectors(anim.fromT, anim.toT, k);
    const off = anim.toOff ? anim.fromOff.clone().lerp(anim.toOff, k).setLength(anim.fromOff.length()) : anim.fromOff;
    camera.position.copy(controls.target).add(off);
    camera.zoom = THREE.MathUtils.lerp(anim.fromZ, anim.toZ, k); camera.updateProjectionMatrix();
    if (anim.t >= 1) anim = null;
  }
  updateTour(sim); stepMovers(sim); dayNight(sim);
  if (follow && !anim) {                                   // glide after Tanmay; dive in while he explains a building
    const zWant = tour.phase === 'fly' ? (tour.fl.kind === 'cruise' ? 0.62 : 1.25) : { dwell: 2.9, end: 0.6 }[tour.phase] || 1.9;
    camera.zoom += (zWant - camera.zoom) * Math.min(1, dt * (reduceMotion ? 60 : 1.2)); camera.updateProjectionMatrix();
    const d = framed(me.g.position).sub(controls.target).multiplyScalar(reduceMotion ? 1 : Math.min(1, dt * 1.6));
    controls.target.add(d); camera.position.add(d);
  }
  const before = controls.target.clone();                  // keep the world on screen
  controls.target.x = clamp(controls.target.x, MINP.x, MAXP.x);
  controls.target.z = clamp(controls.target.z, MINP.z, MAXP.z);
  camera.position.add(controls.target.clone().sub(before));
  controls.update();
  sun.target.position.set(controls.target.x, 0, controls.target.z); sun.position.set(controls.target.x + N * 0.9, N * 1.4, controls.target.z + N * 0.4);

  for (const [id, o] of Object.entries(objects)) {
    if (o.built && o.bk < 1) o.bk = reduceMotion ? 1 : Math.min(1, o.bk + dt / 1.6);   // rise from the building site
    const b = ease(o.bk);
    o.ext.scale.y = Math.max(0.04, b); o.sc.visible = b < 0.999; o.sc.scale.y = Math.max(0.001, 1 - b);
    if (o.jib && !reduceMotion) o.jib.rotation.y = Math.sin(t * 0.25 + o.group.position.x) * 0.9;
    if (!o.room) continue;                                 // open the building Tanmay is in (or the one you picked)
    const want = id === tour.here || id === selected ? 1 : 0;
    o.open += (want - o.open) * (reduceMotion ? 1 : Math.min(1, dt * 2.2));
    if (Math.abs(want - o.open) < 0.002) o.open = want;
    const k = o.open;
    for (const m of o.shellMats) { m.opacity = 1 - k; m.depthWrite = k < 0.5; }
    o.ext.visible = k < 0.99; o.body.castShadow = k < 0.5;
    o.roofG.position.y = k * LIFT; o.top.y = o.baseTop + k * LIFT;
    o.room.inside.visible = k > 0.01; o.room.inside.scale.y = Math.max(0.001, k);
  }
  const idle = tour.paused ? dt * 0.3 : dt * SIM.speed;
  for (const c of crowd) if (!c.zone || objects[c.zone].open > 0.01) { c.ph += idle * c.rate; pose(c.f, c.mode, c.ph); }
  if (!reduceMotion) {
    pin.position.y = Math.sin(t * 2.4) * 0.12; ring.material.opacity = 0.35 + Math.sin(t * 2.4) * 0.25;
    spot.material.opacity = 0.45 + Math.sin(t * 3) * 0.2; glow.emissiveIntensity = 0.55 + Math.sin(t * 3) * 0.2;
    flags.forEach((f, i) => { f.rotation.y = Math.sin(t * 2.2 + i) * 0.3; });
  }
  if (selected) marker.position.copy(objects[selected].top);
  mePh += (mePose === 'walk' ? 6.5 : 2.4) * (tour.paused ? dt * 0.3 : dt * SIM.speed); pose(me, tour.paused && mePose === 'walk' ? 'stand' : mePose, mePh);
  meAnchor.copy(me.g.position).setY(Math.max(me.g.position.y, 0.16) + 1.2);
  spot.visible = me.g.visible && me.g.position.y < 0.1; spot.position.set(me.g.position.x, 0.05, me.g.position.z);
  renderer.render(scene, camera);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  for (const l of labels) {
    v.copy(l.anchor).project(camera); l.x = (v.x + 1) / 2 * w; l.y = (1 - v.y) / 2 * h;
    l.el.style.transform = `translate(${l.x.toFixed(1)}px, ${l.y.toFixed(1)}px) translate(-50%, -100%)`;
  }
  declutter();
});

applyTheme(theme);
const deep = location.hash.slice(1);
jumpTo(0);
if (deep && objects[deep]) { for (const o of Object.values(objects)) Object.assign(o, { built: true, bk: 1 }); select(deep); }   // deep link: show the finished world
if (!creditOk()) creditError();
creditTimer = setInterval(() => { if (!creditOk()) creditError(); }, 1500);
// ponytail: client-side check only; anyone editing this file can strip it. Real enforcement = a license, not code.
