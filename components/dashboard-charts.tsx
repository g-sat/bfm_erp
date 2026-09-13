"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CashflowPoint, ChartSlice, ProgressPoint } from "@/lib/types";

const ACCENT = "#e10600";
const INK = "#0a0a0a";
const MUTED = "#737373";
const GRID = "#e5e5e5";
const SURFACE = "#f5f5f5";

const STATUS_COLORS = [
  "#e10600",
  "#0a0a0a",
  "#f59e0b",
  "#10b981",
  "#6366f1",
  "#ec4899",
  "#14b8a6",
  "#78716c",
  "#a3a3a3",
];

function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-[var(--erp-border)] bg-[var(--erp-surface)] p-4 shadow-sm ${className}`}
    >
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-[var(--erp-ink)]">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-xs text-[var(--erp-muted)]">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

function tooltipStyle() {
  return {
    borderRadius: 8,
    border: "1px solid var(--erp-border)",
    background: "var(--erp-surface)",
    color: "var(--erp-ink)",
    fontSize: 12,
  };
}

export function StatusDonut({ data }: { data: ChartSlice[] }) {
  const rows = data.length ? data : [{ name: "No data", value: 1 }];
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <ChartCard title="Pipeline by status" subtitle="Where every project sits right now">
      <div className="flex h-64 flex-col items-center sm:flex-row">
        <div className="h-48 w-full sm:h-full sm:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rows}
                dataKey="value"
                nameKey="name"
                innerRadius="58%"
                outerRadius="82%"
                paddingAngle={2}
                stroke="none"
              >
                {rows.map((_, i) => (
                  <Cell key={i} fill={data.length ? STATUS_COLORS[i % STATUS_COLORS.length] : GRID} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle()} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="max-h-48 w-full space-y-1.5 overflow-y-auto sm:w-1/2 sm:pl-2">
          {data.length === 0 ? (
            <p className="text-xs text-[var(--erp-muted)]">No projects yet</p>
          ) : (
            data.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: STATUS_COLORS[i % STATUS_COLORS.length] }}
                />
                <span className="min-w-0 flex-1 truncate capitalize text-[var(--erp-ink)]">
                  {d.name.replaceAll("_", " ")}
                </span>
                <span className="tabular-nums text-[var(--erp-muted)]">
                  {d.value}
                  {total ? ` · ${Math.round((d.value / total) * 100)}%` : ""}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </ChartCard>
  );
}

export function CategoryBars({ data }: { data: ChartSlice[] }) {
  return (
    <ChartCard title="Work by category" subtitle="Creative mix across the book of work">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: MUTED, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: MUTED, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={tooltipStyle()} cursor={{ fill: SURFACE }} />
            <Bar dataKey="value" name="Projects" radius={[6, 6, 0, 0]} fill={ACCENT} maxBarSize={42} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function CashflowArea({ data }: { data: CashflowPoint[] }) {
  return (
    <ChartCard title="Cashflow (6 months)" subtitle="Inbound collections vs creator payouts">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="bfmInbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                <stop offset="100%" stopColor={ACCENT} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="bfmPayout" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={INK} stopOpacity={0.25} />
                <stop offset="100%" stopColor={INK} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle()} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="inbound"
              name="Inbound"
              stroke={ACCENT}
              fill="url(#bfmInbound)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="payout"
              name="Payouts"
              stroke={INK}
              fill="url(#bfmPayout)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function TalentPie({ data }: { data: ChartSlice[] }) {
  const rows = data.length ? data : [{ name: "None", value: 1 }];
  return (
    <ChartCard title="Talent availability" subtitle="Creative bench capacity">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={rows}
              dataKey="value"
              nameKey="name"
              outerRadius="75%"
              paddingAngle={2}
              label={({ name, percent }) =>
                data.length ? `${name} ${((percent ?? 0) * 100).toFixed(0)}%` : ""
              }
              labelLine={false}
            >
              {rows.map((d, i) => {
                const fill =
                  d.name === "available"
                    ? "#10b981"
                    : d.name === "busy"
                      ? "#f59e0b"
                      : STATUS_COLORS[i % STATUS_COLORS.length];
                return <Cell key={i} fill={data.length ? fill : GRID} stroke="none" />;
              })}
            </Pie>
            <Tooltip contentStyle={tooltipStyle()} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function InvoiceBars({ data }: { data: ChartSlice[] }) {
  return (
    <ChartCard title="Invoice status" subtitle="Billing health at a glance">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={72}
              tick={{ fill: MUTED, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={tooltipStyle()} cursor={{ fill: SURFACE }} />
            <Bar dataKey="value" name="Invoices" radius={[0, 6, 6, 0]} maxBarSize={22}>
              {data.map((d, i) => (
                <Cell
                  key={i}
                  fill={
                    d.name === "paid"
                      ? "#10b981"
                      : d.name === "sent"
                        ? "#f59e0b"
                        : d.name === "draft"
                          ? MUTED
                          : ACCENT
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function DeliveryBars({ data }: { data: ProgressPoint[] }) {
  return (
    <ChartCard title="Delivery progress" subtitle="Active projects by completion %">
      <div className="h-64">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[var(--erp-muted)]">
            No active delivery yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: MUTED, fontSize: 11 }}
                axisLine={false}
                unit="%"
              />
              <YAxis
                type="category"
                dataKey="name"
                width={64}
                tick={{ fill: MUTED, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle()}
                formatter={(value) => [`${value}%`, "Progress"]}
              />
              <Bar dataKey="progress" name="Progress" fill={ACCENT} radius={[0, 6, 6, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
