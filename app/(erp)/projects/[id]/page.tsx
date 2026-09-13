"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, money } from "@/lib/api";
import type { Message, Project, ProjectFile as PFile } from "@/lib/types";
import { Badge, Button, Card, Input, Label, PageHeader, Select, Table } from "@/components/ui";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<PFile[]>([]);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, m, f] = await Promise.all([
      api<Project>(`/api/projects/${id}`),
      api<Message[]>(`/api/projects/${id}/messages`),
      api<PFile[]>(`/api/projects/${id}/files`),
    ]);
    setProject(p.data);
    setStatus(p.data.status);
    setMessages(m.data);
    setFiles(f.data);
  }

  useEffect(() => {
    if (id) load().catch((e) => setError(e.message));
  }, [id]);

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    await api("/api/messages", {
      method: "POST",
      body: JSON.stringify({ project_id: id, body: msg }),
    });
    setMsg("");
    await load();
  }

  async function updateStatus() {
    await api(`/api/projects/${id}/status?status=${encodeURIComponent(status)}`, { method: "PATCH" });
    await load();
  }

  if (!project) return <p className="text-sm text-slate-500">{error || "Loading..."}</p>;

  return (
    <div>
      <PageHeader
        title={project.title}
        subtitle={`${project.code} · ${project.business?.name || "Client"} · ${project.category || "general"}`}
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full sm:w-40">
              {["intake", "quoting", "matching", "assigned", "in_progress", "qa", "client_review", "delivered", "archived"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
            <Button variant="secondary" className="w-full sm:w-auto" onClick={updateStatus}>Update Status</Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2 space-y-4">
          <div>
            <h3 className="font-semibold">Brief</h3>
            <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">{project.brief || "—"}</p>
          </div>
          <div>
            <h3 className="font-semibold">Requirements</h3>
            <p className="mt-1 text-sm text-slate-600">{project.requirements || "—"}</p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Milestones</h3>
            <Table headers={["Title", "Due", "Amount", "Status"]}>
              {(project.milestones || []).map((m) => (
                <tr key={m.id}>
                  <td className="px-3 py-2">{m.title}</td>
                  <td className="px-3 py-2">{m.due_date || "—"}</td>
                  <td className="px-3 py-2 tabular-nums">{money(m.amount)}</td>
                  <td className="px-3 py-2"><Badge>{m.status}</Badge></td>
                </tr>
              ))}
            </Table>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Tasks</h3>
            <Table headers={["Task", "Status", "Hours"]}>
              {(project.tasks || []).map((t) => (
                <tr key={t.id}>
                  <td className="px-3 py-2">{t.title}</td>
                  <td className="px-3 py-2"><Badge>{t.status}</Badge></td>
                  <td className="px-3 py-2">{t.logged_hours}/{t.estimated_hours}</td>
                </tr>
              ))}
            </Table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Status</span><Badge>{project.status}</Badge></div>
            <div className="flex justify-between"><span className="text-slate-500">Progress</span><span>{project.progress_pct}%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Budget</span><span>{money(project.budget)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Quoted</span><span>{money(project.quoted_amount)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Creative</span><span>{project.creator?.display_name || "Unassigned"}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Due</span><span>{project.due_date || "—"}</span></div>
          </Card>

          <Card className="p-4">
            <h3 className="mb-2 font-semibold">Files (D5)</h3>
            <ul className="space-y-2 text-sm">
              {files.map((f) => (
                <li key={f.id} className="rounded border border-[var(--erp-border)] px-3 py-2">
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs text-slate-500">{f.file_type} · v{f.version}</div>
                </li>
              ))}
              {!files.length ? <li className="text-slate-500">No files yet</li> : null}
            </ul>
          </Card>

          <Card className="p-4">
            <h3 className="mb-2 font-semibold">Collaboration (4.0)</h3>
            <div className="mb-3 max-h-56 space-y-2 overflow-y-auto">
              {messages.map((m) => (
                <div key={m.id} className="rounded bg-slate-50 px-3 py-2 text-sm">
                  <div className="text-xs text-slate-500">{m.sender?.full_name || m.sender_user_id}</div>
                  <div>{m.body}</div>
                </div>
              ))}
            </div>
            <form className="flex flex-col gap-2 sm:flex-row" onSubmit={sendMessage}>
              <Input className="min-w-0 flex-1" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Write a message..." required />
              <Button type="submit" className="w-full sm:w-auto">Send</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
