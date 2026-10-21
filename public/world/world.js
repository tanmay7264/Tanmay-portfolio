// World engine distilled from GCL Campus (site/scene.js). Everything visible comes from world.config.js.
import * as THREE from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';
import { WORLD } from './world.config.js';

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
const flat = (x, z, w, d, y, c) => scene.add(mesh(box(w, 0.02, d), mat(c), x - C + w / 2, y, z - C + d / 2, false));
let seed = WORLD.seed || 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; // same world every visit
const ZONE = Object.fromEntries(WORLD.zones.map(z => [z.id, z]));

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

scene.add(new THREE.HemisphereLight('#E6EEFF', WORLD.colors.ground, 1.45));
const sun = new THREE.DirectionalLight('#FFF1DC', 2.1);
sun.position.set(N * 0.9, N * 1.4, N * 0.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -N * 1.9, right: N * 1.9, top: N * 1.9, bottom: -N * 1.9, near: 1, far: N * 5 });
sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02; scene.add(sun);

/* ---------- Ground: one presentation slab per island, like an architect's model (layers never coplanar) ---------- */
for (const s of WORLD.islands) {
  const p = at(s.x + s.w / 2, s.z + s.d / 2);
  scene.add(mesh(box(s.w, 0.06, s.d), mat(WORLD.colors.ground), p.x, -0.03, p.z, false));
  scene.add(mesh(box(s.w + 0.04, 0.08, s.d + 0.04), mat(WORLD.colors.trim), p.x, -0.1, p.z, false));
  scene.add(mesh(box(s.w, 0.9, s.d), mat(WORLD.colors.slab), p.x, -0.6, p.z));
}
{ const floor = mesh(new THREE.PlaneGeometry(600, 600), mat(WORLD.colors.floor), 0, -1.2, 0, false); floor.rotation.x = -Math.PI / 2; scene.add(floor); }
for (const [x, z, w, d, c] of WORLD.areas || []) flat(x, z, w, d, 0.006, c);            // lawns, pool, aprons…
for (const [x, z, w, d] of WORLD.paths || []) { flat(x - 0.07, z - 0.07, w + 0.14, d + 0.14, 0.011, '#334155'); flat(x, z, w, d, 0.015, WORLD.colors.path); }
const flags = [];
for (const [x, z, cols] of WORLD.flags || []) {
  const p = at(x, z); scene.add(mesh(new THREE.CylinderGeometry(0.03, 0.04, 2.4, 8), mat('#CBD5E1'), p.x, 1.2, p.z));
  const f = new THREE.Group(); f.position.set(p.x, 2.25, p.z); scene.add(f); flags.push(f);
  cols.forEach((c, i) => f.add(mesh(box(0.8, 0.16, 0.02), mat(c), 0.42, -i * 0.16, 0)));
}

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

