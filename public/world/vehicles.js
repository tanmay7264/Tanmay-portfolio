// Vehicles for Tanmay's World. Everything faces +x (nose), sits on y = 0, unit ≈ one grid cell.
// Brand names appear as text only (no logos): KTM, Xiaomi, BMW, A380.
import * as THREE from 'three';
import { mat, box, cyl, mesh, glowAtNight, textMat } from './kit.js';

const tyreM = mat('#111827', 'tyre'), rimM = mat('#9CA3AF', 'rim'), darkGlass = mat('#1E293B', 'dglass');
const headM = glowAtNight(new THREE.MeshStandardMaterial({ color: '#FEF9C3', roughness: 0.3 }), '#FFF7D6', 2.2);
const tailM = glowAtNight(new THREE.MeshStandardMaterial({ color: '#B91C1C', roughness: 0.4 }), '#EF4444', 1.6);
function wheel(g, x, z, r = 0.09, w = 0.06) { const t = mesh(cyl(r, r, w, 14), tyreM, x, r, z); t.rotation.x = Math.PI / 2; g.add(t); const h = mesh(cyl(r * 0.5, r * 0.5, w + 0.005, 10), rimM, x, r, z, false); h.rotation.x = Math.PI / 2; g.add(h); return t; }
function lights(g, L, W, y) { for (const s of [-1, 1]) g.add(mesh(box(0.02, 0.05, 0.08), headM, L / 2, y, s * (W / 2 - 0.07), false), mesh(box(0.02, 0.05, 0.08), tailM, -L / 2, y, s * (W / 2 - 0.07), false)); }

// Cars: sedan, hatch, suv, taxi (Mumbai black-and-yellow), bus, rick (auto-rickshaw)
export function car(kind = 'sedan', colour = '#2563EB') {
  const g = new THREE.Group();
  if (kind === 'rick') {
    g.add(mesh(box(0.55, 0.24, 0.4), mat('#FACC15'), 0, 0.22, 0), mesh(box(0.3, 0.22, 0.36), mat('#16A34A'), -0.1, 0.45, 0), mesh(box(0.62, 0.05, 0.44), mat('#111827'), -0.03, 0.58, 0), mesh(box(0.04, 0.18, 0.3), darkGlass, 0.25, 0.44, 0, false));
    wheel(g, 0.22, 0); wheel(g, -0.2, 0.18); wheel(g, -0.2, -0.18); g.add(mesh(box(0.02, 0.05, 0.08), headM, 0.28, 0.25, 0, false));
    return g;
  }
  if (kind === 'bus') {
    const L = 2.1, W = 0.56;
    g.add(mesh(box(L, 0.62, W), mat(colour), 0, 0.42, 0), mesh(box(L - 0.1, 0.18, W + 0.01), darkGlass, 0.02, 0.56, 0, false), mesh(box(0.02, 0.4, W - 0.1), darkGlass, L / 2 + 0.005, 0.5, 0, false), mesh(box(L, 0.04, W), mat('#E5E7EB'), 0, 0.75, 0));
    for (const x of [0.7, -0.7]) for (const s of [-1, 1]) wheel(g, x, s * 0.26, 0.11, 0.07);
    lights(g, L, W, 0.24); return g;
  }
  const dims = { sedan: [0.95, 0.44, 0.17, 0.52, 0.15], hatch: [0.78, 0.42, 0.18, 0.46, 0.16], suv: [1.0, 0.48, 0.24, 0.62, 0.2], taxi: [0.9, 0.42, 0.17, 0.5, 0.15] }[kind] || [0.95, 0.44, 0.17, 0.52, 0.15];
  const [L, W, bodyH, cabL, cabH] = dims, body = kind === 'taxi' ? '#111111' : colour;
  g.add(mesh(box(L, bodyH, W), mat(body), 0, 0.12 + bodyH / 2, 0));
  const cab = new THREE.Group(); cab.position.set(kind === 'hatch' ? -0.08 : -0.04, 0.12 + bodyH, 0); g.add(cab);
  cab.add(mesh(box(cabL, cabH, W - 0.04), darkGlass, 0, cabH / 2, 0), mesh(box(cabL - 0.06, 0.03, W - 0.02), mat(kind === 'taxi' ? '#FACC15' : body), 0, cabH + 0.015, 0));
  if (kind === 'taxi') cab.add(mesh(box(0.14, 0.05, 0.08), mat('#FACC15'), 0, cabH + 0.05, 0));
  for (const x of [L / 2 - 0.2, -L / 2 + 0.2]) for (const s of [-1, 1]) wheel(g, x, s * (W / 2 - 0.02), kind === 'suv' ? 0.11 : 0.09);
  lights(g, L, W, 0.12 + bodyH * 0.6);
  return g;
}

