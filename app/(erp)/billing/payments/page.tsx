"use client";

import { useEffect, useState } from "react";
import { api, money } from "@/lib/api";
import type { Payment } from "@/lib/types";
import { Badge, Button, Card, PageHeader, Table } from "@/components/ui";

export default function PaymentsPage() {
  const [rows, setRows] = useState<Payment[]>([]);

  async function load() {
    const r = await api<Payment[]>("/api/payments");
    setRows(r.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function release(id: number) {
    await api(`/api/payments/${id}/release`, { method: "POST" });
    await load();
  }

  return (
    <div>
      <PageHeader
        title="Payments & Payouts"
        subtitle="7.0 — inbound payments, escrow, creator payouts, refunds"
      />
      <Card className="p-2">
        <Table headers={["Payment", "Direction", "Amount", "Gateway", "Status", "Action"]}>
          {rows.map((p) => (
            <tr key={p.id}>
              <td className="px-3 py-2 font-medium">{p.payment_no}</td>
              <td className="px-3 py-2"><Badge>{p.direction}</Badge></td>
              <td className="px-3 py-2 tabular-nums">{money(p.amount)}</td>
              <td className="px-3 py-2">{p.gateway}</td>
              <td className="px-3 py-2">
                <Badge tone={p.status === "completed" ? "green" : p.status === "escrow" ? "amber" : "slate"}>
                  {p.status}
                </Badge>
              </td>
              <td className="px-3 py-2">
                {p.direction === "payout" && p.status === "escrow" ? (
                  <Button onClick={() => release(p.id)}>Release Payout</Button>
                ) : "—"}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
