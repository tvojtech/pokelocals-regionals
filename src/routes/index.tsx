import chroma from "chroma-js";
import { createFileRoute } from "@tanstack/react-router";
import { ArrayElement } from "~/typescript";

export const Route = createFileRoute("/")({
  loader: async () => {
    return (await import("./../../data/metashare.json")).default;
  },
  component: Component,
});

function Component() {
  const data = Route.useLoaderData();

  const archetypeToColor = data
    .map(({ meta }) => [
      ...Object.keys(meta.juniors),
      ...Object.keys(meta.seniors),
    ])
    .flat()
    .reduce(
      (acc, archetype) => ({
        ...acc,
        [archetype]: getRandomBgColor().backgroundColor,
      }),
      {} as Record<string, string>
    );

  const divisions: (keyof ArrayElement<typeof data>["meta"])[] = [
    "seniors",
    "juniors",
  ];

  return (
    <div className="flex flex-col gap-12">
      {divisions.map((division) => (
        <div>
          <h1 className="text-2xl font-bold mb-4 capitalize">{division}</h1>
          <div className="flex gap-4 flex-wrap">
            {data.map(({ tournament, meta }) => (
              <div key={tournament.url} className="w-full max-w-[330px]">
                <h2 className="text-xl font-bold mb-2">
                  {shortenTitle(tournament.title)}
                </h2>
                <MetaShare
                  meta={meta[division]}
                  archetypeToColor={archetypeToColor}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MetaShare({
  meta,
  archetypeToColor,
}: {
  meta: Record<string, number | undefined>;
  archetypeToColor: Record<string, string>;
}) {
  const total = Object.values(meta).reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
  return (
    <div className="flex flex-col gap-0.25">
      {Object.entries(meta)
        .toSorted(([, count1], [, count2]) => (count2 ?? 0) - (count1 ?? 0))
        .map(([deck, count]) => {
          const percentage = ((count ?? 0) / (total ?? 1)) * 100;
          return (
            <div key={deck} className="flex justify-between border">
              <div className="flex flex-grow gap-2">
                <div
                  className="px-2 p-0.5"
                  style={{
                    backgroundColor: archetypeToColor[deck],
                    width: `${percentage}%`,
                  }}
                />
                <span>{deck}</span>
              </div>
              <span>
                {percentage.toFixed(2)} % ({count ?? 0})
              </span>
            </div>
          );
        })}
    </div>
  );
}

function getRandomBgColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  const contrast = chroma(color).luminance() > 0.5 ? "#000" : "#FFF";
  return { backgroundColor: color, color: contrast };
}

function shortenTitle(title: string) {
  return title
    .replace("Pokémon TCG Regional Championship", "")
    .replace("Pokémon TCG International Championship", "");
}
