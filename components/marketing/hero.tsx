"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

const LaserFlow = dynamic(() => import("./laser-flow"), { ssr: false });
const HeroScene = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse rounded-3xl bg-white/5" />,
  },
);

export function MarketingHero() {
  return (
    <section className="relative min-h-dvh overflow-hidden pt-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 opacity-80">
          <LaserFlow
            color="#e10600"
            horizontalBeamOffset={0.12}
            verticalBeamOffset={0.08}
            flowSpeed={0.28}
            fogIntensity={0.45}
            wispIntensity={0.9}
            mouseTiltStrength={0.35}
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(5,5,5,0.55)_55%,#050505_100%)]" />
        <div className="absolute left-6 top-24 h-10 w-10 border-l border-t border-white/25 sm:left-10" />
        <div className="absolute right-6 top-24 h-10 w-10 border-r border-t border-white/25 sm:right-10" />
        <div className="absolute bottom-10 left-6 h-10 w-10 border-b border-l border-white/25 sm:left-10" />
        <div className="absolute bottom-10 right-6 h-10 w-10 border-b border-r border-white/25 sm:right-10" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:pb-28 lg:pt-16">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#e10600]/40 bg-[#e10600]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff6b63]"
          >
            <Play size={10} fill="currentColor" /> Transmission live
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55 }}
            className="mt-6 text-xs font-medium uppercase tracking-[0.35em] text-white/45"
          >
            Creative services OS
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.7 }}
            className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-[clamp(2.6rem,7vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white"
          >
            Creative work,{" "}
            <span className="bg-gradient-to-b from-[#ff4d45] via-[#e10600] to-[#7a0300] bg-clip-text text-transparent [text-shadow:0_0_40px_rgba(225,6,0,0.45)]">
              managed
            </span>{" "}
            from brief to delivery.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.55 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg"
          >
            Not another freelance marketplace. BoldFrame matches verified talent, runs the
            project, and ships quality — like an operating system for creative teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/start"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#e10600] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_rgba(225,6,0,0.45)] transition hover:bg-[#ff1f16]"
            >
              Start a Project
              <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/10"
            >
              Sign in to workspace
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[12px] uppercase tracking-[0.2em] text-white/35"
          >
            <span>Verified talent</span>
            <span className="text-[#e10600]">•</span>
            <span>Managed execution</span>
            <span className="text-[#e10600]">•</span>
            <span>Quality control</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.75 }}
          className="relative z-10"
        >
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/40 shadow-[0_40px_120px_rgba(225,6,0,0.18)] backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
              <span>Live workflow</span>
              <span className="flex items-center gap-1.5 text-[#ff6b63]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e10600]" />
                Online
              </span>
            </div>
            <div className="h-[300px] sm:h-[340px] lg:h-[380px]">
              <HeroScene />
            </div>
            <div className="border-t border-white/10 px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                The BoldFrame stack
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Brief", "Match", "Produce", "QA", "Deliver"].map((step, i) => (
                  <span
                    key={step}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      i === 4
                        ? "bg-[#e10600] text-white shadow-[0_0_20px_rgba(225,6,0,0.45)]"
                        : "border border-white/10 bg-white/5 text-white/70"
                    }`}
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
