import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateNarrativeLines } from "../src/lib/narrative-lines";

const directory = resolve(
  process.cwd(),
  "content/domain/presentation/narratives",
);
const failures = readdirSync(directory)
  .filter((filename) => filename.endsWith(".md"))
  .flatMap((filename) => {
    const pathname = resolve(directory, filename);
    return validateNarrativeLines(readFileSync(pathname, "utf8")).map(
      ({ line, message }) => `${pathname}:${line}: ${message}`,
    );
  });

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Narrative sentence-per-line check passed.");
}
