"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, money } from "@/lib/api";
import type { Project } from "@/lib/types";
import { Badge, Card, PageHeader, Table } from "@/components/ui";

export default function DeliveryPage() {
  const [rows, setRows] = useState<Project[]>([]);
  useEffect(() => {
    api<Project[]>("/api/projects").then((r) =>
      setRows(r.data.filter((p) => ["assigned", "in_progress", "qa", "client_review"].includes(p.status))),
    );
  }, []);

  return (
    <div>
      <PageHeader title="Active Delivery" subtitle="5.0 — plans, milestones, tasks, progress" />
      <Card className="p-2">
        <Table headers={["Project", "Client", "Creative", "Progress", "Status", "Due"]}>
          {rows.map((p) => (
            <tr key={p.id}>
              <td className="px-3 py-2">
                <Link className="font-medium text-[var(--erp-accent)]" href={`/projects/${p.id}`}>
                  {p.code} — {p.title}
                </Link>
              </td>
              <td className="px-3 py-2">{p.business?.name}</td>
              <td className="px-3 py-2">{p.creator?.display_name || "—"}</td>
              <td className="px-3 py-2">
                <div className="h-2 w-28 overflow-hidden rounded bg-[var(--erp-surface-2)]">
                  <div className="h-full bg-[var(--erp-accent)]" style={{ width: `${p.progress_pct}%` }} />
                </div>
                <span className="text-xs">{p.progress_pct}%</span>
              </td>
              <td className="px-3 py-2"><Badge>{p.status}</Badge></td>
              <td className="px-3 py-2">{p.due_date || "—"}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
