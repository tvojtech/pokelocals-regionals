export type PlayerStat = {
  firstName: string;
  surname: string;
  country: string;
  division: string;
  standings: string;
  decklistUrl: string;
};

export type Tournament = { title: string; url: string; data: PlayerStat[] };

export type Decklist = {
  url: string;
  data: { cardName: string; setNumber: string; quantity: string }[];
};

export type ImportRk9TournamentTaskResult = {
  tournament: Omit<Tournament, "data">;
  players: {
    player: Omit<PlayerStat, "decklistUrl">;
    decklist: Decklist;
  }[];
};
