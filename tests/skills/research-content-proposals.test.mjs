import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { findDuplicates, unacknowledgedDuplicates } from "../../.agents/skills/research-content-proposals/scripts/check-duplicates.mjs";
import { validateProposal } from "../../.agents/skills/research-content-proposals/scripts/validate-proposal.mjs";

const sourceUrl = "https://example.edu/research";
function base(type, content, overrides = {}) {
  return {
    schemaVersion: 2, proposalType: type, id: `new-${type}`, title: `New ${type}`, status: "draft", summary: "A bounded addition.",
    sources: [{ url: sourceUrl, title: "Study", publisher: "Example University", publishedAt: "2024", accessedAt: "2026-09-03", sourceType: "peer-reviewed", authorityNote: "Peer-reviewed work.", provenance: { publisherUrl: "https://example.edu/about", identifier: "10.1/study", identifierUrl: "https://doi.org/10.1/study" } }],
    claims: [{ id: "bounded-finding", kind: "empirical", text: "A bounded finding.", sourceUrls: [sourceUrl], limitations: ["One setting."] }],
    conflictingEvidence: [{ summary: "The result varies under other conditions.", claimIds: ["bounded-finding"], sourceUrls: [sourceUrl] }],
    limitations: ["Needs editorial review."], duplicateCandidates: [], content, ...overrides,
  };
}
const contents = {
  tradition: { description: "A family of institutional arguments.", scope: "A bounded tradition.", variants: ["Variant A"], distinctions: ["Not a country."], commonQuestions: ["Is it uniform? No."] },
  end: { description: "A valued outcome.", scope: "A bounded value.", tensions: [], attributions: [{ holder: "Named author", context: "A named text.", claimIds: ["bounded-finding"] }] },
  means: { description: "An arrangement.", institutionalForm: "A formal rule.", actors: ["Members"], decisionRules: "Members vote.", enforcement: "Review process.", conditions: ["Participation"], failureModes: ["Capture"] },
  topic: { description: "A navigation area.", scope: "Institutional questions.", inclusions: ["Rules"], exclusions: ["Verdicts"] },
  challenge: { question: "How is authority constrained?", scope: "Formal and informal constraints.", inclusionRationale: "A recurring comparative question." },
  criterion: { definition: "A stated evaluation lens.", normativeAssumptions: ["Accountability matters."], evidenceRequirements: ["Auditable records."], limitations: ["Weights are contested."] },
  statement: { statementKind: "causal-hypothesis", text: "A rule may change incentives.", claimIds: ["bounded-finding"], interpretationStatus: "contested", rationale: "The mechanism is plausible.", rivalInterpretations: ["Selection effects."], conditions: ["Stable enforcement."] },
  source: { authors: ["A. Author"], title: "Study", sourceType: "article", relevance: "Supports bounded-finding.", accessUrls: [sourceUrl] },
  case: { name: "Bounded episode", startDate: "2000", endDate: "2005", location: "Example", scope: "One reform period.", selectionRationale: "Tests the mechanism.", conditions: ["Condition"], outcomes: ["Outcome"], claimIds: ["bounded-finding"], rivalExplanations: ["Selection"], transferLimitations: ["One jurisdiction"] },
};

test("accepts all replacement-ontology proposal types without matrix coverage", () => {
  for (const [type, content] of Object.entries(contents)) assert.deepEqual(validateProposal(base(type, content), { type, id: `new-${type}` }), [], type);
});
test("Ends require attribution and Challenges remain questions", () => {
  const end = base("end", { ...contents.end, attributions: [] });
  assert.ok(validateProposal(end).some((e) => e.includes("require attribution")));
  const challenge = base("challenge", { ...contents.challenge, question: "Authority constraints" });
  assert.ok(validateProposal(challenge).some((e) => e.includes("end in ?")));
});
test("interpretations expose rationale, rivals, and conditions", () => {
  const proposal = base("statement", { ...contents.statement, rationale: "", rivalInterpretations: [], conditions: [] });
  const errors = validateProposal(proposal);
  assert.ok(errors.some((e) => e.includes("rationale")) && errors.some((e) => e.includes("rivalInterpretations")) && errors.some((e) => e.includes("conditions")));
});
test("canonical and proposed relationships are distinguished", () => {
  const proposal = base("means", contents.means, { relationships: [{ type: "challenge", id: "known-challenge", reason: "It addresses this question." }] });
  assert.deepEqual(validateProposal(proposal, {}, { challenge: new Set(["known-challenge"]) }), []);
  proposal.relationships[0].id = "unknown-challenge";
  assert.ok(validateProposal(proposal, {}, { challenge: new Set(["known-challenge"]) }).some((e) => e.includes("use proposedRelationships")));
});
test("claims preserve provenance, attribution, conflicts, and limitations", () => {
  const proposal = base("end", contents.end);
  proposal.claims[0] = { id: "stated-value", kind: "attributed-value", holder: "Named author", text: "The author values participation.", sourceUrls: [sourceUrl], limitations: ["One text."] };
  proposal.content.attributions[0].claimIds = ["stated-value"];
  proposal.conflictingEvidence[0].claimIds = ["stated-value"];
  assert.deepEqual(validateProposal(proposal), []);
  delete proposal.sources[0].provenance;
  assert.ok(validateProposal(proposal).some((e) => e.includes("publisherUrl")));
});
test("duplicate search uses the framework and proposals, not retired generated content", async () => {
  const root = path.join(tmpdir(), `proposal-skill-${process.pid}-${Date.now()}`);
  const dir = path.join(root, "proposals", "topic", "new-topic");
  await mkdir(dir, { recursive: true }); await mkdir(path.join(root, "content", "framework"), { recursive: true }); await mkdir(path.join(root, "generated", "content"), { recursive: true });
  const proposal = base("topic", contents.topic); await writeFile(path.join(dir, "proposal.json"), JSON.stringify(proposal));
  await writeFile(path.join(root, "content", "framework", "draft.json"), JSON.stringify({ topics: [{ id: "existing-topic", label: "New topic" }] }));
  await writeFile(path.join(root, "generated", "content", "old.json"), JSON.stringify([{ id: "retired-record", title: "New topic" }]));
  const found = await findDuplicates(dir, root);
  assert.deepEqual(found.map((x) => x.id), ["existing-topic"]); assert.equal(unacknowledgedDuplicates(proposal, found).length, 1);
});
test("validator CLI requires the research memo and accepts routed directories", async () => {
  const root = path.join(tmpdir(), `proposal-cli-${process.pid}-${Date.now()}`), dir = path.join(root, "proposals", "topic", "new-topic");
  await mkdir(dir, { recursive: true }); await mkdir(path.join(root, "content", "framework"), { recursive: true });
  await writeFile(path.join(root, "content", "framework", "draft.json"), JSON.stringify({ topics: [] })); await writeFile(path.join(dir, "proposal.json"), JSON.stringify(base("topic", contents.topic)));
  const script = path.resolve(".agents/skills/research-content-proposals/scripts/validate-proposal.mjs");
  let result = spawnSync(process.execPath, [script, dir], { cwd: root, encoding: "utf8" }); assert.equal(result.status, 1); assert.match(result.stderr, /research\.md must exist/);
  await writeFile(path.join(dir, "research.md"), "# Research\n\nEvidence and limitations.\n"); result = spawnSync(process.execPath, [script, dir], { cwd: root, encoding: "utf8" }); assert.equal(result.status, 0, result.stderr);
});
