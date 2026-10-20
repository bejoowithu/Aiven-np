"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createGame,
  getGameById,
  updateGame,
  type GameInput,
} from "../services/gameApi";

interface GameFormProps {
  gameId?: number;
}

const emptyForm: GameInput = {
  nama: "",
  deskripsi: "",
  gambar: "",
  link_download: "",
  platform: "",
};

const inputStyle =
  "w-full rounded-xl border border-[#3066BE]/40 bg-[#0B111B] p-3.5 text-white outline-none transition placeholder:text-gray-500 focus:border-[#119DA4] focus:ring-2 focus:ring-[#119DA4]/20";

export default function GameForm({ gameId }: GameFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<GameInput>(emptyForm);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!savedToken || !savedUser) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      if (user.role?.toLowerCase() !== "admin") {
        router.replace("/games");
        return;
      }

      setToken(savedToken);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;

    if (gameId === undefined) {
      setLoading(false);
      return;
    }

    async function loadGame() {
      try {
        setError("");

        const game = await getGameById(gameId!, token);

        setForm({
          nama: game.nama,
          deskripsi: game.deskripsi ?? "",
          gambar: game.gambar ?? "",
          link_download: game.link_download,
          platform: game.platform ?? "",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data game"
        );
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [token, gameId]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!form.nama.trim() || !form.link_download.trim()) {
      setError("Nama game dan link download wajib diisi.");
      return;
    }

    const payload: GameInput = {
      nama: form.nama.trim(),
      deskripsi: form.deskripsi?.trim() || "",
      gambar: form.gambar?.trim() || "",
      link_download: form.link_download.trim(),
      platform: form.platform?.trim() || "",
    };

    try {
      setSaving(true);

      if (gameId === undefined) {
        await createGame(payload, token);
      } else {
        await updateGame(gameId, payload, token);
      }

      router.push("/games");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan game"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B111B] p-8 text-[#AEECEF]">
        Memuat...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B111B] px-5 py-10 text-white sm:py-14">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => router.push("/games")}
          className="mb-7 text-sm text-[#6D9DC5] transition hover:text-[#AEECEF]"
        >
          ← Kembali ke katalog
        </button>

        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] text-[#119DA4]">
            GAMEVAULT MANAGEMENT
          </p>

          <h1 className="mt-3 text-3xl tracking-tight text-white sm:text-4xl">
            {gameId === undefined ? "Tambah Game" : "Edit Game"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            Isi informasi game di bawah ini.
          </p>
        </div>

        {error && (
          <p className="mb-5 rounded-xl border border-[#119DA4]/40 bg-[#119DA4]/10 p-4 text-sm text-[#AEECEF]">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-[#3066BE]/30 bg-[#111D2C] p-5 sm:p-7"
        >
          <div>
            <label className="mb-2 block text-sm text-[#AEECEF]">
              Nama game *
            </label>

            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              required
              className={inputStyle}
              placeholder="Contoh: Minecraft"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#AEECEF]">
              Platform
            </label>

            <input
              name="platform"
              value={form.platform ?? ""}
              onChange={handleChange}
              className={inputStyle}
              placeholder="Contoh: PC, Android, PlayStation"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#AEECEF]">
              URL gambar
            </label>

            <input
              name="gambar"
              type="url"
              value={form.gambar ?? ""}
              onChange={handleChange}
              className={inputStyle}
              placeholder="https://contoh.com/gambar.jpg"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#AEECEF]">
              Link download *
            </label>

            <input
              name="link_download"
              type="url"
              value={form.link_download}
              onChange={handleChange}
              required
              className={inputStyle}
              placeholder="https://contoh.com/download"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#AEECEF]">
              Deskripsi
            </label>

            <textarea
              name="deskripsi"
              value={form.deskripsi ?? ""}
              onChange={handleChange}
              rows={5}
              className={inputStyle}
              placeholder="Jelaskan tentang game ini..."
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-[#3066BE]/20 pt-5 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-[#3066BE] px-5 py-3.5 text-sm text-white transition hover:bg-[#6D9DC5] hover:text-[#0B111B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Menyimpan..."
                : gameId === undefined
                  ? "Tambah Game"
                  : "Simpan Perubahan"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/games")}
              className="rounded-xl border border-[#119DA4]/40 bg-[#16263D] px-5 py-3.5 text-sm text-[#AEECEF] transition hover:bg-[#119DA4]/20"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}