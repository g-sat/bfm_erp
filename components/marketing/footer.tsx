import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer id="work" className="bg-neutral-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#e10600] text-[11px] font-bold">
              BF
            </span>
            <span className="text-sm font-semibold tracking-[0.06em]">BOLDFRAME</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            The Operating System for Creative Services — managed talent, delivery, and quality
            from brief to payout.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Product</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/75">
            <a href="#services" className="hover:text-white">
              Services
            </a>
            <a href="#how" className="hover:text-white">
              How it works
            </a>
            <Link href="/start" className="hover:text-white">
              Start a Project
            </Link>
            <Link href="/login" className="hover:text-white">
              Log in
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Workspace</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/75">
            <Link href="/dashboard" className="hover:text-white">
              Command Center
            </Link>
            <Link href="/start?role=creative" className="hover:text-white">
              Join as Creator
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} BOLDFRAME. All rights reserved.</span>
          <span>Creative Services OS</span>
        </div>
      </div>
    </footer>
  );
}
