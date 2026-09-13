"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import { NAV, ROLE_LABELS } from "@/lib/nav";
import { clearToken, getToken } from "@/lib/api";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string>("Project Intake");
  const [userName, setUserName] = useState("User");
  const [role, setRole] = useState("admin");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    try {
      const raw = localStorage.getItem("bfm_erp_user");
      if (raw) {
        const u = JSON.parse(raw);
        setUserName(u.full_name || "User");
        setRole(u.role || "admin");
      }
    } catch {
      /* ignore */
    }
  }, [router]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    for (const item of NAV) {
      if (item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"))) {
        setExpanded(item.label);
        break;
      }
    }
  }, [pathname]);

  function logout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[var(--erp-bg)] text-[var(--erp-ink)]">
      <div className="flex min-h-dvh">
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col border-r border-white/10 bg-[var(--erp-sidebar)] text-slate-100 shadow-xl transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-72 lg:translate-x-0 lg:shadow-none ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-14 shrink-0 items-center gap-2 border-b border-white/10 px-4 pt-[env(safe-area-inset-top)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[var(--erp-accent)] text-xs font-bold text-white">
              BF
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-wide text-white">BOLDFRAME</div>
              <div className="truncate text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                Creative Services OS
              </div>
            </div>
            <button
              type="button"
              aria-label="Close menu"
              className="ml-auto rounded p-2 text-slate-300 hover:bg-white/10 lg:hidden"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto overscroll-contain p-3 pb-8 text-sm">
            {NAV.map((item) => {
              const Icon = item.icon;
              if (item.href) {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex min-h-10 items-center gap-2 rounded-md px-3 py-2 ${
                      active
                        ? "bg-[var(--erp-accent)] text-white"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {Icon ? <Icon size={16} className="shrink-0" /> : null}
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              }
              const isOpen = expanded === item.label;
              const childActive = item.children?.some(
                (c) => pathname === c.href || pathname.startsWith(c.href + "/"),
              );
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    className={`flex min-h-10 w-full items-center gap-2 rounded-md px-3 py-2 ${
                      childActive
                        ? "text-white"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={() => setExpanded(isOpen ? "" : item.label)}
                  >
                    {Icon ? <Icon size={16} className="shrink-0" /> : null}
                    <span className="flex-1 truncate text-left">{item.label}</span>
                    <ChevronDown
                      size={14}
                      className={`shrink-0 transition ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && item.children ? (
                    <div className="ml-4 space-y-0.5 border-l border-white/10 pl-2">
                      {item.children.map((child) => {
                        const active = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block min-h-9 rounded-md px-3 py-2 ${
                              active
                                ? "bg-white/10 text-white"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-[var(--erp-border)] bg-[var(--erp-header)] px-3 backdrop-blur sm:gap-3 sm:px-4 pt-[env(safe-area-inset-top)]">
            <button
              type="button"
              aria-label="Open menu"
              className="shrink-0 rounded border border-[var(--erp-border)] bg-[var(--erp-surface)] p-2 lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu size={16} />
            </button>
            <div className="min-w-0 flex-1 truncate text-xs text-[var(--erp-muted)] sm:text-sm">
              <span className="hidden sm:inline">Managed Creative Services Platform</span>
              <span className="sm:hidden font-medium text-[var(--erp-ink)]">BOLDFRAME</span>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3">
              <ThemeToggle />
              <div className="hidden max-w-[9rem] text-right min-[420px]:block sm:max-w-none">
                <div className="truncate text-sm font-medium text-[var(--erp-ink)]">{userName}</div>
                <div className="truncate text-[11px] text-[var(--erp-muted)]">
                  {ROLE_LABELS[role] || role}
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                aria-label="Logout"
                className="inline-flex items-center gap-1 rounded-md border border-[var(--erp-border)] bg-[var(--erp-surface)] p-2 text-sm text-[var(--erp-ink)] hover:bg-[var(--erp-surface-2)] sm:px-3 sm:py-1.5"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>
          <main className="mx-auto w-full max-w-[1600px] flex-1 overflow-x-hidden p-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
