"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Company } from "@/lib/types";
import { Card, PageHeader } from "@/components/ui";

export default function CompanyPage() {
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    api<Company>("/api/company").then((r) => setCompany(r.data));
  }, []);

  return (
    <div>
      <PageHeader title="Platform Profile" subtitle="Single-tenant BOLDFRAME company settings" />
      <Card className="max-w-2xl p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          {[
            ["Code", company?.code],
            ["Name", company?.name],
            ["Tagline", company?.tagline],
            ["Email", company?.email],
            ["Phone", company?.phone],
          ].map(([label, value]) => (
            <div key={String(label)} className={label === "Tagline" ? "sm:col-span-2" : ""}>
              <dt className="text-xs uppercase tracking-wide text-[var(--erp-muted)]">{label}</dt>
              <dd className="mt-1 text-sm font-medium text-[var(--erp-ink)]">{value || "—"}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
