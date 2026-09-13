"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Message, Project } from "@/lib/types";
import { Button, Card, Input, PageHeader, Select } from "@/components/ui";

export default function CollaborationPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");

  useEffect(() => {
    api<Project[]>("/api/projects").then((r) => {
      setProjects(r.data);
      if (r.data[0]) setProjectId(String(r.data[0].id));
    });
  }, []);

  useEffect(() => {
    if (!projectId) return;
    api<Message[]>(`/api/projects/${projectId}/messages`).then((r) => setMessages(r.data));
  }, [projectId]);

  async function send(e: FormEvent) {
    e.preventDefault();
    await api("/api/messages", {
      method: "POST",
      body: JSON.stringify({ project_id: Number(projectId), body }),
    });
    setBody("");
    const r = await api<Message[]>(`/api/projects/${projectId}/messages`);
    setMessages(r.data);
  }

  return (
    <div>
      <PageHeader title="Communication & Collaboration" subtitle="4.0 — messaging, files, alerts" />
      <Card className="mb-4 p-4">
        <Select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="max-w-md">
          {projects.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.title}</option>)}
        </Select>
      </Card>
      <Card className="p-4">
        <div className="mb-4 max-h-96 space-y-3 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className="rounded-lg border border-[var(--erp-border)] px-3 py-2">
              <div className="text-xs text-[var(--erp-muted)]">{m.sender?.full_name || "User"} · {m.message_type}</div>
              <div className="text-sm">{m.body}</div>
            </div>
          ))}
        </div>
        <form className="flex gap-2" onSubmit={send}>
          <Input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Discussion update..." required />
          <Button type="submit">Send</Button>
        </form>
      </Card>
    </div>
  );
}
