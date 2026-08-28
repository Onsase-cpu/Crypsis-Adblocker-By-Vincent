import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(root, "extension", "manifest.json"), "utf8"));
const rules = JSON.parse(await readFile(path.join(root, "extension", "rules", "core-rules.json"), "utf8"));

if (manifest.manifest_version !== 3) throw new Error("Manifest V3 is required.");
if (!Array.isArray(manifest.permissions) || !manifest.permissions.includes("declarativeNetRequest")) throw new Error("DNR permission is missing.");
if (!Array.isArray(rules) || rules.length === 0) throw new Error("The static rules list is empty.");
for (const [index, rule] of rules.entries()) {
  if (rule.id !== index + 1 || rule.action?.type !== "block" || !rule.condition?.urlFilter?.startsWith("||")) {
    throw new Error(`Invalid static rule at position ${index + 1}.`);
  }
}
console.log(`Manifest V3 verified; ${rules.length} static DNR rules validated.`);
