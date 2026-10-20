"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getGames,
  deleteGame,
  type Game,
} from "../services/gameApi";

export default function GameList() {
  const router = useRouter();

  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<{
    username: string;
    role: string;
  } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    loadGames();
  }, [router]);

  async function loadGames() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const data = await getGames(token ?? undefined);

      setGames(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data game."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number, nama: string) {
    const yakin = window.confirm(
      `Yakin ingin menghapus game "${nama}"?`
    );

    if (!yakin) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      await deleteGame(id, token);

      setGames((prev) => prev.filter((game) => game.id !== id));
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Gagal menghapus game."
      );
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  }

  const filteredGames = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return games.filter((game) =>
      [
        game.nama,
        game.platform ?? "",
        game.deskripsi ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [games, search]);

  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <main className="min-h-screen bg-[#040B14] text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-30 border-b border-[#119DA4]/40 bg-[#040B14]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/games" className="flex items-center gap-3">

            <div>

            </div>
          </Link>

          <div className="flex items-center gap-3">

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl border border-[#3066BE]/40 bg-[#0A1624] px-3 py-2 transition hover:border-[#80DED9]/60 hover:bg-[#112133]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#3066BE] to-[#119DA4]">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>

                <span className="hidden max-w-28 truncate text-sm sm:block">
                  {user?.username || "Profile"}
                </span>

                <span className="text-xs text-gray-400">⌄</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-[#3066BE]/40 bg-[#0D1A2A] p-4 shadow-2xl shadow-black/50">
                  <p className="mb-3 text-xs uppercase tracking-widest text-[#80DED9]">
                    My Profile
                  </p>

                  <div className="mb-3 rounded-xl bg-[#040B14] p-3">
                    <p className="text-xs text-gray-500">Username</p>
                    <p className="mt-1 break-words">
                      {user?.username || "-"}
                    </p>
                  </div>

                  <div className="mb-4 rounded-xl bg-[#040B14] p-3">
                    <p className="text-xs text-gray-500">Role</p>
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs ${
                        isAdmin
                          ? "bg-[#3066BE]/40 text-[#AEECEF]"
                          : "bg-[#119DA4]/30 text-[#80DED9]"
                      }`}
                    >
                      {user?.role || "member"}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl border border-[#6D9DC5]/40 bg-[#119DA4]/30 px-4 py-3 text-sm text-[#AEECEF] transition hover:bg-[#119DA4]/50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-12 lg:px-8 lg:pt-16">
        <div className="relative overflow-hidden rounded-3xl border border-[#3066BE]/40 bg-gradient-to-br from-[#143259] via-[#0A1B30] to-[#040B14] p-7 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#3066BE]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-[#119DA4]/20 blur-3xl" />

          <div className="relative max-w-2xl">
            <p className="inline-flex rounded-full border border-[#80DED9]/20 bg-[#119DA4]/20 px-3 py-1.5 text-xs tracking-wide text-[#AEECEF]">
              YOUR NEXT ADVENTURE STARTS HERE
            </p>

            <h2 className="mt-5 text-4xl leading-tight tracking-tight text-white sm:text-5xl">
              Find Your Next Favorite Game.
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-gray-300/70 sm:text-base">
              cari game disini ae udh
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-[#3066BE]/50 bg-black/20 px-4 py-3 text-sm text-gray-300">
                <span className="mr-2 text-white">{games.length}</span>
                Game tersedia
              </div>

              {isAdmin && (
                <Link
                  href="/games/new"
                  className="rounded-xl bg-[#3066BE] px-5 py-3 text-sm text-white shadow-lg shadow-[#119DA4]/30 transition hover:bg-[#6D9DC5]"
                >
                  + Tambah Game
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* GAME COLLECTION & SEARCH */}
      <section className="mx-auto max-w-7xl px-5 pb-12 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#80DED9]">
              EXPLORE LIBRARY
            </p>

            <h2 className="mt-2 text-2xl sm:text-3xl">
              Game Collection
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Cari game berdasarkan nama, platform, atau deskripsi.
            </p>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#80DED9]">
              ⌕
            </span>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari game..."
              className="w-full rounded-xl border border-[#119DA4]/30 bg-[#0A1624] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#3066BE] focus:ring-2 focus:ring-[#3066BE]/50"
            />
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#119DA4]/30 bg-[#0A1624] py-20 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#119DA4]/30 border-t-[#80DED9]" />
            <p className="mt-4 text-sm text-gray-400">
              Memuat koleksi game...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-[#3066BE]/40 bg-[#0D1A2A] p-8 text-center">
            <p className="text-[#AEECEF]">{error}</p>
            <button
              onClick={loadGames}
              className="mt-4 rounded-lg bg-[#3066BE]/60 px-4 py-2 text-sm transition hover:bg-[#3066BE]/80"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#3066BE]/40 bg-[#08121E] py-20 text-center">
            <p className="text-lg">
              {search ? "Game nggak ditemukan" : "Belum ada game"}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              {search
                ? "Coba kata kunci yang lain."
                : "Koleksi game lo bakal muncul di sini."}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-gray-400">
              Menampilkan{" "}
              <span className="text-white">{filteredGames.length}</span>{" "}
              dari {games.length} game
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGames.map((game) => (
                <article
                  key={game.id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#119DA4]/30 bg-[#0A1624] transition duration-300 hover:-translate-y-1 hover:border-[#6D9DC5]/70 hover:shadow-xl hover:shadow-[#119DA4]/20"
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#119DA4]/20 to-[#08121E]">
                    {game.gambar ? (
                      <img
                        src={game.gambar}
                        alt={game.nama}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl text-[#80DED9]/50">
                        
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <span className="absolute bottom-3 left-3 rounded-lg border border-[#AEECEF]/20 bg-[#0A1624]/85 px-3 py-1.5 text-xs text-[#AEECEF] backdrop-blur">
                      {game.platform || "Multi-platform"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-1 text-lg transition group-hover:text-[#AEECEF]">
                      {game.nama}
                    </h3>

                    <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-gray-400">
                      {game.deskripsi ||
                        "Belum ada deskripsi untuk game ini."}
                    </p>

                    <div className="mt-5 flex items-center gap-2 border-t border-[#119DA4]/30 pt-4">
                      <Link
                        href={`/games/${game.id}`}
                        className="flex-1 rounded-xl bg-[#3066BE] px-3 py-2.5 text-center text-sm text-white transition hover:bg-[#6D9DC5]"
                      >
                        Detail Game
                      </Link>

                      {isAdmin && (
                        <div className="flex gap-2">
                          <Link
                            href={`/games/${game.id}/edit`}
                            title="Edit game"
                            className="rounded-xl border border-[#3066BE]/60 bg-[#119DA4]/20 px-3 py-2.5 text-sm transition hover:bg-[#3066BE]/40"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(game.id, game.nama)
                            }
                            title="Hapus game"
                            className="rounded-xl border border-[#6D9DC5]/40 bg-[#119DA4]/30 px-3 py-2.5 text-sm text-[#AEECEF] transition hover:bg-[#3066BE]/50"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {/* FOOTER */}
      <footer 
        suppressHydrationWarning 
        className="border-t border-[#119DA4]/40 bg-[#040B14] px-5 py-6 text-center text-xs text-gray-500"
      >
        © {new Date().getFullYear()} LockedGames.
      </footer>

      {/* PROFILE DROPDOWN OVERLAY */}
      {profileOpen && (
        <button
          aria-label="Tutup menu profile"
          onClick={() => setProfileOpen(false)}
          className="fixed inset-0 z-20 cursor-default"
        />
      )}
    </main>
  );
}