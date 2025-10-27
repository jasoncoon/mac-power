import { $, serve } from "bun";
import * as plist from "plist";
import index from "./index.html";
import { errorReplacer } from "./utils";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/power": {
      async GET() {
        try {
          const result = await $`ioreg -ar -c AppleSmartBattery`;
          const plistString = result.text();
          const list = plist.parse(plistString) as unknown as [];
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

    "/api/system/software": {
      async GET() {
        try {
          const items = await getSystemProfilerData("SPSoftwareDataType", [
            "Software:",
            "System Software Overview:",
          ]);
          console.log("\nPress return or enter to exit\n");
          return Response.json(items);
        } catch (err) {
          return new Response(JSON.stringify(err, errorReplacer()), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },

    "/api/system/hardware": {
      async GET() {
        try {
          const items = await getSystemProfilerData("SPHardwareDataType", [
            "Hardware:",
            "Hardware Overview:",
          ]);
          console.log("\nPress return or enter to exit\n");
          return Response.json(items);
        } catch (err) {
          return new Response(JSON.stringify(err, errorReplacer()), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },

    "/api/system/power": {
      async GET() {
        try {
          const items = await getSystemProfilerData("SPPowerDataType", [
            "Power:",
          ]);
          console.log("\nPress return or enter to exit\n");
          return Response.json(items);
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

async function getSystemProfilerData(dataType: string, filterLines?: string[]) {
  const result = await $`system_profiler ${dataType} `;
  const lines = result
    .text()
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => !!l && !(filterLines ?? []).includes(l));
  const items = lines.map((l) => {
    const [label, value] = l.split(":");
    return { label, value };
  });
  return items;
}
