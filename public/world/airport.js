// Airports with a closed boundary: chain-link perimeter fence, security checkpoint (booth, guard, CCTV, boom barrier
// that lifts as Tanmay passes), control tower, runway centre-line, threshold stripes and edge lights.
// cfg (grid units): fence [[x,z]...] closed polygon, gate [x,z] on the fence, boothSide 'in'|'out', tower [x,z],
// runway [x, z, w, d] (top-left corner + size).
import * as THREE from 'three';
import { mat, box, cyl, mesh, glowAtNight, textMat, instanced } from './kit.js';

const linkM = new THREE.MeshStandardMaterial({ color: '#94A3B8', roughness: 0.6, transparent: true, opacity: 0.38, side: THREE.DoubleSide, depthWrite: false });
const edgeLightM = glowAtNight(new THREE.MeshStandardMaterial({ color: '#FDE68A', roughness: 0.4 }), '#FCD34D', 2.6);
const towerGlass = glowAtNight(new THREE.MeshStandardMaterial({ color: '#1E3A5F', roughness: 0.2, metalness: 0.4 }), '#7DD3FC', 1.2);
const GAP = 0.65, FH = 0.5;                                                  // half gate width, fence height

export function buildAirport(scene, cfg, { at, person, crowd }) {
  const blocks = [], posts = [], P = cfg.fence, n = P.length;
  const cx = P.reduce((s, p) => s + p[0], 0) / n, cz = P.reduce((s, p) => s + p[1], 0) / n;
  let gateInfo = null;
  for (let i = 0; i < n; i++) {
    const [ax, az] = P[i], [bx, bz] = P[(i + 1) % n], L = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / L, uz = (bz - az) / L;
    // does the gate sit on this edge? then leave a gap
    const gt = cfg.gate ? (cfg.gate[0] - ax) * ux + (cfg.gate[1] - az) * uz : -1, gd = cfg.gate ? Math.abs((cfg.gate[0] - ax) * uz - (cfg.gate[1] - az) * ux) : 9;
    const spans = gd < 0.05 && gt > 0 && gt < L ? [[0, gt - GAP], [gt + GAP, L]] : [[0, L]];
    if (spans.length === 2) gateInfo = { t: gt, ux, uz, ax, az };
    for (const [s0, s1] of spans) {
      if (s1 - s0 < 0.05) continue;
      const len = s1 - s0, mx = ax + ux * (s0 + len / 2), mz = az + uz * (s0 + len / 2), p = at(mx, mz), rot = Math.atan2(-uz, ux);
      const panel = mesh(box(len, FH, 0.01), linkM, p.x, FH / 2 + 0.02, p.z, false); panel.rotation.y = rot; scene.add(panel);
      const rail = mesh(box(len, 0.03, 0.03), mat('#64748B', 'rail'), p.x, FH + 0.03, p.z); rail.rotation.y = rot; scene.add(rail);
      for (let s = s0; s <= s1 + 0.001; s += Math.min(0.7, len)) posts.push([ax + ux * s, az + uz * s]);
      blocks.push([Math.min(ax + ux * s0, ax + ux * s1) - 0.05, Math.min(az + uz * s0, az + uz * s1) - 0.05, Math.abs(ux * len) + 0.1, Math.abs(uz * len) + 0.1]);
    }
  }
  instanced(scene, cyl(0.025, 0.025, FH + 0.08, 6), mat('#475569', 'fencepost'), posts, (o, [x, z]) => { o.position.copy(at(x, z, (FH + 0.08) / 2)); });

  // Security checkpoint at the gate
  let barrier = null, gatePos = null;
  if (gateInfo) {
    const { ux, uz } = gateInfo, gx = cfg.gate[0], gz = cfg.gate[1];
    let nx = uz, nz = -ux; if ((gx - cx) * nx + (gz - cz) * nz < 0) { nx = -nx; nz = -nz; }   // outward normal
    const side = cfg.boothSide === 'in' ? -1 : 1, rot = Math.atan2(-uz, ux);
    gatePos = at(gx, gz);
    const bxg = gx + ux * (GAP + 0.55) + nx * side * 0.4, bzg = gz + uz * (GAP + 0.55) + nz * side * 0.4;
    const booth = new THREE.Group(); booth.position.copy(at(bxg, bzg)); booth.rotation.y = rot; scene.add(booth);
    booth.add(mesh(box(0.55, 0.6, 0.45), mat('#F8FAFC', 'booth'), 0, 0.3, 0), mesh(box(0.66, 0.06, 0.56), mat('#1D4ED8', 'boothroof'), 0, 0.63, 0), mesh(box(0.56, 0.18, 0.46), mat('#1E293B', 'boothwin'), 0, 0.42, 0, false));
    for (const s of [-1, 1]) { const sg = mesh(new THREE.PlaneGeometry(0.5, 0.11), textMat('SECURITY', { bg: '#1D4ED8', fg: '#FFFFFF', w: 512, h: 112, font: '800 70px Arial, sans-serif' }), 0, 0.53, s * 0.231, false); if (s < 0) sg.rotation.y = Math.PI; booth.add(sg); }
    booth.add(mesh(cyl(0.02, 0.02, 0.9, 6), mat('#475569'), 0.3, 0.45, 0.25), mesh(box(0.12, 0.07, 0.07), mat('#111827', 'cctv'), 0.36, 0.92, 0.25));   // CCTV pole
    blocks.push([bxg - 0.5, bzg - 0.5, 1, 1]);
    const guard = person(0.58, { shirt: '#1E3A8A', pants: '#111827', style: 'cap' });
    guard.g.position.copy(at(bxg - ux * 0.55 + nx * side * 0.05, bzg - uz * 0.55 + nz * side * 0.05)); guard.g.rotation.y = Math.atan2(nx * side, nz * side); scene.add(guard.g);
    crowd.push({ f: guard, mode: 'stand', ph: 1.3, rate: 2 });
    // boom barrier: pivot on the booth side of the gap, red-and-white arm across it
    const px = gx + ux * GAP, pz = gz + uz * GAP;
    scene.add(mesh(box(0.1, 0.5, 0.1), mat('#334155', 'boompost'), at(px, pz).x, 0.25, at(px, pz).z));
    barrier = new THREE.Group(); barrier.position.copy(at(px, pz, 0.45)); barrier.rotation.y = Math.atan2(uz, -ux); scene.add(barrier);
    for (let k = 0; k < 6; k++) barrier.add(mesh(box(2 * GAP / 6, 0.05, 0.05), mat(k % 2 ? '#F8FAFC' : '#DC2626'), (k + 0.5) * (2 * GAP / 6), 0, 0));
  }

  // Control tower
  if (cfg.tower) {
    const t = new THREE.Group(); t.position.copy(at(...cfg.tower)); scene.add(t);
    t.add(mesh(cyl(0.18, 0.26, 2.6, 14), mat('#E2E8F0', 'tower'), 0, 1.3, 0), mesh(cyl(0.42, 0.3, 0.12, 16), mat('#CBD5E1', 'towerbase'), 0, 2.62, 0), mesh(cyl(0.42, 0.42, 0.4, 16), towerGlass, 0, 2.88, 0), mesh(cyl(0.48, 0.42, 0.08, 16), mat('#475569', 'towercap'), 0, 3.12, 0), mesh(cyl(0.015, 0.015, 0.6, 6), mat('#94A3B8'), 0, 3.45, 0));
    blocks.push([cfg.tower[0] - 0.5, cfg.tower[1] - 0.5, 1, 1]);
  }

  // Runway markings and edge lights
  if (cfg.runway) {
    const [rx, rz, rw, rd] = cfg.runway, alongX = rw > rd, L = alongX ? rw : rd, W = alongX ? rd : rw;
    const pt = (s, o) => alongX ? [rx + s, rz + rd / 2 + o] : [rx + rw / 2 + o, rz + s];
    const dashes = [], stripes = [], lights = [];
    for (let s = 1.6; s < L - 1.6; s += 1.2) dashes.push(pt(s, 0));
    for (const s of [0.55, L - 0.55]) for (let k = -3; k <= 3; k++) if (k) stripes.push(pt(s, k * W / 8));
    for (let s = 0.3; s < L; s += 1.4) lights.push(pt(s, W / 2 - 0.06), pt(s, -W / 2 + 0.06));
    const rotY = alongX ? 0 : Math.PI / 2, white = mat('#F8FAFC', 'rwpaint');
    instanced(scene, box(0.6, 0.012, 0.07), white, dashes, (o, [x, z]) => { o.position.copy(at(x, z, 0.031)); o.rotation.y = rotY; }, false);
    instanced(scene, box(0.7, 0.012, 0.09), white, stripes, (o, [x, z]) => { o.position.copy(at(x, z, 0.031)); o.rotation.y = rotY; }, false);
    instanced(scene, new THREE.SphereGeometry(0.045, 8, 6), edgeLightM, lights, (o, [x, z]) => { o.position.copy(at(x, z, 0.06)); }, false);
  }
  return {
    blocks, gatePos,
    update(dt, who) {                                                       // lift the barrier while Tanmay is near the gate
      if (!barrier) return;
      const want = who && gatePos && who.distanceTo(gatePos) < 1.7 ? 1.25 : 0;
      barrier.rotation.z += (want - barrier.rotation.z) * Math.min(1, dt * 4);
    },
  };
}
