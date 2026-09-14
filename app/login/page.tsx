"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api, setToken } from "@/lib/api";
import type { User } from "@/lib/types";

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
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-white px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(225,6,0,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(0,0,0,0.05),transparent_45%)]" />
      <div className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#e10600] text-[11px] font-bold text-white">
            BF
          </span>
          <span className="text-sm font-semibold tracking-[0.04em] text-neutral-950">BOLDFRAME</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">Welcome back</h1>
        <p className="mt-1 text-sm text-neutral-600">Log in to your BoldFrame workspace.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-neutral-600">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none ring-[#e10600] focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-neutral-600">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none ring-[#e10600] focus:ring-2"
            />
          </label>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#e10600] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c40500] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {DEMOS.map((d) => (
            <button
              key={d.username}
              type="button"
              className="rounded-lg border border-neutral-200 px-2 py-1.5 text-left text-xs hover:bg-neutral-50"
              onClick={() => {
                setUsername(d.username);
                setPassword(d.password);
              }}
            >
              <div className="font-medium text-neutral-900">{d.label}</div>
              <div className="text-neutral-500">{d.username}</div>
            </button>
          ))}
        </div>

        <p className="mt-5 text-center text-sm text-neutral-500">
          New here?{" "}
          <Link href="/start" className="font-semibold text-neutral-950 hover:underline">
            Start a Project
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
