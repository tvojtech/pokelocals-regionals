import { categorizeDeck } from "./categorize-deck";
import stockholm2025 from "../data/stockholm-2025-decks.json";

const { tournament, players } = stockholm2025;

const metaShare = players
  .map((player) => player.decklist)
  .map(categorizeDeck)
  .reduce(
    (acc, deck) => {
      return { ...acc, [deck]: (acc[deck] ?? 0) + 1 };
    },
    {} as Record<string, number>
  );

console.log(metaShare);
