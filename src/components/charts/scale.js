// 0, 5, 10, 15… - round tick steps so the axis reads cleanly.
// Pass integer: true for counts so the axis never shows 0.5 likes.
export function niceTicks(max, { count = 4, integer = false } = {}) {
  if (max <= 0) return [0, 1];
  const raw = max / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  let step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw);
  if (integer) step = Math.max(1, Math.ceil(step));
  const top = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => +(i * step).toFixed(6));
}
