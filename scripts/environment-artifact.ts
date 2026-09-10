import { createHash } from "node:crypto";
import { lstatSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { outputFindings } from "./environment-dependencies.ts";

export function artifactDigest(root: string) {
  const hash = createHash("sha256");
  let files = 0;
  const visit = (directory: string, prefix: string) => {
    for (const entry of readdirSync(directory).sort()) {
      const path = join(directory, entry);
      const relative = `${prefix}${entry}`;
      const stat = lstatSync(path);
      if (stat.isSymbolicLink()) throw new Error("Redirected artifact");
      if (stat.isDirectory()) visit(path, `${relative}/`);
      else if (stat.isFile()) { hash.update(relative).update("\0").update(readFileSync(path)).update("\0"); files++; }
      else throw new Error("Unsupported artifact entry");
    }
  };
  if (lstatSync(join(root, "dist")).isSymbolicLink()) throw new Error("Redirected artifact");
  visit(join(root, "dist"), "");
  if (!files) throw new Error("Empty artifact");
  return { directory: "dist", sha256: hash.digest("hex"), files };
}

export function writeVerificationEvidence(root: string, evidence: unknown) {
  if (outputFindings(root).length) throw new Error("Output ownership");
  const directory = join(root, ".artifacts", "environment");
  mkdirSync(directory, { recursive: true });
  if (lstatSync(directory).isSymbolicLink()) throw new Error("Redirected evidence");
  // Exclusive creation avoids overwriting earlier evidence or following a file link.
  const path = join(directory, `verified-${Date.now()}.json`);
  writeFileSync(path, `${JSON.stringify(evidence, null, 2)}\n`, { flag: "wx", mode: 0o600 });
}
