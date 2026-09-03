import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

import { findDuplicates, unacknowledgedDuplicates } from "../../.agents/skills/research-content-proposals/scripts/check-duplicates.mjs";
import { validateProposal } from "../../.agents/skills/research-content-proposals/scripts/validate-proposal.mjs";

function validCrux(overrides = {}) {
  const url = "https://example.edu/research";
  return {
    schemaVersion: 1,
    proposalType: "crux",
    id: "coordination-costs",
    title: "Coordination costs",
    status: "draft",
    summary: "Adds a bounded comparative question.",
    sources: [{ url, title: "Study", publisher: "Example University", publishedAt: "2024", accessedAt: "2026-09-03", sourceType: "peer-reviewed", authorityNote: "Peer-reviewed empirical study.", provenance: { publisherUrl: "https://example.edu/about", identifier: "10.1/study", identifierUrl: "https://doi.org/10.1/study" } }],
    claims: [{ id: "coordination-varies", kind: "empirical", text: "Coordination costs vary by arrangement.", sourceUrls: [url], limitations: ["One measured setting."] }],
    conflictingEvidence: [{ summary: "Results differ under other conditions.", claimIds: ["coordination-varies"], sourceUrls: [url] }],
    limitations: ["The scope needs editorial review."],
    duplicateCandidates: [],
    content: { question: "How are coordination costs distributed?", scope: "Institutional coordination only.", valueLaden: false, inclusionRationale: "Not represented by an existing question." },
    ...overrides,
  };
}

function validSystem() {
  const proposal = validCrux({ proposalType: "system", id: "new-system", title: "New system" });
  proposal.claims = Array.from({ length: 14 }, (_, index) => ({ ...proposal.claims[0], id: `claim-c${String(index + 1).padStart(2, "0")}`, text: `Crux ${index + 1} has a bounded empirical finding.` }));
  proposal.conflictingEvidence[0].claimIds = [proposal.claims[0].id];
  proposal.content = {
    description: "A coherent institutional arrangement.",
    boundaries: "Excludes temporary policies.",
    cruxes: proposal.claims.map((claim, index) => ({ cruxId: `c${String(index + 1).padStart(2, "0")}`, ends: `End specific to crux ${index + 1}.`, means: `Mechanism specific to crux ${index + 1}.`, practice: `Practice specific to crux ${index + 1}.`, evidenceSummary: `Evidence limits for crux ${index + 1}.`, claimIds: [claim.id] })),
  };
  return proposal;
}

test("accepts a complete, source-linked crux proposal", () => {
  assert.deepEqual(validateProposal(validCrux(), { type: "crux", id: "coordination-costs" }), []);
});

test("rejects unsupported empirical citations and missing counterevidence", () => {
  const proposal = validCrux({ conflictingEvidence: [] });
  proposal.claims[0].sourceUrls = ["https://unlisted.example/claim"];
  const errors = validateProposal(proposal);
  assert.ok(errors.some((error) => error.includes("undeclared source URL")));
  assert.ok(errors.some((error) => error.includes("conflictingEvidence")));
});

test("requires a system proposal to cover all fourteen cruxes exactly once", () => {
  const proposal = validCrux({ proposalType: "system", content: { description: "A system.", boundaries: "A boundary.", cruxes: [] } });
  assert.ok(validateProposal(proposal).some((error) => error.includes("c01 through c14 exactly once")));
});

test("accepts distinct per-crux system claims and rejects reused generic coverage", () => {
  const proposal = validSystem();
  const context = { cruxes: new Set(Array.from({ length: 14 }, (_, index) => `c${String(index + 1).padStart(2, "0")}`)) };
  assert.deepEqual(validateProposal(proposal, {}, context), []);
  proposal.content.cruxes.forEach((item) => { item.claimIds = [proposal.claims[0].id]; });
  assert.ok(validateProposal(proposal, {}, context).some((error) => error.includes("distinct claim coverage")));
});

test("rejects cosmetically distinct IDs backed by identical claims and row narratives", () => {
  const proposal = validSystem();
  proposal.claims.forEach((claim) => { claim.text = "The same generic empirical assertion."; });
  proposal.content.cruxes.forEach((item) => {
    item.ends = "The same end.";
    item.means = "The same means.";
    item.practice = "The same practice.";
    item.evidenceSummary = "The same evidence summary.";
  });
  const context = { cruxes: new Set(Array.from({ length: 14 }, (_, index) => `c${String(index + 1).padStart(2, "0")}`)) };
  const errors = validateProposal(proposal, {}, context);
  assert.ok(errors.some((error) => error.includes("identical empirical claim text")));
  assert.ok(errors.some((error) => error.includes("identical combined narrative")));
});

