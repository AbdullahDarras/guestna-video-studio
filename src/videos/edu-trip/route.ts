export type Pt = { readonly x: number; readonly y: number };

/** Smooth Catmull-Rom route through the stations. `stationIdx[i]` is the sample index where station i sits. */
export const buildRoute = (pts: readonly Pt[], samples = 40) => {
  const out: Pt[] = [];
  const stationIdx: number[] = [];
  const P = [pts[0], ...pts, pts[pts.length - 1]];
  const cr = (a: number, b: number, c: number, d: number, t: number) =>
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
  for (let i = 0; i < pts.length - 1; i++) {
    stationIdx.push(out.length);
    const [p0, p1, p2, p3] = [P[i], P[i + 1], P[i + 2], P[i + 3]];
    for (let s = 0; s < samples; s++) {
      const t = s / samples;
      out.push({ x: cr(p0.x, p1.x, p2.x, p3.x, t), y: cr(p0.y, p1.y, p2.y, p3.y, t) });
    }
  }
  stationIdx.push(out.length);
  out.push(pts[pts.length - 1]);
  return { points: out, stationIdx };
};

/** Position at a fractional sample index. */
export const pointAt = (points: readonly Pt[], u: number): Pt => {
  const i = Math.max(0, Math.min(points.length - 1, Math.floor(u)));
  const j = Math.min(points.length - 1, i + 1);
  const f = Math.max(0, Math.min(1, u - i));
  return { x: points[i].x + (points[j].x - points[i].x) * f, y: points[i].y + (points[j].y - points[i].y) * f };
};

export const toPoints = (pts: readonly Pt[]) => pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
