"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Business } from "@/lib/types";
import { Badge, Button, Card, Input, Label, PageHeader, Table } from "@/components/ui";

export default function BusinessesPage() {
  const [rows, setRows] = useState<Business[]>([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    code: "",
    name: "",
    industry: "",
    contact_name: "",
    email: "",
    subscription: "starter",
    team_size: "1",
  });

  async function load() {
    const res = await api<Business[]>("/api/businesses");
    setRows(res.data);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await api("/api/businesses", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          team_size: Number(form.team_size),
        }),
      });
      setShow(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div>
      <PageHeader
        title="Businesses / Clients"
        subtitle="D3 — companies that brief projects and pay invoices"
        actions={<Button onClick={() => setShow((s) => !s)}>{show ? "Close" : "Add Business"}</Button>}
      />
      {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}
      {show ? (
        <Card className="mb-4 p-4">
          <form className="grid gap-3 md:grid-cols-3" onSubmit={onSubmit}>
            {[
              ["code", "Code"],
              ["name", "Name"],
              ["industry", "Industry"],
              ["contact_name", "Contact"],
              ["email", "Email"],
              ["subscription", "Subscription"],
              ["team_size", "Team Size"],
            ].map(([key, label]) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  required={key === "code" || key === "name"}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
            <div className="flex items-end"><Button type="submit">Save</Button></div>
          </form>
        </Card>
      ) : null}
      <Card className="p-2">
        <Table headers={["Code", "Name", "Industry", "Contact", "Plan", "Team"]}>
          {rows.map((b) => (
            <tr key={b.id}>
              <td className="px-3 py-2 font-medium">{b.code}</td>
              <td className="px-3 py-2">{b.name}</td>
              <td className="px-3 py-2">{b.industry || "—"}</td>
              <td className="px-3 py-2">{b.contact_name || "—"}</td>
              <td className="px-3 py-2"><Badge>{b.subscription}</Badge></td>
              <td className="px-3 py-2">{b.team_size}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
