import { PlayerStat } from "~/types";
import { categorizeDeck } from "./categorize-deck";
import { tournaments } from "./files";
import fs from "fs";

const players = tournaments
  .map((tournament) => tournament.players)
  .flat()
  // .filter(
  //   ({ player }) => player.firstName === "Oliver" && player.surname === "V."
  // )
  .map(({ player, decklist }) => ({
    playerKey: `${player.firstName}-${player.surname}-${player.country}-${player.popid ?? ""}`,
    deck: categorizeDeck(decklist),
    player,
    decklist,
  }))
  .reduce(
    (acc, next) => ({
      ...acc,
      [next.playerKey]: {
        player: next.player,
        archetypes: [...(acc[next.playerKey]?.archetypes ?? []), next.deck],
      },
    }),
    {} as Record<
      string,
      { player: Omit<PlayerStat, "decklistUrl">; archetypes: string[] }
    >
  );

fs.writeFileSync("./data/players.json", JSON.stringify(Object.values(players)));
