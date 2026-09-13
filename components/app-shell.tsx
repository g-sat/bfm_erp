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

  function logout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--erp-bg)] text-[var(--erp-ink)]">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-[var(--erp-sidebar)] text-slate-100 transition-transform lg:static lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-14 items-center gap-2 border-b border-white/10 px-4">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[var(--erp-accent)] text-xs font-bold text-white">
              BF
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide text-white">BOLDFRAME</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                Creative Services OS
              </div>
            </div>
            <button className="ml-auto lg:hidden" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <nav className="space-y-1 overflow-y-auto p-3 pb-24 text-sm">
            {NAV.map((item) => {
              const Icon = item.icon;
              if (item.href) {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 ${
                      active
                        ? "bg-[var(--erp-accent)] text-white"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {Icon ? <Icon size={16} /> : null}
                    {item.label}
                  </Link>
                );
              }
              const isOpen = expanded === item.label;
              return (
                <div key={item.label}>
                  <button
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-white"
                    onClick={() => setExpanded(isOpen ? "" : item.label)}
                  >
                    {Icon ? <Icon size={16} /> : null}
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown size={14} className={`transition ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && item.children ? (
                    <div className="ml-4 space-y-0.5 border-l border-white/10 pl-2">
                      {item.children.map((child) => {
                        const active = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block rounded-md px-3 py-1.5 ${
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
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--erp-border)] bg-[var(--erp-header)] px-4 backdrop-blur">
            <button
              className="rounded border border-[var(--erp-border)] bg-[var(--erp-surface)] p-2 lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu size={16} />
            </button>
            <div className="text-sm text-[var(--erp-muted)]">Managed Creative Services Platform</div>
            <div className="ml-auto flex items-center gap-3">
              <ThemeToggle />
              <div className="text-right">
                <div className="text-sm font-medium text-[var(--erp-ink)]">{userName}</div>
                <div className="text-[11px] text-[var(--erp-muted)]">{ROLE_LABELS[role] || role}</div>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--erp-border)] bg-[var(--erp-surface)] px-3 py-1.5 text-sm text-[var(--erp-ink)] hover:bg-[var(--erp-surface-2)]"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      ) : null}
    </div>
  );
}
