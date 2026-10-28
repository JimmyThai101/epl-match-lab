export type CompareRow = {
  key: string;
  label: string;
  a: number;
  b: number;
};

export function barWidths(a: number, b: number) {
  const max = Math.max(a, b, 0);
  if (max <= 0) {
    return { a: 0, b: 0 };
  }
  return {
    a: Math.round((a / max) * 100),
    b: Math.round((b / max) * 100),
  };
}

export function radarPoint(
  index: number,
  total: number,
  value: number,
  max: number,
  cx: number,
  cy: number,
  radius: number,
) {
  const angle = -Math.PI / 2 + (index / total) * Math.PI * 2;
  const t = max <= 0 ? 0 : Math.max(0, value) / max;
  return {
    x: cx + Math.cos(angle) * radius * t,
    y: cy + Math.sin(angle) * radius * t,
  };
}

export function radarPolygon(rows: CompareRow[], side: "a" | "b", cx: number, cy: number, radius: number) {
  return rows
    .map((row, index) => {
      const max = Math.max(row.a, row.b, 0);
      const point = radarPoint(index, rows.length, side === "a" ? row.a : row.b, max, cx, cy, radius);
      return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
    })
    .join(" ");
}
