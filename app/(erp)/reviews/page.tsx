"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Creator, Project, Review } from "@/lib/types";
import { Button, Card, Input, Label, PageHeader, Select, Table } from "@/components/ui";

export default function ReviewsPage() {
  const [rows, setRows] = useState<Review[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [form, setForm] = useState({
    project_id: "",
    to_role: "creative",
    to_creator_id: "",
    rating: "5",
    comment: "",
  });

  async function load() {
    const [r, p, c] = await Promise.all([
      api<Review[]>("/api/reviews"),
      api<Project[]>("/api/projects"),
      api<Creator[]>("/api/creators"),
    ]);
    setRows(r.data);
    setProjects(p.data);
    setCreators(c.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await api("/api/reviews", {
      method: "POST",
      body: JSON.stringify({
        project_id: Number(form.project_id),
        to_role: form.to_role,
        to_creator_id: form.to_creator_id ? Number(form.to_creator_id) : null,
        rating: Number(form.rating),
        comment: form.comment,
      }),
    });
    await load();
  }

  return (
    <div>
      <PageHeader title="Reviews & Ratings" subtitle="D7 — feedback on creatives, clients, PMs" />
      <Card className="mb-4 p-4">
        <form className="grid gap-3 md:grid-cols-3" onSubmit={onSubmit}>
          <div>
            <Label>Project</Label>
            <Select required value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })}>
              <option value="">Select</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.code}</option>)}
            </Select>
          </div>
          <div>
            <Label>Creative</Label>
            <Select value={form.to_creator_id} onChange={(e) => setForm({ ...form, to_creator_id: e.target.value })}>
              <option value="">Select</option>
              {creators.map((c) => <option key={c.id} value={c.id}>{c.display_name}</option>)}
            </Select>
          </div>
          <div>
            <Label>Rating</Label>
            <Select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Comment</Label>
            <Input value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
          </div>
          <div className="flex items-end"><Button type="submit">Submit Review</Button></div>
        </form>
      </Card>
      <Card className="p-2">
        <Table headers={["Project", "Role", "Rating", "Comment"]}>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="px-3 py-2">{r.project_id}</td>
              <td className="px-3 py-2">{r.to_role}</td>
              <td className="px-3 py-2">{"★".repeat(r.rating)}</td>
              <td className="px-3 py-2">{r.comment || "—"}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
