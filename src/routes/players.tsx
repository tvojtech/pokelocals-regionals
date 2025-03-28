import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/players")({
  loader: async () => {
    const data = (await import("./../../data/players.json")).default;
    return {
      players: data,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { players } = Route.useLoaderData();
  const [search, setSearch] = useState("");

  return (
    <div>
      <input
        type="text"
        style={{ border: "1px solid #ccc" }}
        autoFocus
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {Object.entries(players)
          .filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))
          .map(([name, decks]) => (
            <li key={name}>
              <h2 style={{ fontWeight: "bold" }}>{name}</h2>
              <ul>
                {decks.map((deck) => (
                  <li key={deck}>{deck}</li>
                ))}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
}
