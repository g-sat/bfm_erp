"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "1,200+", label: "Managed projects delivered" },
  { value: "96%", label: "On-time delivery rate" },
  { value: "4.9/5", label: "Average client rating" },
  { value: "< 24h", label: "Average time to match" },
];

const TRUSTED = ["Nova Labs", "Vayyari", "Aditri", "FinEdge", "UrbanRoot"];

export function MarketingStats() {
  return (
    <section className="border-y border-[#f3d5d3] bg-[#fff7f6]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-neutral-600">{s.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-[#f3d5d3] pt-8 sm:flex-row sm:justify-center sm:gap-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Trusted by teams at
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {TRUSTED.map((name) => (
              <span key={name} className="text-sm font-medium text-neutral-500">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
