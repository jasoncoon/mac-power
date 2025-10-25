import { $, serve } from "bun";
import * as plist from "plist";
import index from "./index.html";
import type { Data } from "./types";
import { errorReplacer } from "./utils";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/adapters": {
      async GET() {
        try {
          const result = await $`ioreg -ar -c AppleSmartBattery`;
          const plistString = result.text();
          const list = plist.parse(plistString) as unknown as Data[];
          return Response.json(list.at(0));
        } catch (err) {
          return new Response(JSON.stringify(err, errorReplacer()), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);

await $`open ${server.url}`;
