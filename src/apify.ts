import { env } from "~/env";
import { ApifyClient } from "apify-client";

const client = new ApifyClient({
  token: env.APIFY_TOKEN,
});

export { client as apify };
