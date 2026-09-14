"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { api, setToken } from "@/lib/api";

const INDUSTRIES = [
  "Technology",
  "E-commerce",
  "Healthcare",
  "Finance",
  "Media",
  "Education",
  "Consumer brands",
  "Other",
];

const SIZES = ["1–10", "11–50", "51–200", "201–1000", "1000+"];

const CATEGORIES = ["design", "video", "writing", "development", "branding", "social"];

export default function StartProjectPage() {
  const router = useRouter();
  const params = useSearchParams();
  const initialRole = params.get("role") === "creative" ? "creative" : "business";
  const [role, setRole] = useState<"business" | "creative">(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const [biz, setBiz] = useState({
    company: "",
    website: "",
    industry: "",
    size: "",
    contact: "",
    email: "",
    phone: "",
    password: "",
  });

  const [creative, setCreative] = useState({
    displayName: "",
    headline: "",
    skills: "",
    category: "design",
    email: "",
    phone: "",
    password: "",
    location: "",
  });

  const [brief, setBrief] = useState({
    title: "",
    category: "design",
    budget: "",
    details: "",
  });

  const subtitle = useMemo(
    () =>
      role === "business"
        ? "Create your workspace. You'll brief your first project right after."
        : "Create your creator profile. Get matched to managed projects.",
    [role],
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api<{
        access_token: string;
        user: { full_name: string; role: string };
      }>("/api/public/start", {
        method: "POST",
        body: JSON.stringify(
          role === "business"
            ? {
                role: "business",
                company_name: biz.company,
                website: biz.website || null,
                industry: biz.industry || null,
                team_size: biz.size || null,
                contact_name: biz.contact,
                email: biz.email,
                phone: biz.phone || null,
                password: biz.password,
                project_title: brief.title || null,
                project_category: brief.category || null,
                project_budget: brief.budget ? Number(brief.budget) : null,
                project_brief: brief.details || null,
              }
            : {
                role: "creative",
                display_name: creative.displayName,
                headline: creative.headline || null,
                skills: creative.skills || null,
                categories: creative.category,
                email: creative.email,
                phone: creative.phone || null,
                password: creative.password,
                location: creative.location || null,
              },
        ),
      });
      setToken(res.data.access_token);
      localStorage.setItem("bfm_erp_user", JSON.stringify(res.data.user));
      setDone(true);
      setTimeout(() => router.replace("/dashboard"), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create workspace");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-[#fafafa] pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-center text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            Start a project with BoldFrame.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-neutral-600 sm:text-base">
            {subtitle}
          </p>

          <div className="mx-auto mt-6 flex w-fit rounded-full border border-neutral-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setRole("business")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                role === "business"
                  ? "bg-[#e10600] text-white"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              I&apos;m a business
            </button>
            <button
              type="button"
              onClick={() => setRole("creative")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                role === "creative"
                  ? "bg-[#e10600] text-white"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              I&apos;m a creative
            </button>
          </div>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:p-8"
        >
          {role === "business" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company name">
                <Input
                  required
                  placeholder="Nova Labs"
                  value={biz.company}
                  onChange={(v) => setBiz({ ...biz, company: v })}
                />
              </Field>
              <Field label="Company website">
                <Input
                  placeholder="https://novalabs.io"
                  value={biz.website}
                  onChange={(v) => setBiz({ ...biz, website: v })}
                />
              </Field>
              <Field label="Industry">
                <Select
                  required
                  value={biz.industry}
                  onChange={(v) => setBiz({ ...biz, industry: v })}
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Company size">
                <Select required value={biz.size} onChange={(v) => setBiz({ ...biz, size: v })}>
                  <option value="">Select size</option>
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Contact name">
                <Input
                  required
                  placeholder="Priya Nair"
                  value={biz.contact}
                  onChange={(v) => setBiz({ ...biz, contact: v })}
                />
              </Field>
              <Field label="Work email">
                <Input
                  required
                  type="email"
                  placeholder="priya@novalabs.io"
                  value={biz.email}
                  onChange={(v) => setBiz({ ...biz, email: v })}
                />
              </Field>
              <Field label="Phone">
                <Input
                  placeholder="+91 98xxx xxxxx"
                  value={biz.phone}
                  onChange={(v) => setBiz({ ...biz, phone: v })}
                />
              </Field>
              <Field label="Password">
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={biz.password}
                  onChange={(v) => setBiz({ ...biz, password: v })}
                />
              </Field>
              <div className="sm:col-span-2 mt-2 border-t border-neutral-100 pt-4">
                <p className="mb-3 text-sm font-semibold text-neutral-900">First project (optional)</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Project title">
                    <Input
                      placeholder="Brand refresh for launch"
                      value={brief.title}
                      onChange={(v) => setBrief({ ...brief, title: v })}
                    />
                  </Field>
                  <Field label="Category">
                    <Select
                      value={brief.category}
                      onChange={(v) => setBrief({ ...brief, category: v })}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Budget (optional)">
                    <Input
                      type="number"
                      placeholder="150000"
                      value={brief.budget}
                      onChange={(v) => setBrief({ ...brief, budget: v })}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Brief">
                      <textarea
                        className="min-h-[88px] w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-[#e10600] placeholder:text-neutral-400 focus:ring-2"
                        placeholder="Goals, references, timeline..."
                        value={brief.details}
                        onChange={(e) => setBrief({ ...brief, details: e.target.value })}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Display name">
                <Input
                  required
                  placeholder="Aisha Khan"
                  value={creative.displayName}
                  onChange={(v) => setCreative({ ...creative, displayName: v })}
                />
              </Field>
              <Field label="Headline">
                <Input
                  placeholder="Motion designer · Brand films"
                  value={creative.headline}
                  onChange={(v) => setCreative({ ...creative, headline: v })}
                />
              </Field>
              <Field label="Primary category">
                <Select
                  value={creative.category}
                  onChange={(v) => setCreative({ ...creative, category: v })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Location">
                <Input
                  placeholder="Bengaluru"
                  value={creative.location}
                  onChange={(v) => setCreative({ ...creative, location: v })}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Skills">
                  <Input
                    placeholder="After Effects, Cinema 4D, Brand systems"
                    value={creative.skills}
                    onChange={(v) => setCreative({ ...creative, skills: v })}
                  />
                </Field>
              </div>
              <Field label="Email">
                <Input
                  required
                  type="email"
                  placeholder="you@studio.com"
                  value={creative.email}
                  onChange={(v) => setCreative({ ...creative, email: v })}
                />
              </Field>
              <Field label="Phone">
                <Input
                  value={creative.phone}
                  onChange={(v) => setCreative({ ...creative, phone: v })}
                />
              </Field>
              <Field label="Password">
                <Input
                  required
                  type="password"
                  value={creative.password}
                  onChange={(v) => setCreative({ ...creative, password: v })}
                />
              </Field>
            </div>
          )}

          {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
          {done ? (
            <p className="mt-4 text-sm text-emerald-600">Workspace ready — opening your dashboard…</p>
          ) : null}

          <button
            type="submit"
            disabled={loading || done}
            className="mt-6 w-full rounded-xl bg-[#e10600] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c40500] disabled:opacity-60"
          >
            {loading
              ? "Creating workspace…"
              : role === "business"
                ? "Create workspace"
                : "Join as creator"}
          </button>
          <p className="mt-4 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-neutral-950 hover:underline">
              Log in
            </Link>
          </p>
        </motion.form>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-neutral-600">{label}</span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  ...props
}: {
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none ring-[#e10600] placeholder:text-neutral-400 focus:ring-2"
    />
  );
}

function Select({
  value,
  onChange,
  children,
  ...props
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value">) {
  return (
    <select
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none ring-[#e10600] focus:ring-2"
    >
      {children}
    </select>
  );
}
