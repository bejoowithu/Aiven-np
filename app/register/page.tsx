
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9669";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password belum cocok.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registrasi gagal.");
        return;
      }

      setSuccess("Akun berhasil dibuat! Mengarahkan ke login...");

      window.setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch {
      setError("Gagal menghubungi server. Pastikan backend aktif.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e8eaf2] p-4 text-[#29283d]">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl md:min-h-[620px] md:grid-cols-2">
        <section className="flex min-h-[220px] items-center justify-center bg-gradient-to-br from-[#3066BE] to-[#119DA4] p-8 md:min-h-full">
          <div className="max-w-xs text-center">
            <h2 className="text-3xl font-bold text-white">
              Join Game World
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/90">
              Buat akun dan temukan petualangan gaming baru.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 text-right text-xs text-gray-500">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-500 hover:underline"
              >
                Sign in
              </Link>
            </div>

            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="mb-8 mt-2 text-sm text-gray-500">
              Daftar untuk mulai menjelajahi dunia gaming.
            </p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Buat username"
                  autoComplete="username"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
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
                  placeholder="Minimal 8 karakter"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {success && (
                <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#3066BE] py-3 font-semibold text-white transition hover:bg-[#119DA4] disabled:opacity-60"
              >
                {loading ? "Membuat akun..." : "Create Account"}
              </button>
            </form>

          </div>
        </section>
      </div>
    </main>
  );
}
