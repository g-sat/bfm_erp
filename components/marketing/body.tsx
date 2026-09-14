"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  FileText,
  Keyboard,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import Link from "next/link";

const STATS = [
  { value: "1,200+", label: "Projects delivered" },
  { value: "96%", label: "On-time rate" },
  { value: "4.9/5", label: "Client rating" },
  { value: "<24h", label: "Time to match" },
];

const PRODUCT = [
  {
    icon: Workflow,
    title: "Managed pipeline",
    body: "Brief → match → produce → QA → deliver. One system instead of ten tools and Slack chaos.",
  },
  {
    icon: Sparkles,
    title: "Verified talent",
    body: "Creatives scored to your brief. No proposal fatigue. No marketplace roulette.",
  },
  {
    icon: ShieldCheck,
    title: "Quality locked in",
    body: "Reviews, revisions, and escrow-backed payouts — so delivery actually ships.",
  },
];

const HULY_STYLE = [
  {
    icon: Keyboard,
    title: "Command-speed ops",
    body: "Move from intake to assignment without drowning in threads.",
  },
  {
    icon: CalendarDays,
    title: "Team planner view",
    body: "See every active brief, milestone, and blocker in one pulse.",
  },
  {
    icon: Bell,
    title: "Instant signals",
    body: "QA ready, offer accepted, invoice paid — live in your inbox.",
  },
  {
    icon: MessageSquare,
    title: "Project rooms",
    body: "Files, notes, and decisions stay attached to the work — not lost in chat.",
  },
  {
    icon: FileText,
    title: "Living briefs",
    body: "Requirements evolve with versioned feedback and clear owners.",
  },
  {
    icon: Workflow,
    title: "End-to-end money",
    body: "Invoices, escrow, and creator payouts connected to delivery.",
  },
];

const STEPS = [
  { n: "01", title: "Brief", body: "Drop goals, refs, budget, deadline." },
  { n: "02", title: "Match", body: "We shortlist verified creatives." },
  { n: "03", title: "Produce", body: "PM runs milestones, files, feedback." },
  { n: "04", title: "Deliver", body: "QA + review, then polished handoff." },
];

export function MarketingBody() {
  return (
    <>
      <section className="relative border-y border-white/10 bg-[#090909]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-white/45">{s.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="overflow-hidden border-t border-white/10 py-4">
          <div className="flex animate-[bfmMarquee_28s_linear_infinite] gap-10 whitespace-nowrap text-xs uppercase tracking-[0.35em] text-white/30">
            {Array.from({ length: 2 }).map((_, loop) => (
              <div key={loop} className="flex gap-10">
                {[
                  "Brand systems",
                  "Motion",
                  "Campaigns",
                  "Product UI",
                  "Content sprints",
                  "Launch films",
                  "Social packs",
                ].map((t) => (
                  <span key={`${loop}-${t}`}>
                    {t} <span className="text-[#e10600]">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="product" className="scroll-mt-24 relative py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,6,0,0.12),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ff6b63]">
            Unmatched production
          </p>
          <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Everything you need to run creative work — without the chaos.
          </h2>
          <p className="mt-5 max-w-2xl text-base text-white/55 sm:text-lg">
            BoldFrame is the process, talent, and delivery layer for teams who are done juggling
            freelancers, drives, and half-finished briefs.
          </p>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {PRODUCT.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-6 transition hover:border-[#e10600]/40 hover:shadow-[0_0_50px_rgba(225,6,0,0.12)]"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e10600]/15 text-[#ff6b63] transition group-hover:bg-[#e10600] group-hover:text-white">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{item.body}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HULY_STYLE.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl border border-white/8 bg-black/40 p-5 backdrop-blur"
                >
                  <Icon size={18} className="text-[#e10600]" />
                  <h4 className="mt-3 font-semibold text-white">{item.title}</h4>
                  <p className="mt-2 text-sm text-white/50">{item.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="workflow" className="scroll-mt-24 border-y border-white/10 bg-[#070707] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ff6b63]">
                How it works
              </p>
              <h2 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-3xl font-semibold text-white sm:text-5xl">
                From brief to delivery in four cinematic stages.
              </h2>
            </div>
            <Link
              href="/start"
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-5 py-2.5 text-sm text-white transition hover:border-[#e10600] hover:text-[#ff6b63]"
            >
              Open intake <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0d] p-6"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#e10600]/20 blur-2xl" />
                <div className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[#e10600]">
                  {step.n}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-white/50">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">
            The problem
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-center font-[family-name:var(--font-display)] text-3xl font-semibold text-white sm:text-5xl">
            Creative hiring is broken. Structure fixes it.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[
              {
                title: "Businesses struggle with",
                items: [
                  "Finding trustworthy creatives",
                  "Inconsistent quality",
                  "Missed deadlines",
                  "Endless communication",
                ],
              },
              {
                title: "Creatives struggle with",
                items: [
                  "Proposal fatigue",
                  "Price wars",
                  "Unreliable clients",
                  "One-off gigs only",
                ],
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-7"
              >
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <ul className="mt-5 space-y-3">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-white/55">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#e10600]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto mt-12 max-w-2xl text-center text-xl text-white/70 sm:text-2xl"
          >
            The problem isn&apos;t talent. It&apos;s{" "}
            <span className="text-[#ff6b63]">trust, structure, and management</span>.
          </motion.p>
        </div>
      </section>

      <section id="services" className="scroll-mt-24 border-t border-white/10 bg-[#080808] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="max-w-2xl font-[family-name:var(--font-display)] text-3xl font-semibold text-white sm:text-5xl">
            Services built for launch velocity.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Brand & Design", "Identity, campaigns, product UI."],
              ["Video & Motion", "Ads, explainers, social systems."],
              ["Content Teams", "Writers + producers on rails."],
              ["Managed Delivery", "PM, QA, escrow, handoff."],
            ].map(([title, body], i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-3xl border border-white/10 p-5 transition hover:border-[#e10600]/50"
              >
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-white/50">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,6,0,0.25),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff6b63]">
            Join the movement
          </p>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Unlock the future of creative production.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/55">
            Create your workspace, brief the work, and let BoldFrame run the rest.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/start"
              className="inline-flex items-center gap-2 rounded-full bg-[#e10600] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_50px_rgba(225,6,0,0.45)] transition hover:bg-[#ff1f16]"
            >
              Start a Project <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
