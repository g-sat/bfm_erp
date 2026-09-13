"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, money } from "@/lib/api";
import type { Creator } from "@/lib/types";
import { Badge, Button, Card, Input, Label, PageHeader, Table } from "@/components/ui";

export default function CreativesPage() {
  const [rows, setRows] = useState<Creator[]>([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    code: "",
    display_name: "",
    headline: "",
    skills: "",
    categories: "design",
    hourly_rate: "2000",
    availability: "available",
    location: "",
  });

  async function load() {
    const res = await api<Creator[]>("/api/creators");
    setRows(res.data);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await api("/api/creators", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          hourly_rate: Number(form.hourly_rate),
          day_rate: Number(form.hourly_rate) * 7,
          experience_years: 1,
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
        title="Creative Professionals"
        subtitle="D2 — skills, portfolio, pricing, availability"
        actions={<Button onClick={() => setShow((s) => !s)}>{show ? "Close" : "Add Creative"}</Button>}
      />
      {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}
      {show ? (
        <Card className="mb-4 p-4">
          <form className="grid gap-3 md:grid-cols-3" onSubmit={onSubmit}>
            {Object.entries({
              code: "Code",
              display_name: "Display Name",
              headline: "Headline",
              skills: "Skills (comma)",
              categories: "Categories",
              hourly_rate: "Hourly Rate",
              availability: "Availability",
              location: "Location",
            }).map(([key, label]) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  required={["code", "display_name"].includes(key)}
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
        <Table headers={["Code", "Name", "Skills", "Rate", "Availability", "Rating"]}>
          {rows.map((c) => (
            <tr key={c.id}>
              <td className="px-3 py-2 font-medium">{c.code}</td>
              <td className="px-3 py-2">
                <div className="font-medium">{c.display_name}</div>
                <div className="text-xs text-[var(--erp-muted)]">{c.headline}</div>
              </td>
              <td className="px-3 py-2 max-w-xs truncate">{c.skills}</td>
              <td className="px-3 py-2 tabular-nums">{money(c.hourly_rate)}/hr</td>
              <td className="px-3 py-2">
                <Badge tone={c.availability === "available" ? "green" : "amber"}>{c.availability}</Badge>
              </td>
              <td className="px-3 py-2">{Number(c.rating_avg).toFixed(1)} ({c.rating_count})</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
