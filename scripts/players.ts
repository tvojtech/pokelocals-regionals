import { categorizeDeck } from "./categorize-deck";
import { tournaments } from "./files";
import fs from "fs";

const players = tournaments
  .map((tournament) => tournament.players)
  .flat()
  // .filter(
  //   ({ player }) => player.firstName === "gabriel" && player.surname === "f."
  // )
  .map(({ player, decklist }) => ({
    playerName: `${player.firstName} ${player.surname} (${player.country})`,
    deck: categorizeDeck(decklist),
    player,
    decklist,
  }))
  .reduce(
    (acc, next) => ({
      ...acc,
      [next.playerName]: [...(acc[next.playerName] ?? []), next.deck],
    }),
    {} as Record<string, string[]>
  );

fs.writeFileSync("./data/players.json", JSON.stringify(players));

console.log(players);
