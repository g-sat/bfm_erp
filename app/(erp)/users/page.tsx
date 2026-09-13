"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Business, Creator, User } from "@/lib/types";
import { ROLE_LABELS } from "@/lib/nav";
import { Badge, Button, Card, Input, Label, PageHeader, Select, Table } from "@/components/ui";

const EMPTY = {
  username: "",
  full_name: "",
  email: "",
  password: "",
  role: "business",
  phone: "",
  is_verified: true,
  business_id: "",
  creator_id: "",
};

export default function UsersPage() {
  const [rows, setRows] = useState<User[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  async function load() {
    const [users, biz, cr] = await Promise.all([
      api<User[]>("/api/users"),
      api<Business[]>("/api/businesses"),
      api<Creator[]>("/api/creators"),
    ]);
    setRows(users.data);
    setBusinesses(biz.data);
    setCreators(cr.data);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message + " — sign in as admin to manage users"));
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY });
    setShow(true);
  }

  function openEdit(u: User) {
    setEditingId(u.id);
    setForm({
      username: u.username,
      full_name: u.full_name,
      email: u.email,
      password: "",
      role: u.role,
      phone: u.phone || "",
      is_verified: u.is_verified,
      business_id: u.business_id ? String(u.business_id) : "",
      creator_id: u.creator_id ? String(u.creator_id) : "",
    });
    setShow(true);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await api(`/api/users/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({
            full_name: form.full_name,
            email: form.email,
            role: form.role,
            phone: form.phone || null,
            is_verified: form.is_verified,
            business_id: form.business_id ? Number(form.business_id) : null,
            creator_id: form.creator_id ? Number(form.creator_id) : null,
            password: form.password || null,
            is_active: true,
          }),
        });
      } else {
        await api("/api/users", {
          method: "POST",
          body: JSON.stringify({
            username: form.username,
            full_name: form.full_name,
            email: form.email,
            password: form.password,
            role: form.role,
            phone: form.phone || null,
            is_verified: form.is_verified,
            business_id: form.business_id ? Number(form.business_id) : null,
            creator_id: form.creator_id ? Number(form.creator_id) : null,
          }),
        });
      }
      setShow(false);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Users & Roles"
        subtitle="Create logins and assign platform roles (Admin, Business, Creative, PM)"
        actions={<Button onClick={openCreate}>Add User</Button>}
      />
      {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}

      {show ? (
        <Card className="mb-4 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">{editingId ? "Edit user" : "Add user"}</h2>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Close
            </Button>
          </div>
          <form className="grid gap-3 md:grid-cols-3" onSubmit={onSubmit}>
            {!editingId ? (
              <div>
                <Label>Username</Label>
                <Input
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
            ) : (
              <div>
                <Label>Username</Label>
                <Input value={form.username} disabled />
              </div>
            )}
            <div>
              <Label>Full name</Label>
              <Input
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label>{editingId ? "New password (optional)" : "Password"}</Label>
              <Input
                type="password"
                required={!editingId}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="pm">Project Manager</option>
                <option value="business">Business / Client</option>
                <option value="creative">Creative Professional</option>
              </Select>
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            {form.role === "business" ? (
              <div>
                <Label>Link to business</Label>
                <Select
                  value={form.business_id}
                  onChange={(e) => setForm({ ...form, business_id: e.target.value })}
                >
                  <option value="">None</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}
            {form.role === "creative" ? (
              <div>
                <Label>Link to creative profile</Label>
                <Select
                  value={form.creator_id}
                  onChange={(e) => setForm({ ...form, creator_id: e.target.value })}
                >
                  <option value="">None</option>
                  {creators.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.display_name}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_verified}
                  onChange={(e) => setForm({ ...form, is_verified: e.target.checked })}
                />
                Verified
              </label>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update user" : "Create user"}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <Card className="p-2">
        <Table headers={["Username", "Name", "Email", "Role", "Verified", "Action"]}>
          {rows.map((u) => (
            <tr key={u.id}>
              <td className="px-3 py-2 font-medium">{u.username}</td>
              <td className="px-3 py-2">{u.full_name}</td>
              <td className="px-3 py-2">{u.email}</td>
              <td className="px-3 py-2">
                <Badge>{ROLE_LABELS[u.role] || u.role}</Badge>
              </td>
              <td className="px-3 py-2">{u.is_verified ? "Yes" : "No"}</td>
              <td className="px-3 py-2">
                <Button variant="secondary" onClick={() => openEdit(u)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Card className="p-4 text-sm text-[var(--erp-muted)]">
          <div className="mb-1 font-semibold text-[var(--erp-ink)]">Where roles live</div>
          Roles are chosen on each user (not a separate Roles table):{" "}
          <b>Admin</b>, <b>Project Manager</b>, <b>Business / Client</b>,{" "}
          <b>Creative Professional</b>.
        </Card>
        <Card className="p-4 text-sm text-[var(--erp-muted)]">
          <div className="mb-1 font-semibold text-[var(--erp-ink)]">Related masters</div>
          Client companies → <b>Users & Roles → Businesses</b> (Add Business).
          <br />
          Talent profiles → <b>Users & Roles → Creatives</b> (Add Creative).
          Then link them when creating a user with that role.
        </Card>
      </div>
    </div>
  );
}
