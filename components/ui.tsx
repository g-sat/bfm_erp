"use client";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--erp-ink)]">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-[var(--erp-muted)]">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-[var(--erp-border)] bg-[var(--erp-surface)] shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Kpi({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "warn" | "ok";
}) {
  const toneClass =
    tone === "warn"
      ? "border-[var(--erp-warn-border)] bg-[var(--erp-warn-bg)]"
      : tone === "ok"
        ? "border-[var(--erp-ok-border)] bg-[var(--erp-ok-bg)]"
        : "border-[var(--erp-border)] bg-[var(--erp-surface)]";
  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <div className="text-xs font-medium uppercase tracking-wide text-[var(--erp-muted)]">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums text-[var(--erp-ink)]">{value}</div>
      {hint ? <div className="mt-1 text-xs text-[var(--erp-muted)]">{hint}</div> : null}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  const styles =
    variant === "primary"
      ? "bg-[var(--erp-accent)] text-white hover:bg-[var(--erp-accent-dark)]"
      : variant === "danger"
        ? "bg-rose-600 text-white hover:bg-rose-700"
        : "border border-[var(--erp-border)] bg-[var(--erp-surface)] text-[var(--erp-ink)] hover:bg-[var(--erp-surface-2)]";
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-[var(--erp-border)] bg-[var(--erp-input-bg)] px-3 py-2 text-sm text-[var(--erp-ink)] outline-none ring-[var(--erp-accent)] placeholder:text-[var(--erp-muted)] focus:ring-2 ${props.className || ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-md border border-[var(--erp-border)] bg-[var(--erp-input-bg)] px-3 py-2 text-sm text-[var(--erp-ink)] outline-none ring-[var(--erp-accent)] focus:ring-2 ${props.className || ""}`}
    />
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-medium text-[var(--erp-muted)]">{children}</label>
  );
}

export function Table({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-[var(--erp-ink)]">
        <thead className="border-b border-[var(--erp-border)] bg-[var(--erp-surface-2)] text-xs uppercase tracking-wide text-[var(--erp-muted)]">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--erp-border)]">{children}</tbody>
      </table>
    </div>
  );
}

export function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "green" | "amber" | "red";
}) {
  const map = {
    slate: "bg-[var(--erp-badge-bg)] text-[var(--erp-badge-ink)]",
    green: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    red: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}
