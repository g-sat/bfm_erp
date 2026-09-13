"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, money } from "@/lib/api";
import type { Project } from "@/lib/types";
import { Badge, Button, Card, Input, PageHeader, Table } from "@/components/ui";

export default function ProjectsPage() {
  const [rows, setRows] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function load(q = search) {
    const res = await api<Project[]>(`/api/projects${q ? `?search=${encodeURIComponent(q)}` : ""}`);
    setRows(res.data);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="2.0 Intake → 5.0 delivery lifecycle"
        actions={
          <>
            <Input className="w-full min-w-0 sm:w-48" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button variant="secondary" className="w-full sm:w-auto" onClick={() => load()}>Search</Button>
            <Link href="/projects/new" className="w-full sm:w-auto"><Button className="w-full">New Intake</Button></Link>
          </>
        }
      />
      {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}
      <Card className="p-2">
        <Table headers={["Code", "Title", "Client", "Category", "Budget", "Status", "Progress"]}>
          {rows.map((p) => (
            <tr key={p.id}>
              <td className="px-3 py-2 font-medium">
                <Link className="text-[var(--erp-accent)]" href={`/projects/${p.id}`}>{p.code}</Link>
              </td>
              <td className="px-3 py-2">{p.title}</td>
              <td className="px-3 py-2">{p.business?.name || p.business_id}</td>
              <td className="px-3 py-2">{p.category || "—"}</td>
              <td className="px-3 py-2 tabular-nums">{money(p.budget)}</td>
              <td className="px-3 py-2"><Badge>{p.status}</Badge></td>
              <td className="px-3 py-2">{p.progress_pct}%</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
