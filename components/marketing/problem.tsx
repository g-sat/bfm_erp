"use client";

import { motion } from "framer-motion";
import { Building2, Palette, X } from "lucide-react";

const BUSINESS = [
  "Finding trustworthy creatives",
  "Inconsistent quality",
  "Missed deadlines",
  "Endless communication",
  "Managing freelancers",
];

const CREATIVE = [
  "Proposal fatigue",
  "Price wars",
  "Unreliable clients",
  "One-time projects",
  "Lack of long-term opportunities",
];

function PainCard({
  title,
  icon: Icon,
  items,
  delay = 0,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  items: string[];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.04)] sm:p-8"
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1f0] text-[#e10600]">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-semibold text-neutral-950">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-600">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#fff1f0]">
              <X size={10} className="text-[#e10600]" strokeWidth={3} />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function MarketingProblem() {
  return (
    <section id="businesses" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
          The problem
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
          Creative hiring is broken
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm text-neutral-600 sm:text-base">
          Both sides of the market are frustrated — and it isn&apos;t because good work is impossible.
        </p>

        <div id="creators" className="mt-12 grid gap-5 md:grid-cols-2">
          <PainCard title="Businesses struggle with" icon={Building2} items={BUSINESS} />
          <PainCard title="Creatives struggle with" icon={Palette} items={CREATIVE} delay={0.08} />
        </div>

        <div className="mt-14 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.h3
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl"
          >
            The problem isn&apos;t a lack of talent. It&apos;s a lack of trust, structure, and
            management.
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-[#fff1f0] to-white p-8"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#e10600]/10 blur-2xl" />
            <p className="relative text-sm leading-relaxed text-neutral-700">
              BoldFrame sits between clients and creatives as an operating system — briefing,
              matching, project management, QA, and payouts in one managed flow.
            </p>
            <div className="relative mt-6 grid grid-cols-3 gap-3 text-center">
              {["Trust", "Structure", "Delivery"].map((label) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/80 bg-white/80 px-2 py-3 text-xs font-semibold text-neutral-900 shadow-sm"
                >
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
