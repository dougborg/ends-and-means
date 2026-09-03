import assert from "node:assert/strict";
import test from "node:test";

import { proposalDirectories, validateDirectory } from "../../scripts/validate-proposals.mjs";

test("missing proposal directory is treated as an empty proposal set", async () => {
  const directories = await proposalDirectories("/missing", async () => {
    const error = new Error("missing");
    error.code = "ENOENT";
    throw error;
  });

  assert.deepEqual(directories, []);
});

test("proposal directory read failures other than ENOENT are surfaced", async () => {
  await assert.rejects(
    proposalDirectories("/unreadable", async () => {
      const error = new Error("permission denied");
      error.code = "EACCES";
      throw error;
    }),
    { code: "EACCES" },
  );
});

test("validator launch failures fail validation", () => {
  const launchError = new Error("spawn failed");
  const originalError = console.error;
  let reported = "";
  console.error = (message) => { reported = message; };

  try {
    assert.equal(validateDirectory("/proposal", () => ({ error: launchError, status: null })), false);
  } finally {
    console.error = originalError;
  }

  assert.match(reported, /Could not start proposal validator: spawn failed/);
});
