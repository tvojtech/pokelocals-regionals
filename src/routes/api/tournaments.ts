import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { tasks } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { env } from "~/env";
import type { importRk9Tournament } from "~/trigger/import-rk9-tournament";

const bodySchema = z.object({
  tournamentId: z.string(),
});

export const APIRoute = createAPIFileRoute("/api/tournaments")({
  async POST({ request }) {
    const body = bodySchema.parse(await request.json());

    const handle = await tasks.trigger<typeof importRk9Tournament>(
      "import-rk9-tournament",
      {
        tournamentId: body.tournamentId,
      }
    );

    return json(
      {
        message: "Request accepted. Starting to process task.",
        runId: handle.id,
        taskId: handle.taskIdentifier,
        statusUrl: `${env.DEPLOY_URL}/api/tasks/${handle.id}`,
      },
      {
        status: 202,
      }
    );
  },
});
