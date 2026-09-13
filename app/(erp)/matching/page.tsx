"use client";

import { useEffect, useState } from "react";
import { api, money } from "@/lib/api";
import type { Assignment, Creator, Project } from "@/lib/types";
import { Badge, Button, Card, PageHeader, Select, Table } from "@/components/ui";

export default function MatchingPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [projectId, setProjectId] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, c, a] = await Promise.all([
      api<Project[]>("/api/projects"),
      api<Creator[]>("/api/creators?availability=available"),
      api<Assignment[]>("/api/assignments"),
    ]);
    setProjects(p.data.filter((x) => ["intake", "quoting", "matching", "assigned"].includes(x.status)));
    setCreators(c.data);
    setAssignments(a.data);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function shortlist() {
    await api("/api/assignments", {
      method: "POST",
      body: JSON.stringify({
        project_id: Number(projectId),
        creator_id: Number(creatorId),
        match_score: 80,
      }),
    });
    await load();
  }

  async function offer(id: number) {
    await api(`/api/assignments/${id}/offer`, { method: "POST" });
    await load();
  }

  async function respond(id: number, accept: boolean) {
    await api(`/api/assignments/${id}/respond?accept=${accept}`, { method: "POST" });
    await load();
  }

  return (
    <div>
      <PageHeader
        title="Talent Matching & Assignment"
        subtitle="3.0 — analyze requirements, shortlist, verify, assign"
      />
      {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}
      <Card className="mb-4 grid gap-3 p-4 md:grid-cols-3">
        <Select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
          <option value="">Select project</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.title}</option>)}
        </Select>
        <Select value={creatorId} onChange={(e) => setCreatorId(e.target.value)}>
          <option value="">Select creative</option>
          {creators.map((c) => <option key={c.id} value={c.id}>{c.display_name} ({c.categories})</option>)}
        </Select>
        <Button disabled={!projectId || !creatorId} onClick={shortlist}>Shortlist Creative</Button>
      </Card>

      <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {creators.slice(0, 4).map((c) => (
          <Card key={c.id} className="p-4">
            <div className="font-semibold">{c.display_name}</div>
            <div className="text-xs text-[var(--erp-muted)]">{c.headline}</div>
            <div className="mt-2 text-sm">{c.skills}</div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <Badge tone="green">{c.availability}</Badge>
              <span>{money(c.hourly_rate)}/hr</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-2">
        <Table headers={["Project", "Creative", "Score", "Offer", "Status", "Actions"]}>
          {assignments.map((a) => (
            <tr key={a.id}>
              <td className="px-3 py-2">{a.project?.code || a.project_id}</td>
              <td className="px-3 py-2">{a.creator?.display_name || a.creator_id}</td>
              <td className="px-3 py-2">{a.match_score}</td>
              <td className="px-3 py-2">{a.offer_amount ? money(a.offer_amount) : "—"}</td>
              <td className="px-3 py-2"><Badge>{a.status}</Badge></td>
              <td className="px-3 py-2 space-x-2">
                {a.status === "shortlisted" ? (
                  <Button variant="secondary" onClick={() => offer(a.id)}>Send Offer</Button>
                ) : null}
                {a.status === "offered" ? (
                  <>
                    <Button onClick={() => respond(a.id, true)}>Accept</Button>
                    <Button variant="danger" onClick={() => respond(a.id, false)}>Decline</Button>
                  </>
                ) : null}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
