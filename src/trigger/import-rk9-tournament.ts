import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { apify } from "~/apify";
import {
  Decklist,
  ImportRk9TournamentTaskResult,
  PlayerStat,
  Tournament,
} from "~/types";

export const importRk9Tournament = schemaTask({
  id: "import-rk9-tournament",
  machine: "micro",
  maxDuration: 1500,
  retry: {
    maxAttempts: 0,
  },
  schema: z.object({
    tournamentId: z.string(),
  }),
  run: async (payload, { ctx }): Promise<ImportRk9TournamentTaskResult> => {
    const tournamentId = payload.tournamentId;
    const tournamentCrawlerRun = await apify.task("NQYrnT8ae87bHImuD").call({
      maxRequestsPerCrawl: 10,
      startUrls: [{ url: `https://rk9.gg/roster/${tournamentId}` }],
    });

    const { items: tournaments } = await apify
      .dataset<Tournament>(tournamentCrawlerRun.defaultDatasetId)
      .listItems();

    const tournament = tournaments[0];

    const decklistUrls = tournament.data
      .filter((playerStat) => playerStat.division !== "Masters")
      .map((playerStat) => ({
        url: playerStat.decklistUrl,
      }));

    const decklistCrawlerRun = await apify.task("uWlecca5fbheAcsqi").call({
      maxRequestsPerCrawl: decklistUrls.length,
      startUrls: decklistUrls,
    });

    const { items: decklists } = await apify
      .dataset<Decklist>(decklistCrawlerRun.defaultDatasetId)
      .listItems();

    const playerStatObjects = tournament.data.reduce(
      (acc, player) => ({ ...acc, [player.decklistUrl]: player }),
      {} as Record<string, PlayerStat>
    );

    return {
      tournament: {
        title: tournament.title,
        url: tournament.url,
      },
      players: decklists.map((decklist) => {
        const playerStat = playerStatObjects[decklist.url];
        return {
          player: {
            firstName: playerStat.firstName,
            surname: playerStat.surname,
            country: playerStat.country,
            division: playerStat.division,
            standings: playerStat.standings,
          },
          decklist,
        };
      }),
    };
  },
});