/* ---------- Interiors: what you see when a building opens (low walls, props, presentation board) ---------- */
const glow = new THREE.MeshStandardMaterial({ color: '#38BDF8', emissive: '#38BDF8', emissiveIntensity: 0.7 });
const goldM = new THREE.MeshStandardMaterial({ color: '#FACC15', metalness: 0.6, roughness: 0.3 });
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
  car(p, x, z, c, r = 0) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = r; p.add(g);
    g.add(mesh(box(1.0, 0.22, 0.48), mat(c), 0, 0.2, 0), mesh(box(0.55, 0.2, 0.44), mat('#CBD5E1'), -0.05, 0.4, 0));
    for (const [wx, wz] of [[0.32, 0.25], [-0.32, 0.25], [0.32, -0.25], [-0.32, -0.25]]) { const w = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 12), mat('#111827'), wx, 0.1, wz); w.rotation.x = Math.PI / 2; g.add(w); } },
  booth(p, x, z, c) { p.add(mesh(box(0.8, 0.4, 0.3), mat('#E2E8F0'), x, 0.2, z), mesh(box(0.8, 0.5, 0.03), mat(c), x, 0.95, z - 0.15), mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 6), mat('#64748B'), x - 0.38, 0.6, z - 0.15), mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 6), mat('#64748B'), x + 0.38, 0.6, z - 0.15)); },
  trophy(p, x, z, s = 1) { p.add(mesh(box(0.36, 0.3 * s, 0.36), mat('#E2E8F0'), x, 0.15 * s, z), mesh(new THREE.CylinderGeometry(0.11, 0.05, 0.22, 12), goldM, x, 0.3 * s + 0.16, z), mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.05, 10), goldM, x, 0.3 * s + 0.03, z)); },
  rack(p, x, z) { p.add(mesh(box(0.38, 1.0, 0.36), mat('#1E293B'), x, 0.5, z)); for (let i = 0; i < 4; i++) p.add(mesh(box(0.28, 0.03, 0.01), glow, x, 0.25 + i * 0.2, z + 0.185, false)); },
  seats(p, x, z, n) { for (let i = 0; i < n; i++) p.add(mesh(box(0.24, 0.22, 0.24), mat('#3B82F6'), x + i * 0.28, 0.11, z), mesh(box(0.24, 0.24, 0.05), mat('#1D4ED8'), x + i * 0.28, 0.3, z - 0.1)); },
  crib(p, x, z) { p.add(mesh(box(0.7, 0.04, 0.42), mat('#FDE68A'), x, 0.3, z)); for (let i = 0; i < 6; i++) p.add(mesh(box(0.03, 0.5, 0.03), mat('#F8FAFC'), x - 0.33 + i * 0.13, 0.25, z + 0.2), mesh(box(0.03, 0.5, 0.03), mat('#F8FAFC'), x - 0.33 + i * 0.13, 0.25, z - 0.2)); },
  blocks(p, x, z) { ['#EF4444', '#3B82F6', '#22C55E', '#EAB308'].forEach((c, i) => p.add(mesh(box(0.12, 0.12, 0.12), mat(c), x + (i % 2) * 0.14, 0.06 + Math.floor(i / 2) * 0.12, z))); },
};
const ROOMS = {   // (props, w, d): keep the front-centre free for Tanmay, who stands there facing the board
  campus(p, w, d) { for (const sx of [-1, 1]) for (const z of [-0.35, 0.45]) for (const k of [0.75, 1.45]) if (k < w / 2 - 0.35) { PROPS.desk(p, sx * k, z, Math.PI); PROPS.stool(p, sx * k, z + 0.36, '#64748B'); } },
  office(p, w, d) { for (const sx of [-1, 1]) { PROPS.desk(p, sx * (w / 2 - 0.6), -0.2, Math.PI); PROPS.desk(p, sx * (w / 2 - 0.6), 0.6, Math.PI); } PROPS.plant(p, -w / 2 + 0.3, -d / 2 + 0.35); },
  villa(p, w, d) { PROPS.rug(p, -0.9, 0.2, 1.2, 0.9, '#FCD34D'); PROPS.sofa(p, -0.9, -0.2, '#EA580C'); p.add(mesh(box(0.8, 0.22, 1.0), mat('#F8FAFC'), 1.15, 0.11, 0.1), mesh(box(0.8, 0.12, 0.25), mat('#94A3B8'), 1.15, 0.28, -0.35)); PROPS.plant(p, -w / 2 + 0.3, 0.9); },
  home(p, w, d) { PROPS.rug(p, -0.8, 0.3, 1.1, 1.0, '#FDE68A'); PROPS.crib(p, 1.0, -0.4); PROPS.blocks(p, -0.9, 0.3); PROPS.sofa(p, -0.9, -0.6, '#A78BFA'); },
  community(p, w, d) { for (let i = 0; i < 7; i++) { const a = Math.PI * (0.15 + i * 0.12); PROPS.stool(p, Math.cos(a) * 1.3, 0.75 - Math.sin(a) * 0.95, ['#22C55E', '#EAB308', '#3B82F6', '#EF4444'][i % 4]); } PROPS.plant(p, w / 2 - 0.35, -d / 2 + 0.35); },
  library(p, w, d) { PROPS.shelf(p, -w / 2 + 0.25, -0.2, Math.PI / 2); PROPS.shelf(p, -w / 2 + 0.25, 0.8, Math.PI / 2); PROPS.shelf(p, w / 2 - 0.25, 0.3, -Math.PI / 2); p.add(mesh(box(0.8, 0.4, 0.5), mat('#B98A55'), 0.9, 0.2, -0.5)); },
  lab(p, w, d) { PROPS.rack(p, -w / 2 + 0.35, -0.3); PROPS.rack(p, -w / 2 + 0.35, 0.3); PROPS.rack(p, w / 2 - 0.35, -0.3); PROPS.desk(p, 1.1, 0.6, Math.PI); },
  hall(p, w, d) { [-2, -1.3, 1.3, 2].forEach((x, i) => Math.abs(x) < w / 2 - 0.2 && PROPS.trophy(p, x, -0.6 + (i % 2) * 0.9, 1 + (i % 2) * 0.4)); PROPS.rug(p, 0, 0.4, 1.2, 1.3, '#B91C1C'); },
  terminal(p, w, d) { PROPS.seats(p, -w / 2 + 0.3, 0.6, 3); PROPS.seats(p, w / 2 - 0.86, 0.6, 3); PROPS.plant(p, w / 2 - 0.3, -d / 2 + 0.35); },
  garage(p, w, d) { PROPS.car(p, -0.75, -0.1, '#E11D48', 0.3); PROPS.car(p, 0.85, 0.5, '#F8FAFC', -0.4); },
  fair(p, w, d) { ['#84CC16', '#3B82F6', '#F97316', '#A855F7'].forEach((c, i) => PROPS.booth(p, (i < 2 ? -1 : 1) * (w / 2 - 0.55), -0.6 + (i % 2) * 1.0, c)); },
};
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
  return { inside, board };
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
  return body;
}

