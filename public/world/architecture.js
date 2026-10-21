// Distinct exteriors for every chapter building. The footprint (w, d) and room height (h) are unchanged so the opening
// interiors, construction sites and Tanmay's paths keep working; `z.tall` lets a façade rise above the room height.
// ext: shell parts that fade when the building opens (use sm()), roofG: parts that lift off, yard: outdoor items that stay.
// Front of every building is +z (the door); +x is the other camera-facing side.
import * as THREE from 'three';
import { mat, box, cyl, mesh, prism, hipRoof, textMat, glowAtNight } from './kit.js';
import { car } from './vehicles.js';

const DOOR = 0.45;                                                          // keep |x| < DOOR clear in front of the door

// Window panes on the four faces; rows = [[y, height], ...]
function windows(ext, glass, w, d, rows, { faces = ['f', 'r', 'b', 'l'], pane = 0.34, step = 0.62, door = true } = {}) {
  const spots = [];
  for (const [y, hh] of rows) for (const f of faces) {
    const len = f === 'f' || f === 'b' ? w : d, n = Math.max(1, Math.floor((len - 0.3) / step));
    for (let i = 0; i < n; i++) {
      const u = -len / 2 + (i + 0.5) * (len / n);
      if (f === 'f' && door && y < 1 && Math.abs(u) < DOOR + 0.1) continue;
      spots.push(f === 'f' ? [u, y, d / 2 + 0.016, 0, hh] : f === 'b' ? [u, y, -d / 2 - 0.016, 0, hh] : f === 'r' ? [w / 2 + 0.016, y, u, 1, hh] : [-w / 2 - 0.016, y, u, 1, hh]);
    }
  }
  if (!spots.length) return;
  const im = new THREE.InstancedMesh(box(pane, 1, 0.03), glass, spots.length), o = new THREE.Object3D();
  spots.forEach(([x, y, z, r, hh], i) => { o.position.set(x, y, z); o.rotation.set(0, r ? Math.PI / 2 : 0, 0); o.scale.set(1, hh, 1); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
  ext.add(im);
}
const door = (ext, sm, h, d, c = '#6B5A48', w = 0.5) => ext.add(mesh(box(w, h, 0.05), sm(c), 0, h / 2, d / 2 + 0.03, false));
function sign(parent, track, text, bg, fg, x, y, z, w, h, rotY = 0, font) {
  const m = track(textMat(text, { bg, fg, w: 768, h: Math.round(768 * h / w), font: font || `700 ${Math.round(0.55 * 768 * h / w)}px "Space Grotesk", Arial, sans-serif` }));
  const p = mesh(new THREE.PlaneGeometry(w, h), m, x, y, z, false); p.rotation.y = rotY; parent.add(p); return p;
}
function flag(yard, x, z, cols, h = 1.5) {
  yard.add(mesh(cyl(0.025, 0.03, h, 8), mat('#CBD5E1'), x, h / 2, z));
  cols.forEach((c, i) => yard.add(mesh(box(0.5, 0.1, 0.015), mat(c), x + 0.26, h - 0.08 - i * 0.1, z)));
}
const column = (ext, m, x, z, hh, y0 = 0, r = 0.07) => ext.add(mesh(cyl(r, r * 1.12, hh, 12), m, x, y0 + hh / 2, z));

const STYLES = {
  // SKN Sinhgad: Indian campus block with verandah corridors, maroon arch gate, flag
  'college-in'(z, P) {
    const { w, d } = z, H = z.tall || z.h, { ext, roofG, yard, sm, glass, track } = P;
    const body = mesh(box(w, H, d), sm('#E9D8A6'), 0, H / 2, 0); ext.add(body);
    windows(ext, glass, w, d, [[0.45, 0.4], [1.3, 0.4], [2.1, 0.4]].filter(r => r[0] < H - 0.2));
    const white = sm('#F8FAFC'), ledge = sm('#D6C08A');
    for (const y of [0.86, 1.72].filter(y => y < H - 0.3)) { ext.add(mesh(box(w + 0.1, 0.06, 0.34), ledge, 0, y, d / 2 + 0.13)); ext.add(mesh(box(w, 0.12, 0.02), white, 0, y + 0.1, d / 2 + 0.29, false)); }
    for (let x = -w / 2 + 0.08; x <= w / 2 - 0.07; x += 0.55) if (Math.abs(x) > DOOR) ext.add(mesh(box(0.07, H, 0.07), white, x, H / 2, d / 2 + 0.27));
    door(ext, sm, 0.75, d, '#7F1D1D', 0.55);
    roofG.add(mesh(box(w + 0.14, 0.14, d + 0.14), sm('#C2A878'), 0, H + 0.07, 0), mesh(cyl(0.2, 0.2, 0.35, 12), sm('#F1F5F9'), w / 2 - 0.5, H + 0.32, -d / 2 + 0.5));
    sign(ext, track, 'SKN SINHGAD COLLEGE OF ENGINEERING', '#7F1D1D', '#FDE68A', 0, H - 0.18, d / 2 + 0.31, Math.min(w * 0.85, 3.4), 0.24);
    const maroon = mat('#7F1D1D', 'maroon'), gz = d / 2 + 0.85;
    yard.add(mesh(box(0.18, 1.15, 0.2), maroon, -0.7, 0.575, gz), mesh(box(0.18, 1.15, 0.2), maroon, 0.7, 0.575, gz), mesh(box(1.62, 0.24, 0.22), maroon, 0, 1.25, gz));
    sign(yard, m => m, 'SKN SINHGAD', '#7F1D1D', '#FDE68A', 0, 1.25, gz + 0.115, 1.5, 0.2);
    flag(yard, w / 2 + 0.3, d / 2 + 0.55, ['#FF9933', '#FFFFFF', '#138808']);
    return { body, top: H + 0.5 };
  },
  // WeSchool: modern glass-and-concrete block, vertical fins, violet canopy and rooftop name
  'college-modern'(z, P, { wall = '#E7E5E4', accent = '#7C3AED', label = 'WESCHOOL' } = {}) {
    const { w, d } = z, H = z.tall || z.h, { ext, roofG, yard, sm, glass, track } = P;
    const body = mesh(box(w, H, d), sm(wall), 0, H / 2, 0); ext.add(body);
    const curtain = glass;
    ext.add(mesh(box(w - 0.1, H - 0.95, 0.03), curtain, 0, 0.75 + (H - 0.95) / 2, d / 2 + 0.016, false), mesh(box(0.03, H - 0.95, d - 0.1), curtain, w / 2 + 0.016, 0.75 + (H - 0.95) / 2, 0, false));
    windows(ext, glass, w, d, [[0.38, 0.4]], { faces: ['f', 'r'] });
    for (let x = -w / 2 + 0.2; x <= w / 2 - 0.15; x += 0.42) ext.add(mesh(box(0.05, H - 0.85, 0.16), sm('#FAFAF9'), x, 0.75 + (H - 0.85) / 2, d / 2 + 0.09));
    for (let q = -d / 2 + 0.2; q <= d / 2 - 0.15; q += 0.42) ext.add(mesh(box(0.16, H - 0.85, 0.05), sm('#FAFAF9'), w / 2 + 0.09, 0.75 + (H - 0.85) / 2, q));
    door(ext, sm, 0.62, d, '#334155', 0.6);
    const violet = sm(accent);
    ext.add(mesh(box(1.9, 0.07, 0.85), violet, 0, 0.74, d / 2 + 0.4));
    for (const s of [-1, 1]) ext.add(mesh(box(0.06, 0.72, 0.06), sm('#F5F5F4'), s * 0.88, 0.36, d / 2 + 0.78));
    roofG.add(mesh(box(w + 0.1, 0.12, d + 0.1), sm('#A8A29E'), 0, H + 0.06, 0), mesh(box(1.0, 0.5, 0.8), sm('#D6D3D1'), -w / 2 + 0.8, H + 0.37, -d / 2 + 0.6), mesh(box(2.4, 0.42, 0.06), violet, 0, H + 0.33, d / 2 - 0.15));
    sign(roofG, track, label, accent, '#FFFFFF', 0, H + 0.33, d / 2 - 0.115, 2.3, 0.38);
    return { body, top: H + 0.7 };
  },
  // Chair of IS Management (WIAI): modern German university institute, sandstone and blue
  institute(z, P) { return STYLES['college-modern'](z, P, { wall: '#E4D3B0', accent: '#0284C7', label: 'WIAI · IS MANAGEMENT' }); },
  // Universität Bamberg: sandstone, steep red roof with dormers, columned portico, pediment clock
  'college-eu'(z, P) {
    const { w, d } = z, H = z.tall || z.h, { ext, roofG, yard, sm, glass, track } = P;
    const body = mesh(box(w, H, d), sm('#D9C29A'), 0, H / 2, 0); ext.add(body);
    windows(ext, glass, w, d, [[0.6, 0.55], [1.55, 0.55]], { pane: 0.3, step: 0.55 });
    ext.add(mesh(box(w + 0.14, 0.09, d + 0.14), sm('#C9B183'), 0, H, 0), mesh(box(w + 0.06, 0.05, d + 0.06), sm('#C9B183'), 0, 1.08, 0));
    door(ext, sm, 0.8, d, '#5B3A1E', 0.5);
    const stone = sm('#EFE6D2'), colH = Math.min(1.45, H * 0.62);
    ext.add(mesh(box(2.2, 0.07, 0.62), stone, 0, 0.035, d / 2 + 0.3), mesh(box(2.0, 0.07, 0.5), stone, 0, 0.1, d / 2 + 0.26));
    for (const x of [-0.82, -0.32, 0.32, 0.82]) column(ext, stone, x, d / 2 + 0.36, colH, 0.13);
    ext.add(mesh(box(2.0, 0.12, 0.5), stone, 0, colH + 0.19, d / 2 + 0.3), prism(0.5, 2.05, 0.45, stone, 0, colH + 0.25, d / 2 + 0.3));
    sign(ext, track, 'UNIVERSITÄT BAMBERG', '#EFE6D2', '#5B3A1E', 0, colH + 0.19, d / 2 + 0.556, 1.9, 0.1);
    const clock = mesh(cyl(0.13, 0.13, 0.03, 20), sm('#FFFFFF'), 0, colH + 0.42, d / 2 + 0.53, false); clock.rotation.x = Math.PI / 2; ext.add(clock);
    const red = sm('#9A3412');
    roofG.add(hipRoof(w, d, 1.25, red, H));
    for (const x of [-1.3, 0, 1.3]) roofG.add(mesh(box(0.32, 0.28, 0.32), sm('#EFE6D2'), x, H + 0.32, d / 2 - 0.5), prism(0.36, 0.38, 0.2, red, x, H + 0.46, d / 2 - 0.5));
    flag(yard, w / 2 + 0.3, d / 2 + 0.5, ['#111111', '#DD0000', '#FFCE00']);
    return { body, top: H + 1.35 };
  },
  // Apexon: blue glass IT tower with floor ribbons, rooftop name sign, canopy and car park
  'it-tower'(z, P) {
    const { w, d } = z, H = z.tall || z.h, { ext, roofG, yard, sm, glass, track } = P;
    const body = mesh(box(w, H, d), sm('#1E3A8A'), 0, H / 2, 0); ext.add(body);
    ext.add(mesh(box(w + 0.01, 0.56, d + 0.01), sm('#93C5FD'), 0, 0.29, 0));
    for (let y = 0.6; y < H - 0.2; y += 0.6) { ext.add(mesh(box(w + 0.02, 0.05, d + 0.02), sm('#CBD5E1'), 0, y, 0)); ext.add(mesh(box(w + 0.008, 0.3, d + 0.008), glass, 0, y + 0.3, 0, false)); }
    for (let x = -w / 2 + 0.3; x < w / 2; x += 0.6) ext.add(mesh(box(0.03, H, 0.03), sm('#CBD5E1'), x, H / 2, d / 2 + 0.005, false));
    for (let q = -d / 2 + 0.3; q < d / 2; q += 0.6) ext.add(mesh(box(0.03, H, 0.03), sm('#CBD5E1'), w / 2 + 0.005, H / 2, q, false));
    door(ext, sm, 0.5, d, '#0F172A', 0.6);
    ext.add(mesh(box(1.5, 0.06, 0.65), sm('#F8FAFC'), 0, 0.6, d / 2 + 0.32));
    roofG.add(mesh(box(w + 0.08, 0.12, d + 0.08), sm('#334155'), 0, H + 0.06, 0), mesh(box(0.6, 0.3, 0.5), sm('#94A3B8'), -w / 2 + 0.6, H + 0.27, -d / 2 + 0.6), mesh(box(0.6, 0.3, 0.5), sm('#94A3B8'), -w / 2 + 1.4, H + 0.27, -d / 2 + 0.6));
    roofG.add(mesh(box(2.5, 0.5, 0.06), sm('#0F172A'), 0, H + 0.42, d / 2 - 0.2));
    sign(roofG, track, 'APEXON', '#0F172A', '#60A5FA', 0, H + 0.42, d / 2 - 0.165, 2.4, 0.46);
    yard.add(mesh(box(1.25, 0.02, d - 0.2), mat('#334155', 'asphalt'), w / 2 + 0.85, 0.02, 0, false));
    for (const [q, c] of [[-0.7, '#F8FAFC'], [0.7, '#DC2626']]) { const v = car('sedan', c); v.position.set(w / 2 + 0.85, 0.02, q); v.rotation.y = Math.PI / 2; yard.add(v); }
    return { body, top: H + 0.75, blocks: [[w / 2 + 0.2, -d / 2 + 0.1, 1.3, d - 0.2]] };
  },
  // Autohaus Sperber: white BMW showroom, glass front, blue band, pylon sign and display cars
  showroom(z, P) {
    const { w, d } = z, H = z.tall || z.h, { ext, roofG, yard, sm, glass, track } = P;
    const body = mesh(box(w, H, d), sm('#F8FAFC'), 0, H / 2, 0); ext.add(body);
    const front = sm('#BFDBFE');
    ext.add(mesh(box(w - 0.3, H * 0.68, 0.03), front, 0, 0.1 + H * 0.34, d / 2 + 0.016, false), mesh(box(0.03, H * 0.68, d - 0.3), front, w / 2 + 0.016, 0.1 + H * 0.34, 0, false));
    const blue = sm('#1C69D4');
    ext.add(mesh(box(w + 0.05, H * 0.2, d + 0.05), blue, 0, H - H * 0.1, 0), mesh(box(w + 0.06, 0.03, d + 0.06), sm('#FFFFFF'), 0, H * 0.8 - 0.02, 0));
    sign(ext, track, 'AUTOHAUS SPERBER · BMW', '#1C69D4', '#FFFFFF', 0, H - H * 0.1, d / 2 + 0.03, w * 0.92, H * 0.17);
    sign(ext, track, 'BMW', '#1C69D4', '#FFFFFF', w / 2 + 0.03, H - H * 0.1, 0, d * 0.5, H * 0.17, Math.PI / 2);
    door(ext, sm, 0.7, d, '#94A3B8', 0.55);
    roofG.add(mesh(box(w + 0.1, 0.08, d + 0.1), sm('#E2E8F0'), 0, H + 0.04, 0));
    const px = w / 2 + 0.35, pz = d / 2 + 0.55;
    yard.add(mesh(box(0.24, 1.7, 0.12), mat('#0F172A', 'pylon'), px, 0.85, pz));
    sign(yard, m => m, 'BMW', '#1C69D4', '#FFFFFF', px, 1.45, pz + 0.062, 0.22, 0.34, 0, '900 300px Arial, sans-serif');
    sign(yard, m => m, 'SPERBER', '#0F172A', '#FFFFFF', px, 1.08, pz + 0.062, 0.22, 0.12);
    for (const [x, zz, r, k, c] of [[-w / 2 + 0.7, d / 2 + 0.75, 0.55, 'sedan', '#0F172A'], [w / 2 - 0.65, d / 2 + 0.85, -0.5, 'suv', '#E5E7EB']]) { const v = car(k, c); v.position.set(x, 0.02, zz); v.rotation.y = r; yard.add(v); }
    return { body, top: H + 0.3 };
  },
  // Airports: glass terminal under a vaulted metal roof, optional jet bridge
  terminal(z, P) {
    const { w, d } = z, H = z.tall || z.h, { ext, roofG, yard, sm, glass, track } = P;
    const body = mesh(box(w, H, d), sm('#E2E8F0'), 0, H / 2, 0); ext.add(body);
    ext.add(mesh(box(w - 0.2, H - 0.3, 0.03), glass, 0, (H - 0.3) / 2 + 0.05, d / 2 + 0.016, false), mesh(box(0.03, H - 0.3, d - 0.2), glass, w / 2 + 0.016, (H - 0.3) / 2 + 0.05, 0, false));
    for (let x = -w / 2 + 0.2; x < w / 2; x += 0.4) ext.add(mesh(box(0.03, H - 0.3, 0.035), sm('#94A3B8'), x, (H - 0.3) / 2 + 0.05, d / 2 + 0.02, false));
    door(ext, sm, 0.6, d, '#475569', 0.6);
    const r = d / 2 + 0.2, vault = new THREE.CylinderGeometry(r, r, w + 0.4, 28, 1, false, 0, Math.PI); vault.rotateZ(Math.PI / 2);
    const roof = mesh(vault, sm('#94A3B8'), 0, H, 0); roof.scale.y = 0.42; roofG.add(roof);
    sign(ext, track, '✈ ' + (z.signText || 'AIRPORT'), '#0F172A', '#FDE68A', 0, H - 0.12, d / 2 + 0.035, Math.min(2.4, w * 0.8), 0.22);
    if (z.bridge) {                                                          // jet bridge toward the stand
      const s = z.bridge, bx = s * (w / 2 + 0.7);
      ext.add(mesh(box(1.4, 0.28, 0.32), sm('#CBD5E1'), bx, 0.75, 0.3), mesh(box(0.12, 0.6, 0.12), sm('#64748B'), s * (w / 2 + 1.25), 0.3, 0.3));
    }
    return { body, top: H + r * 0.42 + 0.2 };
  },
  // The Socials Web: brick creative studio, big black-framed windows, neon sign, rooftop planters
  studio(z, P) {
    const { w, d } = z, H = z.tall || z.h, { ext, roofG, yard, sm, glass, track } = P;
    const body = mesh(box(w, H, d), sm('#9A3B2E'), 0, H / 2, 0); ext.add(body);
    for (let y = 0.3; y < H; y += 0.3) ext.add(mesh(box(w + 0.006, 0.012, d + 0.006), sm('#B4695B'), 0, y, 0, false));   // mortar courses
    windows(ext, glass, w, d, [[0.55, 0.55], [1.35, 0.45]].filter(r => r[0] < H - 0.25), { pane: 0.6, step: 0.85 });
    door(ext, sm, 0.75, d, '#111827', 0.55);
    sign(ext, track, 'THE SOCIALS WEB', 'transparent', '#F472B6', 0, H - 0.2, d / 2 + 0.02, Math.min(w * 0.85, 2.8), 0.3, 0, '800 120px "Space Grotesk", Arial, sans-serif');
    roofG.add(mesh(box(w + 0.1, 0.1, d + 0.1), sm('#57534E'), 0, H + 0.05, 0));
    for (const x of [-1.2, -0.4, 0.4, 1.2]) roofG.add(mesh(box(0.45, 0.16, 0.3), sm('#7C5A3A'), x, H + 0.18, -d / 2 + 0.4), mesh(new THREE.IcosahedronGeometry(0.17, 0), sm('#3AA17A'), x, H + 0.36, -d / 2 + 0.4));
    return { body, top: H + 0.5 };
  },
  // Lonavala Villas: two-level villa with balcony, terracotta roof and a pool deck
  villa(z, P) {
    const { w, d } = z, { ext, roofG, yard, sm, glass, track } = P, G = 1.0, U = 0.8;
    const body = mesh(box(w, G, d), sm('#FAFAF9'), 0, G / 2, 0); ext.add(body);
    windows(ext, glass, w, d, [[0.55, 0.45]], { pane: 0.55, step: 0.8 });
    door(ext, sm, 0.72, d, '#92400E', 0.5);
    const uw = w * 0.62, ud = d * 0.68, ux = -w * 0.15, uz = -0.3;
    ext.add(mesh(box(uw, U, ud), sm('#FDE7C8'), ux, G + U / 2, uz), mesh(box(w + 0.08, 0.07, d + 0.08), sm('#D6D3D1'), 0, G, 0));
    for (const x of [-0.55, 0.05]) ext.add(mesh(box(0.42, 0.42, 0.03), glass, ux + x, G + 0.42, uz + ud / 2 + 0.016, false));
    ext.add(mesh(box(uw, 0.05, 0.5), sm('#E7E5E4'), ux, G + 0.03, uz + ud / 2 + 0.25), mesh(box(uw, 0.22, 0.02), sm('#BAE6FD'), ux, G + 0.15, uz + ud / 2 + 0.5, false));
    const ur = hipRoof(uw + 0.3, ud + 0.3, 0.55, sm('#C2410C'), G + U); ur.position.x = ux; ur.position.z = uz; roofG.add(ur);
    sign(ext, track, 'LONAVALA VILLAS', 'transparent', '#C2410C', w * 0.2, G - 0.17, d / 2 + 0.02, 1.4, 0.16);
    yard.add(mesh(box(0.72, 0.05, d * 0.9), mat('#A16207', 'deck'), w / 2 + 0.42, 0.03, 0, false));
    for (const q of [-0.6, 0.3]) yard.add(mesh(box(0.22, 0.08, 0.5), mat('#F8FAFC'), w / 2 + 0.42, 0.1, q), mesh(box(0.22, 0.18, 0.06), mat('#F8FAFC'), w / 2 + 0.42, 0.18, q - 0.24));
    return { body, top: G + U + 0.6 };
  },
  // BatchMates HQ: bright co-working block with a cyan stripe, glazing and a rooftop terrace
  startup(z, P) {
    const { w, d } = z, H = z.tall || z.h, { ext, roofG, yard, sm, glass, track } = P;
    const body = mesh(box(w, H, d), sm('#F1F5F9'), 0, H / 2, 0); ext.add(body);
    windows(ext, glass, w, d, [[0.48, 0.5], [1.25, 0.5], [2.0, 0.5]].filter(r => r[0] < H - 0.3), { pane: 0.52, step: 0.7 });
    ext.add(mesh(box(0.35, H, 0.03), sm('#06B6D4'), w / 2 - 0.35, H / 2, d / 2 + 0.02, false), mesh(box(0.03, H, 0.35), sm('#06B6D4'), w / 2 + 0.02, H / 2, d / 2 - 0.35, false));
    door(ext, sm, 0.66, d, '#0E7490', 0.6);
    sign(ext, track, 'BATCHMATES', '#FFFFFF', '#0891B2', -0.4, H - 0.2, d / 2 + 0.02, 2.0, 0.28);
    roofG.add(mesh(box(w + 0.08, 0.1, d + 0.08), sm('#CBD5E1'), 0, H + 0.05, 0));
    for (const [x, zz, c] of [[-0.9, 0, '#06B6D4'], [0.8, -0.4, '#F97316']]) roofG.add(mesh(cyl(0.02, 0.02, 0.6, 6), sm('#475569'), x, H + 0.4, zz), mesh(new THREE.ConeGeometry(0.42, 0.18, 10), sm(c), x, H + 0.72, zz), mesh(cyl(0.16, 0.16, 0.03, 12), sm('#F8FAFC'), x, H + 0.3, zz));
    for (const [x, zz, L, D] of [[0, d / 2, w, 0.03], [0, -d / 2, w, 0.03], [w / 2, 0, 0.03, d], [-w / 2, 0, 0.03, d]]) roofG.add(mesh(box(L, 0.2, D), sm('#94A3B8'), x, H + 0.2, zz, false));
    return { body, top: H + 0.85 };
  },
  // Nurture+: family home with a gable roof, porch, picket fence and a swing
  home(z, P) {
    const { w, d } = z, H = z.tall || z.h, { ext, roofG, yard, sm, glass, track } = P;
    const body = mesh(box(w, H, d), sm('#FEF3C7'), 0, H / 2, 0); ext.add(body);
    windows(ext, glass, w, d, [[0.7, 0.45]], { pane: 0.42, step: 0.9 });
    door(ext, sm, 0.75, d, '#7C2D12', 0.45);
    for (const s of [-1, 1]) ext.add(mesh(box(0.06, 0.95, 0.06), sm('#FFFFFF'), s * 0.62, 0.475, d / 2 + 0.52));
    const porch = mesh(box(1.5, 0.06, 0.65), sm('#B45309'), 0, 0.97, d / 2 + 0.3); porch.rotation.x = 0.12; ext.add(porch);
    roofG.add(prism(w + 0.2, d + 0.3, 0.95, sm('#B45309'), 0, H, 0, true), mesh(box(0.25, 0.55, 0.25), sm('#9A3412'), w / 4, H + 0.55, -d / 4));
    sign(ext, track, 'NURTURE+', 'transparent', '#B45309', 0, H - 0.18, d / 2 + 0.02, 1.2, 0.2);
    const picket = mat('#FFFFFF', 'picket'), fz = d / 2 + 0.95, list = [];
    for (let x = -w / 2; x <= w / 2; x += 0.15) if (Math.abs(x) > DOOR) list.push([x, fz]);
    for (let q = d / 2 + 0.1; q < fz; q += 0.15) list.push([-w / 2, q], [w / 2, q]);
    const im = new THREE.InstancedMesh(box(0.04, 0.3, 0.03), picket, list.length), o = new THREE.Object3D();
    list.forEach(([x, q], i) => { o.position.set(x, 0.15, q); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }); yard.add(im);
    const sx = -w / 2 - 0.55, wood = mat('#92400E', 'swingwood');
    for (const s of [-1, 1]) { const a = mesh(box(0.05, 0.85, 0.05), wood, sx, 0.4, s * 0.45); a.rotation.x = s * 0.25; yard.add(a); }
    yard.add(mesh(box(0.05, 0.05, 1.0), wood, sx, 0.82, 0), mesh(box(0.25, 0.03, 0.15), mat('#EF4444'), sx, 0.3, 0), mesh(box(0.01, 0.5, 0.01), mat('#475569'), sx, 0.56, -0.06), mesh(box(0.01, 0.5, 0.01), mat('#475569'), sx, 0.56, 0.06));
    return { body, top: H + 1.1 };
  },
  // Vatsalya Trust (GCL): community hall with wide green eaves, banner and steps
  hall(z, P) {
    const { w, d } = z, H = z.tall || z.h, { ext, roofG, yard, sm, glass, track } = P;
    const body = mesh(box(w, H, d), sm('#F3E8D2'), 0, H / 2, 0); ext.add(body);
    windows(ext, glass, w, d, [[0.75, 0.6]], { pane: 0.45, step: 0.8 });
    ext.add(mesh(box(w + 0.04, 0.12, d + 0.04), sm('#15803D'), 0, 0.06, 0), mesh(box(1.4, 0.06, 0.4), sm('#E7E5E4'), 0, 0.03, d / 2 + 0.2));
    door(ext, sm, 0.85, d, '#14532D', 0.7);
    sign(ext, track, 'VATSALYA TRUST · GCL', '#15803D', '#FFFFFF', 0, H * 0.78, d / 2 + 0.02, Math.min(w * 0.8, 3), 0.26);
    roofG.add(hipRoof(w + 0.7, d + 0.7, 0.75, sm('#166534'), H));
    return { body, top: H + 0.85 };
  },
  // SIRP Library: classical stone colonnade, pediment and steps
  library(z, P) {
    const { w, d } = z, H = z.tall || z.h, { ext, roofG, yard, sm, glass, track } = P;
    const body = mesh(box(w, H, d), sm('#E7E0D0'), 0, H / 2, 0); ext.add(body);
    windows(ext, glass, w, d, [[0.8, 0.7]], { faces: ['r', 'b', 'l'], pane: 0.3, step: 0.7 });
    door(ext, sm, 0.8, d, '#5B3A1E', 0.5);
    const stone = sm('#F5F1E6'), colH = H * 0.86;
    ext.add(mesh(box(w + 0.2, 0.08, 0.6), stone, 0, 0.04, d / 2 + 0.3));
    for (const x of [-1.65, -1.05, -0.45, 0.45, 1.05, 1.65].filter(x => Math.abs(x) < w / 2)) column(ext, stone, x, d / 2 + 0.35, colH, 0.08, 0.075);
    ext.add(mesh(box(w + 0.1, 0.14, 0.6), stone, 0, colH + 0.15, d / 2 + 0.3), prism(0.6, w + 0.15, 0.5, stone, 0, colH + 0.22, d / 2 + 0.3));
    sign(ext, track, 'SIRP LIBRARY', '#F5F1E6', '#5B3A1E', 0, colH + 0.15, d / 2 + 0.605, 2.2, 0.12);
    roofG.add(mesh(box(w + 0.06, 0.1, d + 0.06), sm('#D6CFC0'), 0, H + 0.12, 0));
    return { body, top: H + 0.75 };
  },
  // AI Lab: white lab with a glowing cyan window band, satellite dish and solar panels
  lab(z, P) {
    const { w, d } = z, H = z.tall || z.h, { ext, roofG, yard, sm, glass, track } = P;
    const body = mesh(box(w, H, d), sm('#F8FAFC'), 0, H / 2, 0); ext.add(body);
    ext.add(mesh(box(w + 0.02, 0.3, d + 0.02), sm('#4338CA'), 0, 0.15, 0), mesh(box(w + 0.01, 0.38, d + 0.01), P.glow('#22D3EE'), 0, H - 0.55, 0, false));
    windows(ext, glass, w, d, [[0.7, 0.45]], { pane: 0.5, step: 0.75 });
    door(ext, sm, 0.6, d, '#312E81', 0.55);
    sign(ext, track, 'AI LAB', 'transparent', '#4338CA', w * 0.25, 1.05, d / 2 + 0.02, 1.0, 0.24);
    roofG.add(mesh(box(w + 0.08, 0.1, d + 0.08), sm('#CBD5E1'), 0, H + 0.05, 0), mesh(cyl(0.04, 0.06, 0.45, 8), sm('#94A3B8'), -w / 2 + 0.7, H + 0.32, d / 2 - 0.7));
    const dish = mesh(new THREE.SphereGeometry(0.42, 18, 10, 0, Math.PI * 2, 0, Math.PI / 3), sm('#F1F5F9'), -w / 2 + 0.7, H + 0.62, d / 2 - 0.7); dish.rotation.set(Math.PI + 0.7, 0, 0.5); roofG.add(dish);
    for (let i = 0; i < 4; i++) { const p = mesh(box(0.55, 0.03, 0.42), sm('#1E3A8A'), 0.1 + (i % 2) * 0.65, H + 0.22, -d / 2 + 0.45 + Math.floor(i / 2) * 0.55); p.rotation.x = -0.4; roofG.add(p); }
    return { body, top: H + 0.95 };
  },
  // Trophy Hall: cream museum with gold trim, corner columns and a giant trophy on the roof
  museum(z, P) {
    const { w, d } = z, H = z.tall || z.h, { ext, roofG, yard, sm, glass, track } = P;
    const body = mesh(box(w, H, d), sm('#FEF9E7'), 0, H / 2, 0); ext.add(body);
    const gold = sm('#D4A017');
    ext.add(mesh(box(w + 0.08, 0.1, d + 0.08), gold, 0, H - 0.05, 0), mesh(box(w + 0.06, 0.05, d + 0.06), gold, 0, 0.3, 0), mesh(box(w * 0.5, 0.07, 0.6), sm('#E7E5E4'), 0, 0.035, d / 2 + 0.3));
    for (const x of [-w / 2 + 0.15, w / 2 - 0.15]) column(ext, gold, x, d / 2 + 0.1, H - 0.1, 0, 0.09);
    windows(ext, glass, w, d, [[1.2, 0.6]], { faces: ['f', 'r'], pane: 0.4, step: 0.9 });
    door(ext, sm, 0.95, d, '#78350F', 0.8);
    sign(ext, track, 'TROPHY HALL', 'transparent', '#B45309', 0, H - 0.3, d / 2 + 0.02, 2.0, 0.26);
    const cup = new THREE.Group(); cup.position.set(0, H + 0.1, 0); roofG.add(mesh(box(w + 0.06, 0.1, d + 0.06), sm('#E7E5E4'), 0, H + 0.05, 0), cup);
    cup.add(mesh(box(0.5, 0.2, 0.5), gold, 0, 0.1, 0), mesh(cyl(0.07, 0.1, 0.35, 12), gold, 0, 0.37, 0), mesh(cyl(0.38, 0.15, 0.5, 18), gold, 0, 0.8, 0));
    for (const s of [-1, 1]) { const hnd = mesh(new THREE.TorusGeometry(0.16, 0.035, 8, 16, Math.PI), gold, s * 0.38, 0.85, 0); hnd.rotation.z = s * Math.PI / 2; cup.add(hnd); }
    return { body, top: H + 1.25 };
  },
  // Munich Tech Job Fair: barrel-vaulted exhibition hall with ribs and banners
  expo(z, P) {
    const { w, d } = z, { ext, roofG, yard, sm, glass, track } = P, W = 1.4;
    const body = mesh(box(w, W, d), sm('#E2E8F0'), 0, W / 2, 0); ext.add(body);
    ext.add(mesh(box(w - 0.3, W - 0.3, 0.03), glass, 0, W / 2, d / 2 + 0.016, false));
    door(ext, sm, 0.7, d, '#3F6212', 0.8);
    const r = d / 2 + 0.12, v = new THREE.CylinderGeometry(r, r, w + 0.2, 32, 1, false, 0, Math.PI); v.rotateZ(Math.PI / 2);
    const roof = mesh(v, sm('#ECFCCB'), 0, W, 0); roof.scale.y = 0.75; roofG.add(roof);
    for (let x = -w / 2; x <= w / 2 + 0.01; x += w / 4) { const rib = mesh(new THREE.TorusGeometry(r + 0.01, 0.03, 6, 24, Math.PI), sm('#65A30D'), x, W, 0); rib.rotation.y = Math.PI / 2; rib.scale.y = 0.75; roofG.add(rib); }
    sign(ext, track, 'TECH JOB FAIR · MÜNCHEN', '#3F6212', '#FFFFFF', 0, W - 0.12, d / 2 + 0.035, Math.min(w * 0.85, 3.2), 0.2);
    for (const [x, c] of [[-w / 2 + 0.3, '#3B82F6'], [-w / 2 + 0.75, '#84CC16'], [w / 2 - 0.3, '#F97316']]) yard.add(mesh(cyl(0.02, 0.02, 1.6, 6), mat('#475569'), x, 0.8, d / 2 + 0.55), mesh(box(0.02, 0.6, 0.3), mat(c), x, 1.2, d / 2 + 0.7));
    return { body, top: W + r * 0.75 + 0.2 };
  },
};

export function buildExterior(z, P) { return (STYLES[z.style] || STYLES.studio)(z, P); }