// KTM street bike: orange trellis frame, black tank with orange panels, chunky tyres. Seat top ≈ 0.42.
export function ktm() {
  const g = new THREE.Group(), orange = mat('#F97316', 'ktm'), black = mat('#111827', 'ktmblk');
  const tyre = (x) => { const t = mesh(new THREE.TorusGeometry(0.15, 0.055, 10, 20), tyreM, x, 0.2, 0); g.add(t); g.add(mesh(cyl(0.09, 0.09, 0.05, 12), orange, x, 0.2, 0).rotateX(Math.PI / 2)); };
  tyre(0.36); tyre(-0.34);
  const bar = (x1, y1, x2, y2, m = orange, t = 0.035) => { const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); const b = mesh(box(L, t, t), m, (x1 + x2) / 2, (y1 + y2) / 2, 0); b.rotation.z = Math.atan2(dy, dx); g.add(b); };
  bar(0.36, 0.2, 0.22, 0.58, mat('#D1D5DB', 'fork'), 0.04);                 // front fork
  bar(0.22, 0.52, -0.1, 0.42); bar(0.2, 0.36, -0.12, 0.3); bar(-0.1, 0.42, -0.34, 0.2); bar(-0.12, 0.3, -0.34, 0.2);   // trellis frame + swingarm
  g.add(mesh(box(0.32, 0.14, 0.2), black, 0.05, 0.5, 0), mesh(box(0.3, 0.1, 0.205), orange, 0.06, 0.47, 0, false));    // tank with orange panels
  g.add(mesh(box(0.3, 0.05, 0.16), black, -0.16, 0.43, 0), mesh(box(0.2, 0.04, 0.12), orange, -0.36, 0.48, 0));          // seat, tail
  g.add(mesh(box(0.06, 0.03, 0.42), black, 0.22, 0.66, 0), mesh(box(0.07, 0.08, 0.1), headM, 0.29, 0.56, 0, false));   // bars, headlight
  g.add(mesh(cyl(0.035, 0.045, 0.32, 8), mat('#6B7280', 'exhaust'), -0.12, 0.24, 0.1).rotateZ(Math.PI / 2 - 0.25));     // exhaust
  for (const s of [-1, 1]) { const d = mesh(new THREE.PlaneGeometry(0.2, 0.07), textMat('KTM', { fg: '#FFFFFF', bg: '#F97316', w: 256, h: 96, font: '900 64px Arial, sans-serif' }), 0.06, 0.49, s * 0.106, false); if (s < 0) d.rotation.y = Math.PI; g.add(d); }
  g.userData = { seat: 0.42, pose: 'ride', riderX: -0.12 };
  return g;
}

// Xiaomi electric kick-scooter: black deck and stem, grey wheels. Rider stands on the deck (≈ 0.1).
export function scooter() {
  const g = new THREE.Group(), black = mat('#18181B', 'xiaomi');
  for (const x of [0.3, -0.3]) { const t = mesh(cyl(0.075, 0.075, 0.045, 14), tyreM, x, 0.075, 0); t.rotation.x = Math.PI / 2; g.add(t); }
  g.add(mesh(box(0.56, 0.035, 0.13), black, 0, 0.1, 0), mesh(box(0.5, 0.01, 0.1), mat('#3F3F46', 'grip'), 0, 0.12, 0, false));
  const stem = mesh(cyl(0.02, 0.02, 0.66, 8), black, 0.33, 0.43, 0); stem.rotation.z = -0.12; g.add(stem);
  g.add(mesh(box(0.04, 0.03, 0.36), black, 0.37, 0.76, 0), mesh(box(0.04, 0.04, 0.06), headM, 0.36, 0.6, 0, false));
  for (const s of [-1, 1]) { const d = mesh(new THREE.PlaneGeometry(0.2, 0.06), textMat('Xiaomi', { fg: '#FFFFFF', bg: '#18181B', w: 256, h: 80, font: '700 52px Arial, sans-serif' }), 0.31, 0.36, s * 0.022, false); d.rotation.set(0, s < 0 ? Math.PI : 0, -0.12); g.add(d); }
  g.userData = { deck: 0.12, pose: 'scoot', riderX: -0.05 };
  return g;
}

