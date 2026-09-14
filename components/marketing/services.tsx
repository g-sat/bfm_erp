"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clapperboard, PenTool, ShieldCheck, Users } from "lucide-react";

const SERVICES = [
  {
    icon: PenTool,
    title: "Brand & Design",
    body: "Identity, campaigns, product UI, and visual systems — managed end to end.",
  },
  {
    icon: Clapperboard,
    title: "Video & Motion",
    body: "Ads, explainers, social edits, and motion packages with QA at every cut.",
  },
  {
    icon: Users,
    title: "Content Teams",
    body: "Writers, strategists, and producers matched to your brief and timeline.",
  },
  {
    icon: ShieldCheck,
    title: "Managed Delivery",
    body: "A dedicated PM, milestone tracking, reviews, and escrow-backed payouts.",
  },
];

const STEPS = [
  { n: "01", title: "Brief", body: "Share goals, references, budget, and deadlines in minutes." },
  { n: "02", title: "Match", body: "We shortlist verified creatives scored to your requirements." },
  { n: "03", title: "Produce", body: "Your PM runs the workflow — files, feedback, and milestones." },
  { n: "04", title: "Deliver", body: "QA + client review, then polished assets and clean handoff." },
];

export function MarketingServices() {
  return (
    <>
      <section id="services" className="scroll-mt-24 bg-[#fafafa] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
            Services
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            Everything your creative pipeline needs — without the chaos.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#fff1f0] text-[#e10600]">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-semibold text-neutral-950">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{s.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-24 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
            How it works
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            From brief to delivery in four clear stages.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 p-5 text-white"
              >
                <div className="text-3xl font-semibold text-[#e10600]">{step.n}</div>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 border-y border-neutral-200 bg-[#fff7f6] py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e10600]">
              Ready when you are
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Start a project in minutes. We handle the rest.
            </h2>
            <p className="mt-3 text-sm text-neutral-600 sm:text-base">
              Create your workspace, brief the work, and get matched — no marketplace noise.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/start"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e10600] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(225,6,0,0.28)] transition hover:bg-[#c40500]"
            >
              Start a Project <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900"
            >
              Log in to workspace
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
