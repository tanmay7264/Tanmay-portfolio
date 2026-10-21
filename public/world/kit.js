// Shared building blocks for Tanmay's World: cached materials, mesh helpers, seeded randomness, night glow, text decals.
import * as THREE from 'three';
import { WORLD } from './world.config.js';

const mats = new Map();
export const mat = (c, key = c) => { if (!mats.has(key)) mats.set(key, new THREE.MeshStandardMaterial({ color: c, roughness: 0.85 })); return mats.get(key); };
export const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
export const cyl = (rt, rb, h, seg = 12) => new THREE.CylinderGeometry(rt, rb, h, seg);
export const mesh = (geo, m, x = 0, y = 0, z = 0, shadow = true) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = shadow; o.receiveShadow = true; return o; };

let seed = WORLD.seed || 11;
export const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;   // same world every visit
export const pick = a => a[Math.floor(rnd() * a.length)];
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const sstep = (a, b, x) => { const k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
export const ease = k => 1 - Math.pow(1 - clamp(k, 0, 1), 3);

export const litMats = [];                                            // materials that glow at night (windows, lamps, headlights)
export const glowAtNight = (m, c = '#FFD27A', k = 1) => { m.emissive = new THREE.Color(c); m.emissiveIntensity = 0; m.userData.k = k; litMats.push(m); return m; };

export function prism(len, base, height, m, x, y, z, alongX = false) {   // triangular gable roof; base sits at y
  const r = base / (2 * Math.sin(Math.PI / 3)), geo = new THREE.CylinderGeometry(r, r, len, 3, 1);
  geo.rotateX(-Math.PI / 2); if (alongX) geo.rotateY(Math.PI / 2);
  const o = mesh(geo, m, x, y + r / 2 * (height / (1.5 * r)), z); o.scale.y = height / (1.5 * r); return o;
}
export function hipRoof(w, d, hh, m, y) { const geo = new THREE.ConeGeometry(1, hh, 4); geo.rotateY(Math.PI / 4); const r = mesh(geo, m, 0, y + hh / 2, 0); r.scale.set(w / 1.414 * 1.12, 1, d / 1.414 * 1.12); return r; }

// A flat text decal (sign, logo-free brand name, tail lettering). Returns a material for a PlaneGeometry.
const texCache = new Map();
export function textMat(text, { bg = 'transparent', fg = '#FFFFFF', w = 512, h = 128, font = '700 72px "Space Grotesk", Arial, sans-serif', radius = 18, transparent = true } = {}) {
  const key = [text, bg, fg, w, h, font].join('|');
  if (!texCache.has(key)) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
    if (bg !== 'transparent') { g.fillStyle = bg; g.beginPath(); g.roundRect(2, 2, w - 4, h - 4, radius); g.fill(); }
    g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, w / 2, h / 2 + 4, w - 24);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    texCache.set(key, t);
  }
  return new THREE.MeshBasicMaterial({ map: texCache.get(key), transparent });
}
// Instanced copies of one geometry: list of items, fn(o3, item, i) positions an Object3D and may return a colour.
export function instanced(scene, geo, m, list, fn, shadow = true) {
  if (!list.length) return null;
  const im = new THREE.InstancedMesh(geo, m, list.length); im.castShadow = shadow; im.receiveShadow = true;
  const o = new THREE.Object3D();
  list.forEach((v, i) => { o.position.set(0, 0, 0); o.rotation.set(0, 0, 0); o.scale.set(1, 1, 1); const col = fn(o, v, i); o.updateMatrix(); im.setMatrixAt(i, o.matrix); if (col) im.setColorAt(i, new THREE.Color(col)); });
  scene.add(im); return im;
}