/* ---------- Zones: buildings whose shell fades and roof lifts to reveal the room inside ---------- */
const pickables = [], objects = {};
for (const z of WORLD.zones) {
  const { id, x, z: zz, w, d, h, roof = 'hip', color } = z;
  const g = new THREE.Group(); g.position.copy(at(x, zz)); scene.add(g);
  const shellMats = [], sm = c => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, transparent: true }); shellMats.push(m); return m; };
  if (z.shape === 'landmarks') {
    const body = landmarks(z, g, new THREE.MeshStandardMaterial({ color: '#9CA3AF', roughness: 0.9 }));
    g.traverse(m => { if (m.isMesh) { m.userData.id = id; pickables.push(m); } });
    objects[id] = { group: g, body, size: new THREE.Vector3(w, 1.4, d), top: at(x, zz, 3.4), baseTop: 3.4, r: Math.max(w, d) * 0.7, open: 0 };
    continue;
  }
  g.add(mesh(box(w + 0.2, 0.14, d + 0.2), mat('#D6CCBA'), 0, 0.07, 0));                  // plinth stays when the building opens
  const ext = new THREE.Group(), roofG = new THREE.Group(); g.add(ext); ext.add(roofG);
  const body = mesh(box(w, h, d), sm(z.wall || '#F6F1E8'), 0, h / 2, 0); ext.add(body);
  const glass = sm('#9CC3DE');
  for (let i = 0; i < Math.floor(w / 0.9); i++) ext.add(mesh(box(0.42, h * 0.32, 0.04), glass, -w / 2 + 0.45 + i * 0.9 + (w % 0.9) / 2, h * 0.55, d / 2 + 0.02, false));
  for (let i = 0; i < Math.floor(d / 0.9); i++) ext.add(mesh(box(0.04, h * 0.32, 0.42), glass, w / 2 + 0.02, h * 0.55, -d / 2 + 0.45 + i * 0.9 + (d % 0.9) / 2, false));
  ext.add(mesh(box(0.5, h * 0.45, 0.05), sm('#6B5A48'), 0, h * 0.225, d / 2 + 0.03, false)); // door, faces +z
  let top;
  if (roof === 'flat') { roofG.add(mesh(box(w + 0.16, 0.18, d + 0.16), sm(color), 0, h + 0.09, 0)); top = h + 0.18; }
  else { const geo = new THREE.ConeGeometry(1, Math.min(w, d) * 0.45, 4); geo.rotateY(Math.PI / 4); const r = mesh(geo, sm(color), 0, h + Math.min(w, d) * 0.225, 0); r.scale.set(w / 1.414 * 1.12, 1, d / 1.414 * 1.12); roofG.add(r); top = h + Math.min(w, d) * 0.45; }
  const signM = new THREE.MeshBasicMaterial({ map: signTexture(z.name, color), transparent: true }); shellMats.push(signM);
  ext.add(mesh(new THREE.PlaneGeometry(Math.min(w * 0.8, 3), 0.5), signM, 0, h * 0.86, d / 2 + 0.05, false));
  const o = objects[id] = { group: g, body, ext, roofG, shellMats, size: new THREE.Vector3(w, h, d), top: at(x, zz, top + 0.3), baseTop: top + 0.3, r: Math.max(w, d) * 0.75, open: 0 };
  if (z.room) o.room = room(z, g);
  g.traverse(m => { if (m.isMesh) { m.userData.id = id; pickables.push(m); } });
}
function showOnBoard(id, kicker, title, text) {
  const b = objects[id]?.room?.board, key = kicker + title; if (!b || b.key === key) return;
  b.key = key; drawBoard(b, ZONE[id].color, kicker, title, text);
}