export function bicycle(colour = '#0EA5E9') {
  const g = new THREE.Group();
  for (const x of [0.25, -0.25]) g.add(mesh(new THREE.TorusGeometry(0.13, 0.015, 6, 18), tyreM, x, 0.14, 0));
  const fm = mat(colour);
  const bar = (x1, y1, x2, y2) => { const L = Math.hypot(x2 - x1, y2 - y1); const b = mesh(box(L, 0.02, 0.02), fm, (x1 + x2) / 2, (y1 + y2) / 2, 0); b.rotation.z = Math.atan2(y2 - y1, x2 - x1); g.add(b); };
  bar(-0.25, 0.14, 0, 0.14); bar(0, 0.14, 0.18, 0.36); bar(-0.05, 0.38, 0.18, 0.36); bar(-0.25, 0.14, -0.05, 0.38); bar(0.25, 0.14, 0.18, 0.36);
  g.add(mesh(box(0.1, 0.02, 0.06), tyreM, -0.06, 0.4, 0), mesh(box(0.02, 0.02, 0.24), tyreM, 0.19, 0.44, 0));
  g.userData = { seat: 0.4, pose: 'ride', riderX: -0.06 };
  return g;
}

// Airbus A380-style double-decker in a plain white livery with "A380" on the fin. Length ≈ 5.6; wheels touch y = 0
// when the group sits at y = GEAR. userData.gear = the landing-gear group (hide it once airborne).
export const GEAR = 0.6;
export function a380() {
  const root = new THREE.Group(), g = new THREE.Group(); root.add(g); g.position.y = GEAR;
  const white = mat('#F8FAFC', 'a380'), belly = mat('#CBD5E1', 'a380belly'), grey = mat('#94A3B8', 'a380eng'), blue = mat('#1D4ED8', 'a380blue');
  const R = 0.34;
  const fus = mesh(cyl(R, R, 4.4, 24), white, 0, 0, 0); fus.rotation.z = Math.PI / 2; fus.scale.set(1.22, 1, 1); g.add(fus);    // taller than wide: two decks
  const nose = mesh(new THREE.SphereGeometry(R, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), white, 2.2, 0, 0); nose.rotation.z = -Math.PI / 2; nose.scale.set(1.22, 1.5, 1); g.add(nose);
  const tail = mesh(cyl(R, 0.07, 1.4, 20), white, -2.9, 0.08, 0); tail.rotation.z = Math.PI / 2 + 0.08; tail.scale.set(1.15, 1, 1); g.add(tail);
  g.add(mesh(box(4.2, 0.12, 0.5), belly, -0.1, -0.33, 0, false));
  for (const s of [-1, 1]) {                                               // two decks of windows, cheatline, cockpit
    for (const y of [0.15, -0.05]) g.add(mesh(box(4.0, 0.035, 0.01), mat('#1E293B', 'win'), -0.15, y, s * (R + 0.004), false));
    g.add(mesh(box(4.2, 0.02, 0.01), blue, -0.1, -0.15, s * (R + 0.005), false));
    g.add(mesh(box(0.14, 0.06, 0.01), mat('#0F172A', 'cockpit'), 2.32, 0.16, s * 0.24, false));
  }
  const wingShape = new THREE.Shape([new THREE.Vector2(0.75, 0), new THREE.Vector2(-1.05, 0), new THREE.Vector2(-1.75, 2.7), new THREE.Vector2(-1.3, 2.7)]);
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.06, bevelEnabled: false }); wingGeo.rotateX(Math.PI / 2);
  for (const s of [-1, 1]) {
    const wing = mesh(wingGeo, white, 0, -0.16, 0); wing.scale.z = s; g.add(wing);
    g.add(mesh(box(0.4, 0.32, 0.03), white, -1.55, 0.0, s * 2.69));                                         // winglet
    for (const [ex, ez] of [[-0.2, 0.95], [-0.8, 1.75]]) {                                                    // four engines on pylons
      const e = mesh(cyl(0.12, 0.1, 0.55, 14), grey, ex, -0.36, s * ez); e.rotation.z = Math.PI / 2; g.add(e);
      g.add(mesh(cyl(0.085, 0.085, 0.02, 14), mat('#0F172A', 'intake'), ex + 0.28, -0.36, s * ez, false).rotateZ(Math.PI / 2));
      g.add(mesh(box(0.3, 0.14, 0.03), white, ex - 0.05, -0.24, s * ez));
    }
    const tp = mesh(new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-2.75, 0), new THREE.Vector2(-3.35, 0), new THREE.Vector2(-3.55, 1.0), new THREE.Vector2(-3.3, 1.0)]), { depth: 0.04, bevelEnabled: false }).rotateX(Math.PI / 2), white, 0, 0.12, 0); tp.scale.z = s; g.add(tp);
  }
  const fin = mesh(new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-2.4, 0.3), new THREE.Vector2(-3.3, 0.3), new THREE.Vector2(-3.6, 1.55), new THREE.Vector2(-3.15, 1.55)]), { depth: 0.05, bevelEnabled: false }), white, 0, 0, -0.025); g.add(fin);
  for (const s of [-1, 1]) { const t = mesh(new THREE.PlaneGeometry(0.62, 0.22), textMat('A380', { fg: '#1D4ED8', w: 320, h: 112, font: '900 88px Arial, sans-serif' }), -3.15, 0.95, s * 0.03, false); if (s < 0) t.rotation.y = Math.PI; g.add(t); }
  const gear = new THREE.Group(); g.add(gear);                            // nose gear + four main bogies
  const leg = (x, z, n) => { gear.add(mesh(box(0.04, 0.4, 0.04), mat('#64748B', 'strut'), x, -0.38, z)); for (let i = 0; i < n; i++) { const w = mesh(cyl(0.09, 0.09, 0.06, 12), tyreM, x + (i - (n - 1) / 2) * 0.2, -0.51, z); w.rotation.x = Math.PI / 2; gear.add(w); } };
  leg(1.8, 0, 1); for (const z of [-0.5, -0.22, 0.22, 0.5]) leg(-0.35, z, 2);
  root.userData.gear = gear;
  return root;
}

