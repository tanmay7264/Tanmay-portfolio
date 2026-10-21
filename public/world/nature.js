// Trees by region: India gets broadleaf, coconut palms and banyans; Germany gets conifers and lime trees.
// All instanced (one draw call per part) and seeded, so the forest looks the same every visit.
import * as THREE from 'three';
import { mat, rnd, instanced } from './kit.js';

const leafM = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.9, flatShading: true });   // tinted per instance
const GREENS = { broad: ['#2F8F6B', '#3AA17A', '#27795C', '#4DB38A', '#5B9F45'], lime: ['#6BAF4B', '#7DBB55', '#5E9E44'], conifer: ['#1F5F45', '#245F3C', '#2E6B48'], palm: ['#3F9142', '#4CA34B', '#2F7D3A'], banyan: ['#2C7A4B', '#357F43'] };
const pickC = a => a[Math.floor(rnd() * a.length)];

export function plantTrees(scene, trees, at) {
  const kinds = { broad: [], lime: [], conifer: [], palm: [], banyan: [] };
  for (const [x, z, isle] of trees) {
    const r = rnd();
    const k = isle === 'germany' ? (r < 0.55 ? 'conifer' : 'lime') : (r < 0.45 ? 'broad' : r < 0.78 ? 'palm' : 'banyan');
    kinds[k].push([x, z, 0.8 + rnd() * 0.45, rnd() * Math.PI * 2]);
  }
  const bark = mat('#7A5A3E', 'bark'), palmBark = mat('#9C7A54', 'palmbark');
  // trunks for everything except palms
  const straight = [...kinds.broad, ...kinds.lime, ...kinds.conifer, ...kinds.banyan];
  instanced(scene, new THREE.CylinderGeometry(0.07, 0.12, 0.85, 6), bark, straight, (o, [x, z, s]) => { o.position.copy(at(x, z, 0.42 * s)); o.scale.set(s, s, s); });
  // broadleaf and lime: three overlapping leaf clusters
  const blobs = [];
  for (const [x, z, s, a] of kinds.broad) for (let i = 0; i < 3; i++) blobs.push([x + Math.cos(a + i * 2.1) * 0.28 * s, z + Math.sin(a + i * 2.1) * 0.28 * s, (1.0 + (i === 0 ? 0.35 : 0.1 * i)) * s, (0.5 + rnd() * 0.15) * s, pickC(GREENS.broad)]);
  for (const [x, z, s, a] of kinds.lime) for (let i = 0; i < 3; i++) blobs.push([x + Math.cos(a + i * 2.1) * 0.2 * s, z + Math.sin(a + i * 2.1) * 0.2 * s, (1.05 + i * 0.22) * s, (0.46 - i * 0.07) * s, pickC(GREENS.lime)]);
  instanced(scene, new THREE.IcosahedronGeometry(1, 0), leafM, blobs, (o, [x, z, y, r, c]) => { o.position.copy(at(x, z, y)); o.scale.set(r, r * 0.9, r); o.rotation.y = r * 7; return c; });
  // conifers: three stacked cones
  const cones = [];
  for (const [x, z, s] of kinds.conifer) for (let i = 0; i < 3; i++) cones.push([x, z, (0.75 + i * 0.42) * s, (0.62 - i * 0.16) * s, 0.75 * s, pickC(GREENS.conifer)]);
  instanced(scene, new THREE.ConeGeometry(1, 1, 7), leafM, cones, (o, [x, z, y, r, h, c]) => { o.position.copy(at(x, z, y)); o.scale.set(r, h, r); return c; });
  // banyan: wide flat canopy over a thick trunk with hanging roots
  instanced(scene, new THREE.IcosahedronGeometry(1, 1), leafM, kinds.banyan, (o, [x, z, s]) => { o.position.copy(at(x, z, 1.15 * s)); o.scale.set(1.0 * s, 0.42 * s, 1.0 * s); return pickC(GREENS.banyan); });
  const roots = []; for (const [x, z, s, a] of kinds.banyan) for (let i = 0; i < 4; i++) roots.push([x + Math.cos(a + i * 1.6) * 0.6 * s, z + Math.sin(a + i * 1.6) * 0.6 * s, s]);
  instanced(scene, new THREE.CylinderGeometry(0.02, 0.025, 1, 5), bark, roots, (o, [x, z, s]) => { o.position.copy(at(x, z, 0.45 * s)); o.scale.set(1, 0.9 * s, 1); });
  // coconut palms: leaning segmented trunk + drooping fronds
  const segs = [], fronds = [], nuts = [];
  for (const [x, z, s, a] of kinds.palm) {
    const lean = 0.18 + rnd() * 0.15, lx = Math.cos(a) * lean, lz = Math.sin(a) * lean;
    for (let i = 0; i < 4; i++) segs.push([x + lx * i * 0.35 * s, z + lz * i * 0.35 * s, (0.2 + i * 0.4) * s, s, lx, lz]);
    const tx = x + lx * 1.5 * s, tz = z + lz * 1.5 * s, ty = 1.72 * s;
    for (let i = 0; i < 7; i++) fronds.push([tx, tz, ty, a + i * (Math.PI * 2 / 7), s, pickC(GREENS.palm)]);
    nuts.push([tx, tz, ty - 0.08 * s, s]);
  }
  instanced(scene, new THREE.CylinderGeometry(0.06, 0.075, 0.42, 6), palmBark, segs, (o, [x, z, y, s, lx, lz]) => { o.position.copy(at(x, z, y)); o.scale.set(s, s, s); o.rotation.set(lz * 1.2, 0, -lx * 1.2); });
  const frond = new THREE.BoxGeometry(0.75, 0.025, 0.16); frond.translate(0.375, 0, 0);
  instanced(scene, frond, leafM, fronds, (o, [x, z, y, ang, s, c]) => { o.position.copy(at(x, z, y)); o.rotation.set(0, ang, -0.45); o.scale.setScalar(s); return c; });
  instanced(scene, new THREE.SphereGeometry(0.07, 6, 5), mat('#6B4F2A', 'coconut'), nuts, (o, [x, z, y, s]) => { o.position.copy(at(x, z, y)); o.scale.setScalar(s * 1.4); });
}
