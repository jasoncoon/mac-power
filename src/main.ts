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
          console.log("\nPress return or enter to exit\n");
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

  development: {
    // Enable browser hot reloading in development
    hmr: process.env.NODE_ENV !== "production",

    // Echo console logs from the browser to the server
    console: false,
  },
});

console.log(`🚀 Server running at ${server.url}`);

await $`open ${server.url}`;

console.log("\nPress return or enter to exit\n");

process.stdin.on("readable", () => {
  if (process.stdin.read() !== null) {
    process.exit();
  }
});