/* ---------- Nature: collision-aware seeded scatter per island (never on paths, zones or solid areas) ---------- */
const blockers = [...WORLD.zones.map(o => [o.x - o.w / 2, o.z - o.d / 2, o.w, o.d]), ...(WORLD.paths || []), ...(WORLD.areas || []).filter(a => a[5])];
const blocked = (x, z, pad) => blockers.some(([bx, bz, bw, bd]) => x > bx - pad && x < bx + bw + pad && z > bz - pad && z < bz + bd + pad);
const trees = [];
for (const s of WORLD.islands) for (let n = 0, tries = 0; n < s.trees && tries < 5000; tries++) {
  const x = s.x + 0.7 + rnd() * (s.w - 1.4), z = s.z + 0.7 + rnd() * (s.d - 1.4);
  if (!blocked(x, z, 0.9) && trees.every(([a, b]) => Math.hypot(a - x, b - z) > 1.3)) { trees.push([x, z]); n++; }
}
const inst = (geo, m, list, fn) => {
  const im = new THREE.InstancedMesh(geo, m, list.length); im.castShadow = true; im.receiveShadow = true;
  const o = new THREE.Object3D(); list.forEach((v, i) => { o.position.set(0, 0, 0); o.scale.set(1, 1, 1); const col = fn(o, v, i); o.updateMatrix(); im.setMatrixAt(i, o.matrix); if (col) im.setColorAt(i, new THREE.Color(col)); });
  scene.add(im); return im;
};
const white = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.9, flatShading: true }); // instance colours tint it
inst(new THREE.CylinderGeometry(0.08, 0.12, 0.8, 6), mat('#7A5A3E'), trees, (o, [x, z]) => { o.position.copy(at(x, z, 0.4)); });
inst(new THREE.IcosahedronGeometry(0.62, 0), white, trees, (o, [x, z]) => { o.position.copy(at(x, z, 1.15)); o.scale.setScalar(0.8 + rnd() * 0.5); return WORLD.colors.foliage[Math.floor(rnd() * WORLD.colors.foliage.length)]; });

/* ---------- Tanmay: a jointed low-poly figure (ported from GCL site/scene.js) ---------- */
const capsule = (r, l) => new THREE.CapsuleGeometry(r, l, 3, 8), ball = r => new THREE.SphereGeometry(r, 14, 10);
function person({ shirt, pants, skin, hair, shoe }) {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const legs = [], arms = [];
  for (const side of [-1, 1]) {
    const hip = new THREE.Group(); hip.position.set(0, 0.46, side * 0.055);
    hip.add(mesh(capsule(0.043, 0.15), mat(pants), 0, -0.11, 0));
    const knee = new THREE.Group(); knee.position.y = -0.22; hip.add(knee);
    knee.add(mesh(capsule(0.037, 0.14), mat(pants), 0, -0.1, 0), mesh(box(0.11, 0.045, 0.066), mat(shoe), 0.026, -0.215, 0));
    body.add(hip); legs.push({ hip, knee });
  }
  const torso = mesh(capsule(0.1, 0.17), mat(shirt), 0, 0.66, 0); torso.scale.set(0.7, 1, 1); body.add(torso);
  body.add(mesh(new THREE.CylinderGeometry(0.034, 0.04, 0.07, 8), mat(skin), 0, 0.88, 0));
  const head = new THREE.Group(); head.position.y = 0.97; body.add(head);
  const skull = mesh(ball(0.085), mat(skin), 0, 0, 0); skull.scale.set(0.95, 1.08, 0.92); head.add(skull);
  for (const s of [-1, 1]) head.add(mesh(ball(0.011), mat('#1F1B2D'), 0.079, 0.012, s * 0.03, false));
  const cap = mesh(new THREE.SphereGeometry(0.092, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), mat(hair), -0.01, 0.01, 0);
  cap.rotation.z = 0.45; head.add(cap);                                              // hairline lifted so the face shows
  for (const side of [-1, 1]) {
    const sh = new THREE.Group(); sh.position.set(0, 0.82, side * 0.13); sh.rotation.x = -side * 0.09;
    sh.add(mesh(capsule(0.032, 0.13), mat(shirt), 0, -0.09, 0));
    const el = new THREE.Group(); el.position.y = -0.19; sh.add(el);
    el.add(mesh(capsule(0.028, 0.12), mat(shirt), 0, -0.08, 0), mesh(ball(0.03), mat(skin), 0, -0.17, 0));
    body.add(sh); arms.push({ sh, el });
  }
  scene.add(g);
  return { g, body, head, legs, arms, pose: 'idle', phase: 0 };
}
// Poses: limbs hang along -y, so +z rotation swings them forward and -z bends a knee back.
function animate(r, t) {
  const k = t + r.phase, gest = Math.pow(Math.max(0, Math.sin(k * 0.8)), 3);
  let hip = [0, 0], knee = [0, 0], sh = [0.04, 0.04], el = [0.15, 0.15], y = 0, hy = Math.sin(k * 0.4) * 0.12;
  if (r.pose === 'walk') { const s = Math.sin(k * 7.5); hip = [0.5 * s, -0.5 * s]; knee = [-Math.max(0, -s) * 0.8, -Math.max(0, s) * 0.8]; sh = [-0.4 * s, 0.4 * s]; el = [0.35, 0.35]; y = Math.abs(Math.cos(k * 7.5)) * 0.02; hy = 0; }
  if (r.pose === 'present') { sh = [0.1 + gest * 0.5, 1.2]; el = [0.3 + gest * 0.6, 0.15]; hy = Math.sin(k * 0.7) * 0.45; }
  r.legs[0].hip.rotation.z = hip[0]; r.legs[1].hip.rotation.z = hip[1];
  r.legs[0].knee.rotation.z = knee[0]; r.legs[1].knee.rotation.z = knee[1];
  r.arms[0].sh.rotation.z = sh[0]; r.arms[1].sh.rotation.z = sh[1];
  r.arms[0].el.rotation.z = el[0]; r.arms[1].el.rotation.z = el[1];
  r.body.position.y = y; r.head.rotation.y = hy;
}
const yaw = (dx, dz) => Math.atan2(-dz, dx);                                        // figures and the plane face +x
const me = person({ shirt: '#3B82F6', pants: '#1E293B', skin: '#C68B5E', hair: '#1A1410', shoe: '#F4F4F6' });
me.g.scale.setScalar(1.5);                                                         // a touch larger than life so he reads at map scale
const meAnchor = new THREE.Vector3();
const spot = new THREE.Mesh(new THREE.RingGeometry(0.7, 0.82, 48), new THREE.MeshBasicMaterial({ color: WORLD.colors.accent, transparent: true, opacity: 0.6, depthWrite: false }));
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
const AIR = WORLD.tour.airports;
plane.scale.setScalar(1.6);
const parkPlane = code => { const a = AIR[code]; plane.position.copy(at(a.park[0], a.park[1], 0.4)); plane.rotation.set(0, yaw(a.dir[0], a.dir[1]), 0); };
parkPlane('in');

