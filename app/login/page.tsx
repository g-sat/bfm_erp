"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";
import type { User } from "@/lib/types";
import { Button, Card, Input, Label } from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";

const DEMOS = [
  { label: "Admin", username: "admin", password: "admin123" },
  { label: "PM", username: "pm", password: "pm12345" },
  { label: "Client", username: "client", password: "client123" },
  { label: "Creative", username: "creative", password: "creative123" },
];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api<{ access_token: string; user: User }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      setToken(res.data.access_token);
      localStorage.setItem("bfm_erp_user", JSON.stringify(res.data.user));
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,#e10600_0%,#1a1a1a_42%,#000000_100%)] px-4">
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>
      <Card className="relative z-10 w-full max-w-md border-[var(--erp-border)] p-5 shadow-xl sm:p-8">
        <div className="mb-6">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--erp-accent)] text-sm font-bold text-white">
            BF
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--erp-ink)]">BOLDFRAME</h1>
          <p className="mt-1 text-sm text-[var(--erp-muted)]">
            The Operating System for Creative Services
          </p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <Label>Username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-5 grid grid-cols-2 gap-2">
          {DEMOS.map((d) => (
            <button
              key={d.username}
              type="button"
              className="rounded-md border border-[var(--erp-border)] px-2 py-1.5 text-left text-xs hover:bg-[var(--erp-surface-2)]"
              onClick={() => {
                setUsername(d.username);
                setPassword(d.password);
              }}
            >
              <div className="font-medium">{d.label}</div>
              <div className="text-[var(--erp-muted)]">{d.username}</div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
