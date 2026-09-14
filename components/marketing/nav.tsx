"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  { label: "Product", href: "#product" },
  { label: "Workflow", href: "#workflow" },
  { label: "Services", href: "#services" },
  { label: "Why BoldFrame", href: "#why" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-[#050505]/80 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-[#e10600] text-[11px] font-bold tracking-wider text-white shadow-[0_0_24px_rgba(225,6,0,0.55)]">
            <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent)] opacity-0 transition group-hover:animate-[bfmShimmer_1.2s_ease]" />
            BF
          </span>
          <span className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.22em] text-white">
            BOLDFRAME
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] text-white/55 transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-[13px] font-medium text-white/70 transition hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/start"
            className="rounded-full bg-[#e10600] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_0_28px_rgba(225,6,0,0.4)] transition hover:bg-[#ff1a12] hover:shadow-[0_0_40px_rgba(225,6,0,0.55)]"
          >
            Start a Project
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-white/15 p-2 text-white lg:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-b border-white/10 bg-[#080808] px-4 py-5 lg:hidden"
          >
            <div className="flex flex-col gap-3">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-1 text-sm text-white/70"
                >
                  {l.label}
                </a>
              ))}
              <Link href="/login" onClick={() => setOpen(false)} className="pt-2 text-sm text-white">
                Sign in
              </Link>
              <Link
                href="/start"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[#e10600] px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Start a Project
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
