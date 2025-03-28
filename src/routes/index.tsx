import chroma from "chroma-js";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: async () => {
    return (await import("./../../data/metashare.json")).default;
  },
  component: Component,
});

function Component() {
  const data = Route.useLoaderData();

  return (
    <div className="flex flex-col gap-12">
      {data.map(({ tournament, meta }) => (
        <div key={tournament.url}>
          <h1 className="text-2xl font-bold mb-4">{tournament.title}</h1>
          <div className="flex gap-12 flex-wrap">
            <div className="w-full max-w-[400px]">
              <h2 className="text-xl font-bold mb-2">Juniors</h2>
              <MetaShare meta={meta.juniors} />
            </div>
            <div className="w-full max-w-[400px]">
              <h2 className="text-xl font-bold mb-2">Seniors</h2>
              <MetaShare meta={meta.seniors} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MetaShare({ meta }: { meta: Record<string, number | undefined> }) {
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
                    ...getRandomBgColor(),
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
