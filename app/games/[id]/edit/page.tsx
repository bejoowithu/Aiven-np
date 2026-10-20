"use client";

import { useParams } from "next/navigation";
import GameForm from "../../../components/gameForm";

export default function EditGamePage() {
  const params = useParams<{ id: string }>();
  const gameId = Number(params.id);

  if (!Number.isInteger(gameId) || gameId < 1) {
    return (
      <main className="min-h-screen bg-[#0B111B] p-8 text-[#80DED9]">
        ID game tidak valid.
      </main>
    );
  }

  return <GameForm gameId={gameId} />;
}