import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { niceTicks } from "./scale";

const MARGIN = { top: 12, right: 40, bottom: 28, left: 40 };

const shortDate = (day) =>
  new Date(`${day}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

const fmt = (n) => n.toLocaleString("en-US");

/**
 * Line chart over days.
 * data:   [{ day: "2026-09-01", views: 3, ... }]
 * series: [{ key: "views", label: "Views", color: "#..." }]
 * A single series gets a soft area wash; two or more get a legend and end labels.
 */
function TimeSeriesChart({ data, series, height = 240, ariaLabel }) {
  const theme = useTheme();
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(null); // index of the hovered / focused day

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const surface = theme.palette.background.paper;
  const muted = theme.palette.text.secondary;
  const grid = theme.palette.chart.grid;
  const single = series.length === 1;

  const geometry = useMemo(() => {
    const innerW = Math.max(0, width - MARGIN.left - MARGIN.right);
    const innerH = height - MARGIN.top - MARGIN.bottom;
    const max = Math.max(0, ...data.flatMap((d) => series.map((s) => d[s.key])));
    const ticks = niceTicks(max, { integer: true });
    const top = ticks[ticks.length - 1];
    const x = (i) => MARGIN.left + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
    const y = (v) => MARGIN.top + innerH - (v / top) * innerH;
    return { innerW, innerH, ticks, x, y };
  }, [width, height, data, series]);

  const { innerH, ticks, x, y } = geometry;

  const pathFor = (key) => data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d[key])}`).join("");
  const areaFor = (key) =>
    `${pathFor(key)}L${x(data.length - 1)},${MARGIN.top + innerH}L${x(0)},${MARGIN.top + innerH}Z`;

  // ~5 date labels, always including the first and last day
  const xTickIdx = useMemo(() => {
    if (data.length <= 1) return [0];
    // fewer labels on narrow screens so dates never overlap
    const n = Math.min(width < 520 ? 3 : 5, data.length);
    return [...new Set(Array.from({ length: n }, (_, i) => Math.round((i / (n - 1)) * (data.length - 1))))];
  }, [data.length, width]);

  // End labels only when they don't collide; otherwise the legend + tooltip carry identity
  const last = data.length - 1;
  const endYs = series.map((s) => y(data[last]?.[s.key] ?? 0));
  const endLabelsFit = !single && endYs.every((a, i) => endYs.every((b, j) => i === j || Math.abs(a - b) >= 14));

  const indexFromEvent = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const ratio = (px - MARGIN.left) / Math.max(1, geometry.innerW);
    return Math.min(last, Math.max(0, Math.round(ratio * last)));
  };

  const handleKey = (e) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    setActive((cur) => {
      const i = cur ?? last;
      if (e.key === "Home") return 0;
      if (e.key === "End") return last;
      return Math.min(last, Math.max(0, i + (e.key === "ArrowRight" ? 1 : -1)));
    });
  };

  if (data.length === 0) {
    return (
      <Box sx={{ height, display: "grid", placeItems: "center" }}>
        <Typography color="text.secondary">No data for this period.</Typography>
      </Box>
    );
  }

  const activeRow = active != null ? data[active] : null;
  const tooltipLeft = active != null ? Math.min(Math.max(x(active), 90), width - 90) : 0;

  return (
    <Box>
      {!single && (
        <Stack direction="row" spacing={2.5} mb={1.5} aria-hidden="true">
          {series.map((s) => (
            <Stack key={s.key} direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 16, height: 2, borderRadius: 1, bgcolor: s.color }} />
              <Typography variant="body2" color="text.secondary">
                {s.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}

      <Box ref={wrapRef} sx={{ position: "relative", width: "100%", height }}>
        {width > 0 && (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={ariaLabel}
            tabIndex={0}
            onPointerMove={(e) => setActive(indexFromEvent(e))}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(last)}
            onBlur={() => setActive(null)}
            onKeyDown={handleKey}
            style={{ display: "block", outline: "none", touchAction: "pan-y" }}
          >
            {/* hairline gridlines + y ticks */}
            {ticks.map((t) => (
              <g key={t}>
                <line x1={MARGIN.left} x2={width - MARGIN.right} y1={y(t)} y2={y(t)} stroke={grid} strokeWidth={1} />
                <text x={MARGIN.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill={muted} style={{ fontVariantNumeric: "tabular-nums" }}>
                  {fmt(t)}
                </text>
              </g>
            ))}

            {/* x date labels */}
            {xTickIdx.map((i) => (
              <text
                key={i}
                x={x(i)}
                y={height - 8}
                textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"}
                fontSize={11}
                fill={muted}
              >
                {shortDate(data[i].day)}
              </text>
            ))}

            {single && <path d={areaFor(series[0].key)} fill={series[0].color} opacity={0.1} />}

            {series.map((s) => (
              <path
                key={s.key}
                d={pathFor(s.key)}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}

            {/* end markers with a surface ring, plus end labels when they fit */}
            {data.length > 0 &&
              series.map((s, i) => (
                <g key={s.key}>
                  <circle cx={x(last)} cy={endYs[i]} r={4} fill={s.color} stroke={surface} strokeWidth={2} />
                  {(single || endLabelsFit) && (
                    <text x={x(last) + 8} y={endYs[i]} dy="0.32em" fontSize={12} fontWeight={600} fill={theme.palette.text.primary}>
                      {fmt(data[last][s.key])}
                    </text>
                  )}
                </g>
              ))}

            {/* crosshair */}
            {active != null && (
              <g pointerEvents="none">
                <line x1={x(active)} x2={x(active)} y1={MARGIN.top} y2={MARGIN.top + innerH} stroke={muted} strokeWidth={1} />
                {series.map((s) => (
                  <circle key={s.key} cx={x(active)} cy={y(data[active][s.key])} r={4} fill={s.color} stroke={surface} strokeWidth={2} />
                ))}
              </g>
            )}
          </svg>
        )}

        {activeRow && (
          <Box
            role="status"
            sx={{
              position: "absolute",
              top: 0,
              left: tooltipLeft,
              transform: "translateX(-50%)",
              pointerEvents: "none",
              px: 1.5,
              py: 1,
              borderRadius: "10px",
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
              boxShadow: 3,
              minWidth: 140,
            }}
          >
            <Typography variant="caption" color="text.secondary" component="p" mb={0.5}>
              {new Date(`${activeRow.day}T00:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
            </Typography>
            {series.map((s) => (
              <Stack key={s.key} direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 12, height: 2, borderRadius: 1, bgcolor: s.color, flexShrink: 0 }} />
                <Typography fontWeight={700} sx={{ fontVariantNumeric: "tabular-nums" }}>
                  {fmt(activeRow[s.key])}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.label}
                </Typography>
              </Stack>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default TimeSeriesChart;
