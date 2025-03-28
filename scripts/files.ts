import { ImportRk9TournamentTaskResult } from "~/types";
import euic2025 from "../data/euic-2025-decks.json";
import vancouver2025 from "../data/vancouver-2025-decks.json";
import fortaleza2025 from "../data/fortaleza-2025-decks.json";
import stockholm2025 from "../data/stockholm-2025-decks.json";

export const tournaments: ImportRk9TournamentTaskResult[] = [
  stockholm2025,
  vancouver2025,
  fortaleza2025,
  euic2025,
];
