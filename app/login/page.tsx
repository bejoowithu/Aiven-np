
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9669";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login gagal.");
        return;
      }

      if (!data.token) {
        setError("Token tidak ditemukan dari server.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(
          data.user ?? {
            username,
            role: data.role ?? "member",
          }
        )
      );

      router.replace("/games");
    } catch {
      setError("Gagal menghubungi server. Pastikan backend aktif.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e8eaf2] p-4 text-[#29283d]">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl md:min-h-[580px] md:grid-cols-2">
        <section className="flex min-h-[220px] items-center justify-center bg-gradient-to-br from-[#3066BE] to-[#119DA4] p-8 md:min-h-full">
          <div className="max-w-xs text-center">
            <h2 className="text-3xl font-bold text-white">
              Game World
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/90">
              Temukan game favorit dan mulai petualangan lo.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-12">
          <div className="w-full max-w-sm">
            <div className="mb-10 text-right text-xs text-gray-500">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-500 hover:underline"
              >
                Register now
              </Link>
            </div>

            <h1 className="text-3xl font-bold">Hello Again!</h1>
            <p className="mb-8 mt-2 text-sm text-gray-500">
              Welcome back! Login untuk melanjutkan.
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  autoComplete="username"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#3066BE] py-3 font-semibold text-white transition hover:bg-#119DA4] disabled:opacity-60"
              >
                {loading ? "Memproses..." : "Sign In"}
              </button>
            </form>
            
          </div>
        </section>
      </div>
    </main>
  );
}
