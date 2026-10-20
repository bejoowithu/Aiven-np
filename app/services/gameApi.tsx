
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9669";

export interface Game {
  id: number;
  nama: string;
  deskripsi: string | null;
  gambar: string | null;
  link_download: string;
  platform: string | null;
}

export type GameInput = Omit<Game, "id">;

function getHeaders(token?: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(response: Response) {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Permintaan gagal");
  }

  return result;
}

export async function getGames(token?: string): Promise<Game[]> {
  const response = await fetch(`${API_URL}/api/games`, {
    headers: getHeaders(token),
    cache: "no-store",
  });

  const result = await handleResponse(response);
  return Array.isArray(result) ? result : result.data;
}

export async function getGameById(
  id: number,
  token?: string
): Promise<Game> {
  const response = await fetch(`${API_URL}/api/games/${id}`, {
    headers: getHeaders(token),
    cache: "no-store",
  });

  const result = await handleResponse(response);
  return result.data;
}

export async function createGame(
  game: GameInput,
  token: string
) {
  const response = await fetch(`${API_URL}/api/games`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(game),
  });

  return handleResponse(response);
}

export async function updateGame(
  id: number,
  game: GameInput,
  token: string
) {
  const response = await fetch(`${API_URL}/api/games/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(game),
  });

  return handleResponse(response);
}

export async function deleteGame(id: number, token: string) {
  const response = await fetch(`${API_URL}/api/games/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });

  return handleResponse(response);
}