test("case relationships must be canonical or explicitly proposed for review", () => {
  const proposal = validCrux({ proposalType: "case", id: "bounded-case", title: "Bounded case", content: { name: "Bounded case", dates: "2000–2005", location: "Example", summary: "Tests a mechanism.", systems: ["unknown-system"], claimIds: ["coordination-varies"] } });
  const context = { systems: new Set(["lf"]) };
  assert.ok(validateProposal(proposal, {}, context).some((error) => error.includes("unknown canonical system")));
  proposal.proposedRelationships = [{ type: "system", id: "unknown-system", reason: "Companion proposal needs review." }];
  assert.deepEqual(validateProposal(proposal, {}, context), []);
});

test("source proposals require dated publisher and identifier provenance", () => {
  const proposal = validCrux({ proposalType: "source", id: "source-record", title: "Source record", content: { authors: ["A. Author"], title: "Source record", sourceType: "book", relevance: "Supports a claim.", accessUrls: ["https://example.edu/research"] } });
  assert.deepEqual(validateProposal(proposal), []);
  delete proposal.sources[0].accessedAt;
  delete proposal.sources[0].provenance;
  const errors = validateProposal(proposal);
  assert.ok(errors.some((error) => error.includes("accessedAt")));
  assert.ok(errors.some((error) => error.includes("provenance")));
});

test("duplicate search finds canonical ID and normalized title matches deterministically", async () => {
  const root = path.join(tmpdir(), `proposal-skill-${process.pid}-${Date.now()}`);
  const proposalDir = path.join(root, "proposals", "crux", "coordination-costs");
  await mkdir(proposalDir, { recursive: true });
  await mkdir(path.join(root, "content"), { recursive: true });
  const proposal = validCrux({ aliases: ["Institutional coordination cost"], identifiers: ["urn:coordination:1"] });
  await writeFile(path.join(proposalDir, "proposal.json"), JSON.stringify(proposal));
  await writeFile(path.join(root, "content", "records.json"), JSON.stringify([
    { id: "coordination-costs", title: "Different title" },
    { id: "c96", title: "Institutional coordination cost" },
    { id: "c99", title: "Coordination Costs" },
    { id: "c98", title: "Coordination institutional costs" },
    { id: "c97", title: "Unrelated", identifiers: { catalog: "urn:coordination:1" } },
  ]));
  const candidates = await findDuplicates(proposalDir, root);
  assert.deepEqual(candidates, [
    { match: "title-or-alias", id: "c96", label: "Institutional coordination cost", file: "content/records.json" },
    { match: "identifier", id: "c97", label: "Unrelated", file: "content/records.json" },
    { match: "similar-title", id: "c98", label: "Coordination institutional costs", file: "content/records.json", similarity: 0.67 },
    { match: "title-or-alias", id: "c99", label: "Coordination Costs", file: "content/records.json" },
    { match: "id", id: "coordination-costs", label: "Different title", file: "content/records.json" },
  ]);
  assert.equal(unacknowledgedDuplicates(proposal, candidates).length, 5);
  const checker = path.resolve(".agents/skills/research-content-proposals/scripts/check-duplicates.mjs");
  const unacknowledged = spawnSync(process.execPath, [checker, proposalDir, root], { encoding: "utf8" });
  assert.equal(unacknowledged.status, 1);
  assert.match(unacknowledged.stdout, /"unacknowledged"/);
  proposal.duplicateCandidates = candidates.map((candidate) => ({ type: "crux", id: candidate.id, reason: "Requires editorial comparison." }));
  assert.deepEqual(unacknowledgedDuplicates(proposal, candidates), []);
  await writeFile(path.join(proposalDir, "proposal.json"), JSON.stringify(proposal));
  const acknowledged = spawnSync(process.execPath, [checker, proposalDir, root], { encoding: "utf8" });
  assert.equal(acknowledged.status, 0, acknowledged.stderr);
});

test("validator CLI requires the research memo and accepts the routed directory", async () => {
  const root = path.join(tmpdir(), `proposal-cli-${process.pid}-${Date.now()}`);
  const proposalDir = path.join(root, "proposals", "crux", "coordination-costs");
  await mkdir(proposalDir, { recursive: true });
  await writeFile(path.join(proposalDir, "proposal.json"), JSON.stringify(validCrux()));
  const script = path.resolve(".agents/skills/research-content-proposals/scripts/validate-proposal.mjs");
  const missingMemo = spawnSync(process.execPath, [script, proposalDir], { encoding: "utf8" });
  assert.equal(missingMemo.status, 1);
  assert.match(missingMemo.stderr, /research\.md must exist/);
  await writeFile(path.join(proposalDir, "research.md"), "# Research\n\nEvidence and limitations.\n");
  const valid = spawnSync(process.execPath, [script, proposalDir], { encoding: "utf8" });
  assert.equal(valid.status, 0, valid.stderr);
  assert.match(valid.stdout, /"valid": true/);
});
