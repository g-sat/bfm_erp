"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Assignment } from "@/lib/types";
import { Badge, Card, PageHeader, Table } from "@/components/ui";

export default function AssignmentsPage() {
  const [rows, setRows] = useState<Assignment[]>([]);
  useEffect(() => {
    api<Assignment[]>("/api/assignments").then((r) => setRows(r.data));
  }, []);

  return (
    <div>
      <PageHeader title="Assignments" subtitle="Offers and acceptances across projects" />
      <Card className="p-2">
        <Table headers={["ID", "Project", "Creative", "Status", "Score"]}>
          {rows.map((a) => (
            <tr key={a.id}>
              <td className="px-3 py-2">{a.id}</td>
              <td className="px-3 py-2">
                <Link className="text-[var(--erp-accent)]" href={`/projects/${a.project_id}`}>
                  {a.project?.code || a.project_id}
                </Link>
              </td>
              <td className="px-3 py-2">{a.creator?.display_name || a.creator_id}</td>
              <td className="px-3 py-2"><Badge>{a.status}</Badge></td>
              <td className="px-3 py-2">{a.match_score}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
