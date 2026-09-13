"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Project, QualityReview } from "@/lib/types";
import { Badge, Button, Card, Input, Label, PageHeader, Select, Table } from "@/components/ui";

export default function QualityPage() {
  const [rows, setRows] = useState<QualityReview[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({
    project_id: "",
    stage: "qa",
    status: "approved",
    feedback: "",
  });
  const [error, setError] = useState("");

  async function load() {
    const [q, p] = await Promise.all([
      api<QualityReview[]>("/api/quality-reviews"),
      api<Project[]>("/api/projects"),
    ]);
    setRows(q.data);
    setProjects(p.data);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await api("/api/quality-reviews", {
      method: "POST",
      body: JSON.stringify({
        project_id: Number(form.project_id),
        stage: form.stage,
        status: form.status,
        feedback: form.feedback,
      }),
    });
    await load();
  }

  return (
    <div>
      <PageHeader
        title="Quality Review & Delivery"
        subtitle="6.0 — QA, revisions, client approval, archive"
      />
      {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}
      <Card className="mb-4 p-4">
        <form className="grid gap-3 md:grid-cols-4" onSubmit={onSubmit}>
          <div>
            <Label>Project</Label>
            <Select required value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })}>
              <option value="">Select</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.code}</option>)}
            </Select>
          </div>
          <div>
            <Label>Stage</Label>
            <Select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
              <option value="qa">Internal QA</option>
              <option value="client">Client Review</option>
            </Select>
          </div>
          <div>
            <Label>Decision</Label>
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="approved">Approve</option>
              <option value="revision_requested">Request Revision</option>
              <option value="pending">Pending</option>
            </Select>
          </div>
          <div>
            <Label>Feedback</Label>
            <Input value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} />
          </div>
          <div className="flex items-end"><Button type="submit">Submit Review</Button></div>
        </form>
      </Card>
      <Card className="p-2">
        <Table headers={["ID", "Project", "Stage", "Status", "Feedback"]}>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="px-3 py-2">{r.id}</td>
              <td className="px-3 py-2">{r.project_id}</td>
              <td className="px-3 py-2"><Badge>{r.stage}</Badge></td>
              <td className="px-3 py-2">
                <Badge tone={r.status === "approved" ? "green" : r.status === "revision_requested" ? "red" : "amber"}>
                  {r.status}
                </Badge>
              </td>
              <td className="px-3 py-2">{r.feedback || "—"}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
