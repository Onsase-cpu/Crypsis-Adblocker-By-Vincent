import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const domains = (await readFile(path.join(root, "filters", "core-domains.txt"), "utf8")).split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#")).map((line) => line.split("/", 1)[0]);
await mkdir(path.join(root, "android", "app", "src", "main", "assets"), { recursive: true });
await writeFile(path.join(root, "android", "app", "src", "main", "assets", "blocklist.txt"), "# Crypsis Android in-app browser list\n" + [...new Set(domains)].join("\n") + "\n");
console.log("Android browser filter list refreshed from the shared source.");

