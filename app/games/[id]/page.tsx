"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Game {
  id: number;
  nama: string;
  deskripsi: string | null;
  gambar: string | null;
  link_download: string;
  platform: string | null;
}

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchGame() {
      try {
        setLoading(true);
        setError("");

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ??
          "http://localhost:9669";

        const response = await fetch(
          `${apiUrl}/api/games/${id}`,
          { cache: "no-store" }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Gagal mengambil detail game"
          );
        }

        setGame(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchGame();
    }
  }, [id]);

  const buttonStyle =
    "inline-flex items-center justify-center rounded-xl border border-[#3066BE]/50 bg-[#16263D] px-4 py-3 text-sm text-[#AEECEF] transition hover:border-[#119DA4] hover:bg-[#1C354B]";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B111B] px-5 py-16 text-gray-300">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#3066BE]/30 bg-[#111D2C] p-10 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#3066BE]/20 border-t-[#80DED9]" />
          <p className="mt-4">Memuat detail game...</p>
        </div>
      </main>
    );
  }

  if (error || !game) {
    return (
      <main className="min-h-screen bg-[#0B111B] px-5 py-16 text-white">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#3066BE]/30 bg-[#111D2C] p-8">
          <h2 className="text-2xl text-[#80DED9]">
            Game tidak dapat ditampilkan
          </h2>

          <p className="mt-3 text-gray-400">
            {error || "Game tidak ditemukan."}
          </p>

          <button
            className={`${buttonStyle} mt-6`}
            onClick={() => router.push("/games")}
          >
            ← Kembali ke katalog
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B111B] px-5 py-10 text-white sm:py-14">
      <div className="mx-auto max-w-5xl">
        <button
          className={buttonStyle}
          onClick={() => router.push("/games")}
        >
          ← Kembali ke katalog
        </button>

        <article className="mt-6 overflow-hidden rounded-3xl border border-[#3066BE]/30 bg-[#111D2C] shadow-2xl shadow-black/30">
          {game.gambar ? (
            <img
              src={game.gambar}
              alt={game.nama}
              className="block max-h-[460px] w-full bg-[#0B111B] object-cover"
            />
          ) : (
            <div className="flex h-56 items-center justify-center bg-[#16263D] text-sm text-[#80DED9]">
              Gambar tidak tersedia
            </div>
          )}

          <div className="p-6 sm:p-9">
            <p className="inline-flex rounded-full border border-[#119DA4]/40 bg-[#119DA4]/10 px-3 py-1.5 text-xs text-[#80DED9]">
              {game.platform || "Platform tidak diketahui"}
            </p>

            <h1 className="mt-5 break-words text-3xl tracking-tight text-white sm:text-4xl">
              {game.nama}
            </h1>

            <div className="mt-8 border-t border-[#3066BE]/20 pt-6">
              <h2 className="text-lg text-[#80DED9]">
                Deskripsi
              </h2>

              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-gray-300">
                {game.deskripsi || "Belum ada deskripsi game."}
              </p>
            </div>

            <a
              href={game.link_download}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#3066BE] px-6 py-3.5 text-sm text-white transition hover:bg-[#6D9DC5] hover:text-[#0B111B]"
            >
              Download Game
            </a>
          </div>
        </article>
      </div>
    </main>
  );
}