import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Link as MuiLink,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { getDailyStats, getTopPosts } from "../api/stats";
import TimeSeriesChart from "../components/charts/TimeSeriesChart";
import PageMeta from "../components/PageMeta";

const RANGES = [7, 30, 90];
const fmt = (n) => n.toLocaleString("en-US");
const sum = (rows, key) => rows.reduce((s, r) => s + r[key], 0);

// Stat tile: label, value, and a signed delta against the previous period
function StatTile({ label, value, previous, days, loading }) {
  const change = previous > 0 ? Math.round(((value - previous) / previous) * 100) : null;
  const direction = change == null ? (value > 0 ? "up" : "flat") : change > 0 ? "up" : change < 0 ? "down" : "flat";
  const Icon = { up: TrendingUpIcon, down: TrendingDownIcon, flat: TrendingFlatIcon }[direction];
  const color = { up: "success.main", down: "error.main", flat: "text.secondary" }[direction];
  const text =
    change == null
      ? value > 0
        ? `new in the last ${days} days`
        : "no activity yet"
      : `${change > 0 ? "+" : ""}${change}% vs previous ${days} days`;

  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "16px" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 600, fontSize: "2rem", lineHeight: 1.25, my: 0.5 }}>
        {loading ? <Skeleton width={80} /> : fmt(value)}
      </Typography>
      {!loading && (
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color }}>
          <Icon sx={{ fontSize: 18 }} />
          <Typography variant="caption" sx={{ color }}>
            {text}
          </Typography>
        </Stack>
      )}
    </Paper>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: "16px" }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {subtitle}
      </Typography>
      {children}
    </Paper>
  );
}

function Stats() {
  const theme = useTheme();
  const [days, setDays] = useState(30);
  const [daily, setDaily] = useState(null); // 2 × days, so we can compare periods
  const [top, setTop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(false);
    Promise.all([getDailyStats(days * 2), getTopPosts(days)])
      .then(([rows, best]) => {
        if (ignore) return;
        setDaily(rows);
        setTop(best);
      })
      .catch(() => !ignore && setError(true))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [days]);

  const { current, previous } = useMemo(() => {
    const rows = daily ?? [];
    return { current: rows.slice(-days), previous: rows.slice(0, Math.max(0, rows.length - days)) };
  }, [daily, days]);

  const firstLoad = loading && !daily;
  const { first, second } = theme.palette.chart;

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto" }}>
      <PageMeta title="Stats" />

      <Typography variant="h3" component="h1" sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}>
        Stats
      </Typography>
      <Typography color="text.secondary" mb={3}>
        How readers are finding and responding to your stories.
      </Typography>

      {/* One filter row that scopes everything below */}
      <ToggleButtonGroup
        exclusive
        size="small"
        value={days}
        onChange={(_, v) => v && setDays(v)}
        aria-label="Date range"
        sx={{ mb: 3, bgcolor: "background.paper" }}
      >
        {RANGES.map((r) => (
          <ToggleButton key={r} value={r} sx={{ px: 2 }}>
            Last {r} days
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Couldn't load your stats. Try again in a moment.
        </Alert>
      )}

      {/* Refetch keeps the previous render, dimmed */}
      <Box sx={{ opacity: loading && daily ? 0.5 : 1, transition: "opacity .2s" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2, mb: 3 }}>
          <StatTile label="Views" value={sum(current, "views")} previous={sum(previous, "views")} days={days} loading={firstLoad} />
          <StatTile label="Likes" value={sum(current, "likes")} previous={sum(previous, "likes")} days={days} loading={firstLoad} />
          <StatTile label="Responses" value={sum(current, "comments")} previous={sum(previous, "comments")} days={days} loading={firstLoad} />
        </Box>

        <Stack spacing={3}>
          <ChartCard title="Views" subtitle="Reads of your published stories per day">
            {firstLoad ? (
              <Skeleton variant="rounded" height={240} />
            ) : (
              <TimeSeriesChart
                data={current}
                series={[{ key: "views", label: "Views", color: first }]}
                ariaLabel={`Views per day over the last ${days} days, ${fmt(sum(current, "views"))} in total. Use the arrow keys to read each day.`}
              />
            )}
          </ChartCard>

          <ChartCard title="Engagement" subtitle="Likes and responses per day">
            {firstLoad ? (
              <Skeleton variant="rounded" height={240} />
            ) : (
              <TimeSeriesChart
                data={current}
                series={[
                  { key: "likes", label: "Likes", color: first },
                  { key: "comments", label: "Responses", color: second },
                ]}
                ariaLabel={`Likes and responses per day over the last ${days} days. Use the arrow keys to read each day.`}
              />
            )}
          </ChartCard>

          {!firstLoad && (
            <Box>
              <Button size="small" onClick={() => setShowTable((v) => !v)} aria-expanded={showTable}>
                {showTable ? "Hide daily data" : "Show daily data as a table"}
              </Button>
              {showTable && (
                <TableContainer component={Paper} variant="outlined" sx={{ mt: 1.5, borderRadius: "14px", maxHeight: 360 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Day</TableCell>
                        <TableCell align="right">Views</TableCell>
                        <TableCell align="right">Likes</TableCell>
                        <TableCell align="right">Responses</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={{ "& td": { fontVariantNumeric: "tabular-nums" } }}>
                      {[...current].reverse().map((r) => (
                        <TableRow key={r.day}>
                          <TableCell>
                            {new Date(`${r.day}T00:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                          </TableCell>
                          <TableCell align="right">{r.views}</TableCell>
                          <TableCell align="right">{r.likes}</TableCell>
                          <TableCell align="right">{r.comments}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          <ChartCard title="Top stories" subtitle={`Your most-read stories in the last ${days} days`}>
            {!top && <Skeleton variant="rounded" height={160} />}
            {top?.length === 0 && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography color="text.secondary" mb={2}>
                  Publish a story to start seeing stats.
                </Typography>
                <Button component={Link} to="/write" variant="contained">
                  Write a story
                </Button>
              </Box>
            )}
            {top?.length > 0 && (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Story</TableCell>
                      <TableCell align="right">Views</TableCell>
                      <TableCell align="right">Likes</TableCell>
                      <TableCell align="right">Responses</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ "& td": { fontVariantNumeric: "tabular-nums" } }}>
                    {top.map((p) => (
                      <TableRow key={p.id} hover>
                        <TableCell sx={{ maxWidth: 420 }}>
                          <MuiLink
                            component={Link}
                            to={`/posts/${p.id}`}
                            color="text.primary"
                            underline="hover"
                            fontWeight={600}
                            sx={{ display: "block", whiteSpace: { xs: "normal", md: "nowrap" }, overflow: "hidden", textOverflow: "ellipsis" }}
                          >
                            {p.title}
                          </MuiLink>
                        </TableCell>
                        <TableCell align="right">{fmt(p.views)}</TableCell>
                        <TableCell align="right">{fmt(p.likes)}</TableCell>
                        <TableCell align="right">{fmt(p.comments)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </ChartCard>
        </Stack>
      </Box>
    </Box>
  );
}

export default Stats;
