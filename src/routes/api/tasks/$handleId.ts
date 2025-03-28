import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { runs } from "@trigger.dev/sdk/v3";

export const APIRoute = createAPIFileRoute("/api/tasks/$handleId")({
  GET: async ({ request, params }) => {
    const result = await runs.retrieve(params.handleId);
    return json({
      status: result.status,
      taskId: result.taskIdentifier,
    });
  },
});