export function boat(kind = 'ferry') {
  const g = new THREE.Group();
  if (kind === 'ferry') {
    g.add(mesh(box(2.2, 0.3, 0.7), mat('#F8FAFC', 'hull'), 0, 0.15, 0), mesh(box(2.2, 0.06, 0.72), mat('#1D4ED8', 'hullband'), 0, 0.05, 0), mesh(box(1.2, 0.3, 0.55), mat('#E2E8F0', 'deckhouse'), -0.2, 0.45, 0), mesh(box(1.1, 0.05, 0.56), darkGlass, -0.2, 0.5, 0, false), mesh(cyl(0.06, 0.08, 0.3, 10), mat('#DC2626', 'funnel'), -0.4, 0.75, 0));
  } else {
    g.add(mesh(box(1.0, 0.18, 0.34), mat('#F8FAFC', 'hull'), 0, 0.09, 0), mesh(cyl(0.02, 0.02, 1.4, 6), mat('#475569', 'mast'), 0.05, 0.85, 0));
    const sail = new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(-0.6, 0), new THREE.Vector2(0, 1.2)]), { depth: 0.01, bevelEnabled: false }), mat('#FDF4E3', 'sail')); sail.position.set(0.03, 0.25, 0); g.add(sail);
  }
  return g;
}