/* ---------- The journey: legs of walking (street polyline + stops) and flights between countries ---------- */
function prepLeg(l) {
  const R = l.route, RL = [0];
  for (let i = 1; i < R.length; i++) RL.push(RL[i - 1] + Math.hypot(R[i][0] - R[i - 1][0], R[i][1] - R[i - 1][1]));
  const leg = { ...l, R, RL };
  leg.stops = l.stops.map(sp => {
    const spec = typeof sp === 'string' ? { id: sp } : sp, z = ZONE[spec.id];
    const door = [z.x, z.z + z.d / 2 + 0.45];
    return { z, door, in: z.shape ? door : [z.x, z.z + z.d * 0.14], s: spec.at === 'end' ? RL.at(-1) : routeS(leg, ...door), beats: spec.inside || z.inside || [[z.name, z.step]] };
  });
  const f = ZONE[l.from]; leg.fromS = f ? routeS(leg, f.x, f.z + f.d / 2 + 0.45) : 0;   // where the leg starts (e.g. the arrival airport)
  return leg;
}
function routeAt({ R, RL }, s) { let i = 0; while (i < R.length - 2 && RL[i + 1] < s) i++; const k = (s - RL[i]) / (RL[i + 1] - RL[i] || 1); return [R[i][0] + (R[i + 1][0] - R[i][0]) * k, R[i][1] + (R[i + 1][1] - R[i][1]) * k]; }
function routeS({ R, RL }, x, z) {                                                 // distance along the route of its closest point
  let best = [Infinity, 0];
  for (let i = 0; i < R.length - 1; i++) {
    const [ax, az] = R[i], [bx, bz] = R[i + 1], L = RL[i + 1] - RL[i];
    const k = THREE.MathUtils.clamp(((x - ax) * (bx - ax) + (z - az) * (bz - az)) / (L * L), 0, 1);
    const dd = Math.hypot(ax + (bx - ax) * k - x, az + (bz - az) * k - z);
    if (dd < best[0]) best = [dd, RL[i] + k * L];
  }
  return best[1];
}
const LEGS = WORLD.tour.legs.map(l => l.fly ? l : prepLeg(l));
const STEPS = LEGS.reduce((n, l) => n + (l.fly ? 1 : l.stops.length), 0);
const stepBase = li => LEGS.slice(0, li).reduce((n, l) => n + (l.fly ? 1 : l.stops.length), 0);
const BEAT = WORLD.tour.beat || 6;

