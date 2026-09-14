"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how" },
  { label: "For businesses", href: "#businesses" },
  { label: "Work", href: "#work" },
  { label: "Pricing", href: "#pricing" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-black/5 bg-white/90 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[4.25rem]">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#e10600] text-[11px] font-bold tracking-wide text-white">
            BF
          </span>
          <span className="text-[15px] font-semibold tracking-[0.04em] text-neutral-950">
            BOLDFRAME
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] text-neutral-600 transition hover:text-neutral-950"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 sm:flex">
          <Link
            href="/login"
            className="text-[13px] font-medium text-neutral-700 transition hover:text-neutral-950"
          >
            Log in
          </Link>
          <Link
            href="/start"
            className="rounded-lg bg-[#e10600] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(225,6,0,0.28)] transition hover:bg-[#c40500]"
          >
            Start a Project
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md border border-neutral-200 p-2 lg:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-b border-neutral-100 bg-white px-4 py-4 lg:hidden"
          >
            <div className="flex flex-col gap-3">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-1 text-sm text-neutral-700"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-neutral-100 pt-3">
                <Link href="/login" className="text-sm font-medium" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link
                  href="/start"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-[#e10600] px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Start a Project
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
