"use client";

import { useEffect, useState } from "react";
import { api, money } from "@/lib/api";
import type { Invoice } from "@/lib/types";
import { Badge, Button, Card, PageHeader, Table } from "@/components/ui";

export default function InvoicesPage() {
  const [rows, setRows] = useState<Invoice[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const r = await api<Invoice[]>("/api/invoices");
    setRows(r.data);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function pay(id: number, gateway: string) {
    await api(`/api/invoices/${id}/pay?gateway=${gateway}`, { method: "POST" });
    await load();
  }

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle="7.0 — generate invoices and collect via Stripe / Razorpay"
      />
      {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}
      <Card className="p-2">
        <Table headers={["Invoice", "Project", "Client", "Total", "Status", "Pay"]}>
          {rows.map((inv) => (
            <tr key={inv.id}>
              <td className="px-3 py-2 font-medium">{inv.invoice_no}</td>
              <td className="px-3 py-2">{inv.project?.title || inv.project_id}</td>
              <td className="px-3 py-2">{inv.business?.name || inv.business_id}</td>
              <td className="px-3 py-2 tabular-nums">{money(inv.total_amount)}</td>
              <td className="px-3 py-2">
                <Badge tone={inv.status === "paid" ? "green" : "amber"}>{inv.status}</Badge>
              </td>
              <td className="px-3 py-2">
                {inv.status !== "paid" ? (
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => pay(inv.id, "stripe")}>Stripe</Button>
                    <Button variant="secondary" onClick={() => pay(inv.id, "razorpay")}>Razorpay</Button>
                  </div>
                ) : "—"}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