const tour = { leg: 0, i: 0, phase: 'walk', beat: 0, beatT: 0, here: null, fromS: 0, paused: false, path: null, L: null, s: 0, u: 0 };
const stop = () => LEGS[tour.leg].stops?.[tour.i];
function walk(cells) {                                                              // cells: [x, z] or [x, z, y]
  const pts = [me.g.position.clone(), ...cells.map(c => at(c[0], c[1], c[2] || 0))];
  const L = [0]; for (let k = 1; k < pts.length; k++) L.push(L[k - 1] + pts[k].distanceTo(pts[k - 1]));
  Object.assign(tour, { path: pts, L, s: reduceMotion ? L.at(-1) : 0 }); me.pose = 'walk';
}
function stepWalk(dt) {                                                             // true once the walk is done
  const { path: p, L } = tour; tour.s = Math.min(L.at(-1), tour.s + 2.2 * dt);
  let i = 0; while (i < L.length - 2 && L[i + 1] < tour.s) i++;
  me.g.position.lerpVectors(p[i], p[i + 1], (tour.s - L[i]) / (L[i + 1] - L[i] || 1));
  const dv = p[i + 1].clone().sub(p[i]); if (dv.lengthSq() > 1e-6) me.g.rotation.y = yaw(dv.x, dv.z);
  return tour.s >= L.at(-1);
}
function startLeg(li) {
  const leg = LEGS[tour.leg = li];
  if (leg.fly) {                                                                    // walk out to the plane, then board
    const st = LEGS[li - 1].stops.at(-1), a = AIR[leg.fly[0]];
    Object.assign(tour, { phase: 'board', here: null }); walk([st.door, a.park]); renderStory(); return;
  }
  tour.fromS = leg.fromS;
  startStop(0);
}
function startStop(i) {
  const leg = LEGS[tour.leg], st = leg.stops[i], a = tour.fromS, b = st.s;
  const mid = leg.R.filter((_, k) => leg.RL[k] > a + 0.01 && leg.RL[k] < b - 0.01);
  Object.assign(tour, { i, phase: 'walk', here: null, fromS: b });
  walk([routeAt(leg, a), ...mid, routeAt(leg, b), st.door, [...st.in, st.z.shape ? 0 : 0.16]]);
  renderStory();
}
function arrive() {
  const st = stop();
  Object.assign(tour, { phase: 'dwell', beat: 0, beatT: 0, here: st.z.id }); me.pose = 'present';
  me.g.rotation.y = st.z.shape ? yaw(0, -1) : yaw(0, -1);                          // face the board on the back wall
  showBeat(); renderStory();
}
function showBeat() { const st = stop(), [t, x] = st.beats[tour.beat]; showOnBoard(st.z.id, `${st.z.kicker} · ${tour.beat + 1}/${st.beats.length}`, t, x); }
function nextBeat() {
  if (++tour.beat < stop().beats.length) { tour.beatT = 0; showBeat(); renderStory(); return; }
  if (tour.i < LEGS[tour.leg].stops.length - 1) startStop(tour.i + 1);
  else if (tour.leg < LEGS.length - 1) startLeg(tour.leg + 1);
  else { Object.assign(tour, { phase: 'end', beatT: 0, here: null }); me.pose = 'idle'; renderStory(); }
}
function updateTour(dt) {
  if (tour.paused) return;
  if (tour.phase === 'walk') {
    if (tour.L.at(-1) - tour.s < 2.4) tour.here = stop().z.id;                      // doors open as he approaches
    if (stepWalk(dt)) arrive();
  } else if (tour.phase === 'dwell') { if ((tour.beatT += dt) >= BEAT) nextBeat(); }
  else if (tour.phase === 'board') {
    if (stepWalk(dt)) { me.g.visible = false; Object.assign(tour, { phase: 'fly', u: 0 }); renderStory(); }
  } else if (tour.phase === 'fly') {
    const [f, t] = LEGS[tour.leg].fly, A = at(...AIR[f].park), B = at(...AIR[t].park);
    const prev = plane.position.clone();
    tour.u = reduceMotion ? 1 : Math.min(1, tour.u + dt / 8);
    const u = tour.u, e = u * u * (3 - 2 * u), alt = Math.sin(Math.PI * Math.min(1, Math.max(0, (u - 0.08) / 0.84)));
    plane.position.lerpVectors(A, B, e).setY(0.4 + alt * 7);
    const dv = plane.position.clone().sub(prev);
    if (dv.lengthSq() > 1e-8) { plane.rotation.y = yaw(dv.x, dv.z); plane.rotation.z = Math.atan2(dv.y, Math.hypot(dv.x, dv.z)); }
    me.g.position.copy(plane.position);
    if (u >= 1) { parkPlane(t); me.g.position.copy(at(...AIR[t].park)); me.g.visible = true; startLeg(tour.leg + 1); }
  } else if (tour.phase === 'end' && (tour.beatT += dt) >= 6) {                     // journey complete: start again
    parkPlane('in'); me.g.position.copy(at(...LEGS[0].R[0])); startLeg(0);
  }
}
function skip() {
  if (tour.phase === 'dwell') nextBeat();
  else if (tour.phase === 'walk' || tour.phase === 'board') tour.s = tour.L.at(-1);
  else if (tour.phase === 'fly') tour.u = 1;
}

