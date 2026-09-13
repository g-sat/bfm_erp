"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Briefcase,
  ClipboardCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Building2,
} from "lucide-react";
import { api, money } from "@/lib/api";
import type { Dashboard } from "@/lib/types";
import { Badge, Card, PageHeader, Table } from "@/components/ui";
import {
  CashflowArea,
  CategoryBars,
  DeliveryBars,
  InvoiceBars,
  StatusDonut,
  TalentPie,
} from "@/components/dashboard-charts";

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  href,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tone?: "default" | "accent" | "warn" | "ok";
  href?: string;
}) {
  const tones = {
    default: "border-[var(--erp-border)] bg-[var(--erp-surface)]",
    accent: "border-[var(--erp-accent)]/25 bg-[var(--erp-accent-soft)]",
    warn: "border-[var(--erp-warn-border)] bg-[var(--erp-warn-bg)]",
    ok: "border-[var(--erp-ok-border)] bg-[var(--erp-ok-bg)]",
  };
  const iconTone = {
    default: "bg-[var(--erp-surface-2)] text-[var(--erp-ink)]",
    accent: "bg-[var(--erp-accent)] text-white",
    warn: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    ok: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  };
  const inner = (
    <div
      className={`rounded-xl border p-4 transition hover:shadow-md ${tones[tone]} ${
        href ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wide text-[var(--erp-muted)]">
            {label}
          </div>
          <div className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-[var(--erp-ink)]">
            {value}
          </div>
          {hint ? <div className="mt-1 text-xs text-[var(--erp-muted)]">{hint}</div> : null}
        </div>
        <div className={`rounded-lg p-2.5 ${iconTone[tone]}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function ProgressRing({ value }: { value: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg width="112" height="112" className="-rotate-90">
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke="var(--erp-surface-2)"
          strokeWidth="10"
        />
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke="var(--erp-accent)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-semibold tabular-nums text-[var(--erp-ink)]">{pct}%</div>
        <div className="text-[10px] uppercase tracking-wide text-[var(--erp-muted)]">Avg</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Dashboard>("/api/dashboard")
      .then((res) => setData(res.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const busyCreators = Math.max(0, (data?.creators ?? 0) - (data?.creators_available ?? 0));

  return (
    <div className="space-y-5">
      <PageHeader
        title="BOLDFRAME Command Center"
        subtitle="Live view of pipeline, talent, quality, and cash"
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {loading && !data ? (
        <p className="text-sm text-[var(--erp-muted)]">Loading command center…</p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Projects"
          value={String(data?.projects_active ?? "—")}
          hint={`${data?.projects_total ?? 0} total in book`}
          icon={Briefcase}
          tone="accent"
          href="/projects"
        />
        <StatCard
          label="In QA / Review"
          value={String(data?.projects_in_qa ?? "—")}
          hint={`${data?.quality_pending ?? 0} QA items pending`}
          icon={ClipboardCheck}
          tone="warn"
          href="/quality"
        />
        <StatCard
          label="Available Creatives"
          value={String(data?.creators_available ?? "—")}
          hint={`${busyCreators} busy · ${data?.creators ?? 0} total`}
          icon={Sparkles}
          tone="ok"
          href="/matching"
        />
        <StatCard
          label="Revenue Collected"
          value={money(data?.revenue_collected)}
          hint={`${money(data?.payouts_pending)} payouts pending`}
          icon={TrendingUp}
          href="/billing/payments"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Businesses"
          value={String(data?.businesses ?? "—")}
          icon={Building2}
          href="/businesses"
        />
        <StatCard
          label="Open Invoices"
          value={String(data?.invoices_open ?? "—")}
          icon={Wallet}
          tone="warn"
          href="/billing/invoices"
        />
        <StatCard
          label="Open Matches"
          value={String(data?.assignments_open ?? "—")}
          hint="Shortlisted / offered"
          icon={Users}
          href="/matching"
        />
        <StatCard
          label="Unread Alerts"
          value={String(data?.unread_notifications ?? "—")}
          icon={Bell}
          href="/notifications"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--erp-border)] bg-[var(--erp-surface)] p-4 shadow-sm lg:col-span-1">
          <h2 className="text-sm font-semibold text-[var(--erp-ink)]">Delivery pulse</h2>
          <p className="mt-0.5 text-xs text-[var(--erp-muted)]">Average progress across projects</p>
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-around lg:flex-col">
            <ProgressRing value={data?.avg_progress ?? 0} />
            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between rounded-lg bg-[var(--erp-surface-2)] px-3 py-2">
                <span className="text-[var(--erp-muted)]">Active</span>
                <span className="font-medium tabular-nums">{data?.projects_active ?? 0}</span>
              </div>
              <div className="flex justify-between rounded-lg bg-[var(--erp-surface-2)] px-3 py-2">
                <span className="text-[var(--erp-muted)]">In QA</span>
                <span className="font-medium tabular-nums">{data?.projects_in_qa ?? 0}</span>
              </div>
              <div className="flex justify-between rounded-lg bg-[var(--erp-surface-2)] px-3 py-2">
                <span className="text-[var(--erp-muted)]">Talent free</span>
                <span className="font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                  {data?.creators_available ?? 0}
                </span>
              </div>
              <Link
                href="/delivery"
                className="block text-center text-sm text-[var(--erp-accent)] hover:underline"
              >
                Open active delivery →
              </Link>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <CashflowArea data={data?.cashflow || []} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <StatusDonut data={data?.projects_by_status || []} />
        <CategoryBars data={data?.projects_by_category || []} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <TalentPie data={data?.creators_by_availability || []} />
        <InvoiceBars data={data?.invoices_by_status || []} />
        <DeliveryBars data={data?.delivery_progress || []} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Recent Projects</h2>
            <Link href="/projects" className="text-sm text-[var(--erp-accent)]">
              View all
            </Link>
          </div>
          <Table headers={["Code", "Title", "Client", "Status", "Progress"]}>
            {(data?.recent_projects || []).map((p) => (
              <tr key={p.id}>
                <td className="px-3 py-2 font-medium">
                  <Link href={`/projects/${p.id}`} className="text-[var(--erp-accent)]">
                    {p.code}
                  </Link>
                </td>
                <td className="px-3 py-2">{p.title}</td>
                <td className="px-3 py-2">{p.business?.name || p.business_id}</td>
                <td className="px-3 py-2">
                  <Badge>{p.status}</Badge>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--erp-surface-2)]">
                      <div
                        className="h-full rounded-full bg-[var(--erp-accent)]"
                        style={{ width: `${p.progress_pct}%` }}
                      />
                    </div>
                    <span className="tabular-nums text-xs text-[var(--erp-muted)]">
                      {p.progress_pct}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Recent Invoices</h2>
            <Link href="/billing/invoices" className="text-sm text-[var(--erp-accent)]">
              Billing
            </Link>
          </div>
          <Table headers={["Invoice", "Project", "Total", "Status"]}>
            {(data?.recent_invoices || []).map((inv) => (
              <tr key={inv.id}>
                <td className="px-3 py-2 font-medium">{inv.invoice_no}</td>
                <td className="px-3 py-2">{inv.project?.title || inv.project_id}</td>
                <td className="px-3 py-2 tabular-nums">{money(inv.total_amount)}</td>
                <td className="px-3 py-2">
                  <Badge tone={inv.status === "paid" ? "green" : "amber"}>{inv.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  );
}
