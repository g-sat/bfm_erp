"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

const HeroScene = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[280px] w-full animate-pulse rounded-2xl bg-[#fff1f0]" />
    ),
  },
);

const WORKFLOW = [
  "Brief",
  "Matching",
  "Creative Team",
  "Project Manager",
  "Quality Review",
  "Delivery",
];

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(225,6,0,0.08),transparent_45%),radial-gradient(ellipse_at_80%_20%,rgba(0,0,0,0.04),transparent_40%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-20">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 rounded-full bg-[#fff1f0] px-3 py-1 text-[12px] font-medium text-[#e10600]"
          >
            <span aria-hidden>✦</span> Not another freelance marketplace.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-5 max-w-xl text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.03em] text-neutral-950 sm:text-5xl lg:text-[3.35rem]"
          >
            Creative work,{" "}
            <span className="text-[#e10600]">managed</span> from brief to delivery.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-5 max-w-lg text-[15px] leading-relaxed text-neutral-600 sm:text-base"
          >
            Tell us what you need. We match you with verified creative talent and manage the
            project from start to finish.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/start"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e10600] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(225,6,0,0.3)] transition hover:bg-[#c40500]"
            >
              Start a Project <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50"
            >
              Log in
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-5 text-[12px] tracking-wide text-neutral-500"
          >
            Verified Talent · Managed Execution · Quality Control
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
            <div className="h-[240px] sm:h-[280px] lg:h-[300px]">
              <HeroScene />
            </div>
            <div className="border-t border-neutral-100 px-5 py-4 sm:px-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                The BoldFrame workflow
              </p>
              <ol className="mt-3 space-y-2">
                {WORKFLOW.map((step, i) => (
                  <li key={step} className="flex items-center gap-3 text-sm text-neutral-800">
                    <span className="w-7 font-semibold tabular-nums text-neutral-950">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">{step}</span>
                    <span className="h-px flex-1 max-w-[40%] bg-neutral-200" />
                    {i === WORKFLOW.length - 1 ? (
                      <Check size={14} className="text-[#e10600]" strokeWidth={3} />
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