let follow = false;                                                                 // camera follows Tanmay until the visitor takes over
function setFollow(on) { if (follow !== on) { follow = on; renderStory(); } }
const storyEl = $('#story');
function renderStory() {
  const leg = LEGS[tour.leg], st = stop(), base = stepBase(tour.leg);
  let kicker, title, text, prog;
  if (tour.phase === 'end') { kicker = 'THE JOURNEY · COMPLETE'; title = 'Where technology and business meet'; text = "That's the story so far. Starting the walk again…"; prog = 1; }
  else if (leg.fly) { kicker = tour.phase === 'fly' ? '✈ IN FLIGHT' : '✈ BOARDING'; title = leg.title; text = leg.text; prog = (base + (tour.phase === 'fly' ? 0.5 : 0)) / STEPS; }
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
  if (a === 'pause') { tour.paused = !tour.paused; me.pose = tour.paused ? 'idle' : { walk: 'walk', board: 'walk', dwell: 'present' }[tour.phase] || 'idle'; renderStory(); }
  if (a === 'follow') { select(null); setFollow(true); }
});

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
  panel.innerHTML = z
    ? `<small class="kicker" style="color:${z.color}">${esc(z.kicker || WORLD.title)}</small><h2>${esc(z.name)}</h2><p>${esc(z.blurb || '')}</p>
       ${z.facts ? `<dl>${z.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
       ${z.inside ? `<h4 class="kicker">WHAT HAPPENED HERE</h4><ol class="beats">${z.inside.map(([t, x]) => `<li><b>${esc(t)}</b><span>${esc(x)}</span></li>`).join('')}</ol>` : ''}
       <button class="btn" data-close>Back to overview</button>`
    : `<small class="kicker">WELCOME</small><h2>${esc(WORLD.title)}</h2><p>${esc(WORLD.intro)}</p>
       ${WORLD.islands.map(s => `<h4 class="kicker">${esc(s.name)}</h4><ul>${WORLD.zones.filter(o => o.x >= s.x && o.x <= s.x + s.w && o.z >= s.z && o.z <= s.z + s.d).map(o => `<li><button data-select="${o.id}"><i style="background:${o.color}"></i>${esc(o.name)}</button></li>`).join('')}</ul>`).join('')}
       <p class="muted">Click any building · drag to pan · scroll to zoom</p>`;
}
document.addEventListener('click', e => {
  const s = e.target.closest('[data-select]'); if (s) return select(s.dataset.select);
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
  return ray.intersectObjects(pickables, false).find(h => h.object.visible && h.object.parent.visible)?.object.userData.id ?? null;
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
{ const el = document.createElement('button'); el.type = 'button'; el.className = 'maplabel me'; el.textContent = 'Tanmay';
  el.addEventListener('click', () => { select(null); setFollow(true); }); $('#labels').append(el);
  labels.push({ id: 'me', el, anchor: meAnchor, x: 0, y: 0, w: 0, h: 0 }); }
let measured = 0, panels = [];
function declutter() {             // selected label first; hide any that would overlap a placed label, a UI card or the edge
  if (performance.now() - measured > 400) {
    measured = performance.now();
    for (const l of labels) { l.w = l.el.offsetWidth; l.h = l.el.offsetHeight; }
    panels = [...document.querySelectorAll('.card')].map(e => e.getBoundingClientRect()).filter(r => r.width);
  }
  const placed = [], cw = canvas.clientWidth, ch = canvas.clientHeight;
  for (const l of [...labels].sort((a, b) => (b.id === selected) - (a.id === selected) || (b.id === 'me') - (a.id === 'me'))) {
    const r = { left: l.x - l.w / 2 - 3, top: l.y - l.h - 9, right: l.x + l.w / 2 + 3, bottom: l.y + 3 };
    const hit = q => r.left < q.right && r.right > q.left && r.top < q.bottom && r.bottom > q.top;
    const off = !l.w || r.left < 0 || r.right > cw || r.top < 0 || r.bottom > ch || panels.some(hit) || placed.some(hit);
    l.el.classList.toggle('hid', off); l.el.classList.toggle('on', l.id === selected); l.el.classList.toggle('live', l.id === tour.here);
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

// Put a point in the middle of the free part of the screen (left of the desktop panel, above the story card / bottom sheet)
const SR = new THREE.Vector3(), SU = new THREE.Vector3();
function framed(p, zoom = camera.zoom) {
  const w = canvas.clientWidth, h = canvas.clientHeight, upp = (camera.right - camera.left) / zoom / w;   // world units per pixel
  const [dx, dy] = w > 900 ? [182, 70] : [0, h * 0.22];
  camera.updateMatrixWorld();
  SR.setFromMatrixColumn(camera.matrixWorld, 0); SU.setFromMatrixColumn(camera.matrixWorld, 1);
  return p.clone().setY(0).addScaledVector(SR, dx * upp).addScaledVector(SU, -dy * upp);
}
// Keep the camera over the islands
const ISL = WORLD.islands, MINP = at(Math.min(...ISL.map(s => s.x)), Math.min(...ISL.map(s => s.z))), MAXP = at(Math.max(...ISL.map(s => s.x + s.w)), Math.max(...ISL.map(s => s.z + s.d)));
const v = new THREE.Vector3(), clock = new THREE.Clock(), LIFT = 1.9;
controls.target.copy(framed(HOME)); camera.position.copy(controls.target).add(OFFSET);   // open on the overview, clear of the panel
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
  if (anim) {                                              // 0.9s cubic ease-out
    anim.t = Math.min(1, anim.t + dt / 0.9); const k = 1 - Math.pow(1 - anim.t, 3);
    controls.target.lerpVectors(anim.fromT, anim.toT, k);
    const off = anim.toOff ? anim.fromOff.clone().lerp(anim.toOff, k).setLength(anim.fromOff.length()) : anim.fromOff;
    camera.position.copy(controls.target).add(off);
    camera.zoom = THREE.MathUtils.lerp(anim.fromZ, anim.toZ, k); camera.updateProjectionMatrix();
    if (anim.t >= 1) anim = null;
  }
  updateTour(dt);
  if (follow && !anim) {                                   // glide after Tanmay; dive in while he explains a building
    const zWant = { dwell: 2.9, fly: 0.7, end: 0.6 }[tour.phase] || 1.9;
    camera.zoom += (zWant - camera.zoom) * Math.min(1, dt * (reduceMotion ? 60 : 1.2)); camera.updateProjectionMatrix();
    const d = framed(me.g.position).sub(controls.target).multiplyScalar(reduceMotion ? 1 : Math.min(1, dt * 1.6));
    controls.target.add(d); camera.position.add(d);
  }
  const before = controls.target.clone();                  // keep the world on screen
  controls.target.x = THREE.MathUtils.clamp(controls.target.x, MINP.x, MAXP.x);
  controls.target.z = THREE.MathUtils.clamp(controls.target.z, MINP.z, MAXP.z);
  camera.position.add(controls.target.clone().sub(before));
  controls.update();

  for (const [id, o] of Object.entries(objects)) {         // open the building Tanmay is in (or the one you picked)
    if (!o.room) continue;
    const want = id === tour.here || id === selected ? 1 : 0;
    o.open += (want - o.open) * (reduceMotion ? 1 : Math.min(1, dt * 2.2));
    if (Math.abs(want - o.open) < 0.002) o.open = want;
    const k = o.open;
    for (const m of o.shellMats) { m.opacity = 1 - k; m.depthWrite = k < 0.5; }
    o.ext.visible = k < 0.99; o.body.castShadow = k < 0.5;
    o.roofG.position.y = k * LIFT; o.top.y = o.baseTop + k * LIFT;
    o.room.inside.visible = k > 0.01; o.room.inside.scale.y = Math.max(0.001, k);
  }
  if (!reduceMotion) {
    pin.position.y = Math.sin(t * 2.4) * 0.12; ring.material.opacity = 0.35 + Math.sin(t * 2.4) * 0.25;
    spot.material.opacity = 0.45 + Math.sin(t * 3) * 0.2; glow.emissiveIntensity = 0.55 + Math.sin(t * 3) * 0.2;
    flags.forEach((f, i) => { f.rotation.y = Math.sin(t * 2.2 + i) * 0.3; });
  }
  if (selected) marker.position.copy(objects[selected].top);
  animate(me, reduceMotion ? 0 : t);
  meAnchor.copy(me.g.position).setY(me.g.position.y + 1.75);
  spot.visible = me.g.visible && me.g.position.y < 0.1; spot.position.set(me.g.position.x, 0.05, me.g.position.z);
  renderer.render(scene, camera);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  for (const l of labels) {
    v.copy(l.anchor).project(camera); l.x = (v.x + 1) / 2 * w; l.y = (1 - v.y) / 2 * h;
    l.el.style.transform = `translate(${l.x.toFixed(1)}px, ${l.y.toFixed(1)}px) translate(-50%, -100%)`;
  }
  declutter();
});

me.g.position.copy(at(...LEGS[0].R[0]));
select(location.hash.slice(1) || null);                    // deep links: #<zone-id>
startLeg(0); setFollow(!selected);
if (!creditOk()) creditError();
creditTimer = setInterval(() => { if (!creditOk()) creditError(); }, 1500);
// ponytail: client-side check only; anyone editing this file can strip it. Real enforcement = a license, not code.
