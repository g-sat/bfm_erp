import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#030303] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e10600] text-[11px] font-bold shadow-[0_0_24px_rgba(225,6,0,0.45)]">
              BF
            </span>
            <span className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.2em]">
              BOLDFRAME
            </span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/45">
            The Operating System for Creative Services — managed talent, delivery, and quality from
            brief to payout.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30">Product</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-white/65">
            <a href="#product" className="hover:text-white">
              Product
            </a>
            <a href="#workflow" className="hover:text-white">
              Workflow
            </a>
            <Link href="/start" className="hover:text-white">
              Start a Project
            </Link>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30">Workspace</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-white/65">
            <Link href="/login" className="hover:text-white">
              Sign in
            </Link>
            <Link href="/dashboard" className="hover:text-white">
              Command Center
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-[11px] uppercase tracking-[0.18em] text-white/30 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} BoldFrame Media. All rights reserved.</span>
          <span>Creative Services OS</span>
        </div>
      </div>
    </footer>
  );
}
