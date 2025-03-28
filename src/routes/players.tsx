import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useMemo } from "react";
import { z } from "zod";

const defaultValues = {
  search: "",
};

const searchSchema = z.object({
  search: z.string().optional().default(defaultValues.search),
});

export const Route = createFileRoute("/players")({
  validateSearch: zodValidator(searchSchema),
  search: {
    middlewares: [stripSearchParams(defaultValues)],
  },
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
  const { search } = Route.useSearch();
  const navigate = Route.useNavigate();

  const filteredPlayers = useMemo(() => {
    return players.filter(({ player }) => {
      return `${player.firstName} ${player.surname}`
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [search, players]);

  return (
    <div>
      <input
        type="text"
        style={{ border: "1px solid #ccc" }}
        autoFocus
        value={search}
        onChange={(e) => navigate({ search: { search: e.target.value } })}
      />
      <ul>
        {filteredPlayers.map(({ player, archetypes }) => (
          <li key={`${player.firstName}-${player.surname}-${player.country}`}>
            <h2
              style={{ fontWeight: "bold" }}
            >{`${player.firstName} ${player.surname} (${player.country})`}</h2>
            <ul>
              {archetypes.map((deck) => (
                <li key={deck}>{deck}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
