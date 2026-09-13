"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Notification } from "@/lib/types";
import { Badge, Button, Card, PageHeader, Table } from "@/components/ui";

export default function NotificationsPage() {
  const [rows, setRows] = useState<Notification[]>([]);

  async function load() {
    const r = await api<Notification[]>("/api/notifications");
    setRows(r.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id: number) {
    await api(`/api/notifications/${id}/read`, { method: "POST" });
    await load();
  }

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Email / SMS / Push / In-app alerts" />
      <Card className="p-2">
        <Table headers={["Title", "Body", "Channel", "Status", "Action"]}>
          {rows.map((n) => (
            <tr key={n.id} className={n.is_read ? "opacity-60" : ""}>
              <td className="px-3 py-2 font-medium">{n.title}</td>
              <td className="px-3 py-2">{n.body}</td>
              <td className="px-3 py-2"><Badge>{n.channel}</Badge></td>
              <td className="px-3 py-2">{n.is_read ? "Read" : "Unread"}</td>
              <td className="px-3 py-2">
                {!n.is_read ? <Button variant="secondary" onClick={() => markRead(n.id)}>Mark read</Button> : "—"}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
