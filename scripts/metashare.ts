import { ImportRk9TournamentTaskResult } from "~/types";
import { categorizeDeck } from "./categorize-deck";
import { tournaments } from "./files";
import fs from "fs";

const computeMeta = (
  division: string,
  players: ImportRk9TournamentTaskResult["players"]
) =>
  players
    .filter(({ player }) => player.division === division)
    .map((player) => player.decklist)
    .map(categorizeDeck)
    .reduce(
      (acc, deck) => {
        return { ...acc, [deck]: (acc[deck] ?? 0) + 1 };
      },
      {} as Record<string, number>
    );

const meta = tournaments.map((tournament) => ({
  tournament: tournament.tournament,
  meta: {
    juniors: computeMeta("Junior", tournament.players),
    seniors: computeMeta("Senior", tournament.players),
  },
}));

fs.writeFileSync("./data/metashare.json", JSON.stringify(meta));
