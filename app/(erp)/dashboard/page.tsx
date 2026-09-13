"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, money } from "@/lib/api";
import type { Dashboard } from "@/lib/types";
import { Badge, Card, Kpi, PageHeader, Table } from "@/components/ui";

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Dashboard>("/api/dashboard")
      .then((res) => setData(res.data))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <PageHeader
        title="BOLDFRAME Command Center"
        subtitle="L1 overview — projects, talent, quality, and billing"
      />
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Active Projects" value={String(data?.projects_active ?? "—")} hint={`${data?.projects_total ?? 0} total`} />
        <Kpi label="In QA / Review" value={String(data?.projects_in_qa ?? "—")} tone="warn" />
        <Kpi label="Available Creatives" value={String(data?.creators_available ?? "—")} hint={`${data?.creators ?? 0} total`} tone="ok" />
        <Kpi label="Revenue Collected" value={money(data?.revenue_collected)} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Businesses" value={String(data?.businesses ?? "—")} />
        <Kpi label="Open Invoices" value={String(data?.invoices_open ?? "—")} tone="warn" />
        <Kpi label="Payouts Pending" value={money(data?.payouts_pending)} />
        <Kpi label="Unread Alerts" value={String(data?.unread_notifications ?? "—")} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Recent Projects</h2>
            <Link href="/projects" className="text-sm text-[var(--erp-accent)]">View all</Link>
          </div>
          <Table headers={["Code", "Title", "Client", "Status", "Progress"]}>
            {(data?.recent_projects || []).map((p) => (
              <tr key={p.id}>
                <td className="px-3 py-2 font-medium">
                  <Link href={`/projects/${p.id}`} className="text-[var(--erp-accent)]">{p.code}</Link>
                </td>
                <td className="px-3 py-2">{p.title}</td>
                <td className="px-3 py-2">{p.business?.name || p.business_id}</td>
                <td className="px-3 py-2"><Badge>{p.status}</Badge></td>
                <td className="px-3 py-2">{p.progress_pct}%</td>
              </tr>
            ))}
          </Table>
        </Card>
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Recent Invoices</h2>
            <Link href="/billing/invoices" className="text-sm text-[var(--erp-accent)]">Billing</Link>
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
