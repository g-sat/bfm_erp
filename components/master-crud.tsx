"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button, Card, Input, Label, PageHeader, Table } from "@/components/ui";

type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "select";
  options?: { value: string | number; label: string }[];
  required?: boolean;
};

export function MasterCrudPage({
  title,
  subtitle,
  endpoint,
  fields,
  columns,
  getRow,
}: {
  title: string;
  subtitle: string;
  endpoint: string;
  fields: Field[];
  columns: { key: string; label: string; render?: (row: any) => React.ReactNode }[];
  getRow?: (row: any) => Record<string, any>;
}) {
  const [rows, setRows] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<Record<string, any>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function load(q = search) {
    const res = await api<any[]>(`${endpoint}${q ? `?search=${encodeURIComponent(q)}` : ""}`);
    setRows(res.data || []);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  function updateField(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, any> = {};
      for (const f of fields) {
        let v = form[f.key];
        if (f.type === "number") v = Number(v || 0);
        if (f.type === "select" && v !== "" && v != null) v = Number.isNaN(Number(v)) ? v : Number(v);
        payload[f.key] = v;
      }
      await api(endpoint, { method: "POST", body: JSON.stringify(payload) });
      setForm({});
      setShowForm(false);
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
        title={title}
        subtitle={subtitle}
        actions={
          <>
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
            <Button variant="secondary" onClick={() => load()}>
              Search
            </Button>
            <Button onClick={() => setShowForm((s) => !s)}>
              {showForm ? "Close" : "Add New"}
            </Button>
          </>
        }
      />
      {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}
      {showForm ? (
        <Card className="mb-4 p-4">
          <form className="grid gap-3 md:grid-cols-3" onSubmit={onSubmit}>
            {fields.map((f) => (
              <div key={f.key}>
                <Label>{f.label}</Label>
                {f.type === "select" ? (
                  <select
                    className="w-full rounded-md border border-[var(--erp-border)] px-3 py-2 text-sm"
                    value={form[f.key] ?? ""}
                    required={f.required}
                    onChange={(e) => updateField(f.key, e.target.value)}
                  >
                    <option value="">Select</option>
                    {(f.options || []).map((o) => (
                      <option key={String(o.value)} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type={f.type || "text"}
                    required={f.required}
                    value={form[f.key] ?? ""}
                    onChange={(e) => updateField(f.key, e.target.value)}
                  />
                )}
              </div>
            ))}
            <div className="flex items-end">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}
      <Card className="p-2">
        <Table headers={columns.map((c) => c.label)}>
          {rows.map((row) => {
            const r = getRow ? getRow(row) : row;
            return (
              <tr key={row.id}>
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-2">
                    {c.render ? c.render(r) : String(r[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}
