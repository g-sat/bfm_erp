"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Business } from "@/lib/types";
import { Button, Card, Input, Label, PageHeader, Select } from "@/components/ui";

export default function NewProjectPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    brief: "",
    category: "design",
    priority: "medium",
    budget: "100000",
    currency: "INR",
    business_id: "",
    due_date: "",
    requirements: "",
  });

  useEffect(() => {
    api<Business[]>("/api/businesses").then((r) => setBusinesses(r.data));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await api<{ id: number }>("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          brief: form.brief,
          category: form.category,
          priority: form.priority,
          budget: Number(form.budget),
          currency: form.currency,
          business_id: Number(form.business_id),
          due_date: form.due_date || null,
          requirements: form.requirements,
        }),
      });
      router.push(`/projects/${res.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div>
      <PageHeader title="Project Intake" subtitle="2.0 — capture brief, budget, timeline" />
      {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}
      <Card className="max-w-3xl p-5">
        <form className="grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="md:col-span-2">
            <Label>Project Title</Label>
            <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label>Business / Client</Label>
            <Select required value={form.business_id} onChange={(e) => setForm({ ...form, business_id: e.target.value })}>
              <option value="">Select</option>
              {businesses.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="design">Design</option>
              <option value="video">Video</option>
              <option value="motion">Motion</option>
              <option value="writing">Writing</option>
              <option value="development">Development</option>
              <option value="photography">Photography</option>
            </Select>
          </div>
          <div>
            <Label>Budget</Label>
            <Input type="number" required value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          </div>
          <div>
            <Label>Due Date</Label>
            <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Brief</Label>
            <textarea
              className="w-full rounded-md border border-[var(--erp-border)] px-3 py-2 text-sm"
              rows={4}
              value={form.brief}
              onChange={(e) => setForm({ ...form, brief: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Requirements</Label>
            <Input value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
          </div>
          <div><Button type="submit">Create Project</Button></div>
        </form>
      </Card>
    </div>
  );
}
