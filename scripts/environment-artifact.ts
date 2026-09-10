import { createHash } from "node:crypto";
import { closeSync, constants, fstatSync, lstatSync, mkdirSync, openSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { outputFindings } from "./environment-dependencies.ts";

interface OpenDirectory { path: string; descriptor: number }

function assertDirectoryIdentities(directories: OpenDirectory[]) {
  for (const directory of directories) {
    const opened = fstatSync(directory.descriptor);
    const current = lstatSync(directory.path);
    if (!current.isDirectory() || current.dev !== opened.dev || current.ino !== opened.ino) throw new Error("Artifact directory changed during traversal");
  }
}

export function artifactDigest(root: string) {
  const hash = createHash("sha256");
  let files = 0;
  const visit = (path: string, relative: string, ancestors: OpenDirectory[]) => {
    // Refuse a final-component symlink atomically, then inspect and read the
    // same open object. A path replacement cannot redirect the content read.
    // NONBLOCK prevents an unexpected FIFO from blocking before fstat rejects it.
    const descriptor = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
    try {
      const stat = fstatSync(descriptor);
      assertDirectoryIdentities(ancestors);
      if (stat.isDirectory()) {
        const directories = [...ancestors, { path, descriptor }];
        assertDirectoryIdentities(directories);
        const prefix = relative ? `${relative}/` : "";
        for (const entry of readdirSync(path).sort()) {
          assertDirectoryIdentities(directories);
          visit(join(path, entry), `${prefix}${entry}`, directories);
        }
        assertDirectoryIdentities(directories);
      } else if (stat.isFile() && relative) {
        const contents = readFileSync(descriptor);
        assertDirectoryIdentities(ancestors);
        hash.update(relative).update("\0").update(contents).update("\0");
        files++;
      } else throw new Error("Unsupported artifact entry");
    } finally { closeSync(descriptor); }
  };
  visit(join(root, "dist"), "", []);
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
