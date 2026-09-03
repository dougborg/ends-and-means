#!/usr/bin/env node
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const TYPES = new Set(["tradition", "end", "means", "topic", "challenge", "criterion", "statement", "source", "case"]);
const SOURCE_TYPES = new Set(["primary", "official", "peer-reviewed", "academic-book", "reputable-secondary"]);
const CLAIM_KINDS = new Set(["empirical", "attributed-value", "editorial-interpretation"]);
const STATEMENT_KINDS = new Set(["empirical-claim", "attributed-value", "causal-hypothesis", "editorial-interpretation"]);
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isArray = Array.isArray;
const text = (v) => typeof v === "string" && v.trim().length > 0;
const url = (v) => { try { return text(v) && ["http:", "https:"].includes(new URL(v).protocol); } catch { return false; } };
const needText = (e, v, f) => { if (!text(v)) e.push(`${f} must be a non-empty string`); };
const needTexts = (e, v, f, empty = false) => { if (!isArray(v) || (!empty && !v.length) || v.some((x) => !text(x))) e.push(`${f} must be ${empty ? "an" : "a non-empty"} array of non-empty strings`); };
const needClaims = (e, v, ids, f, empty = false) => {
  if (!isArray(v) || (!empty && !v.length)) e.push(`${f} must be ${empty ? "an" : "a non-empty"} array`);
  else v.forEach((id) => { if (!ids.has(id)) e.push(`${f} references unknown claim: ${id}`); });
};

function relationships(p, e, context) {
  const proposed = new Set();
  for (const field of ["relationships", "proposedRelationships"]) {
    if (p[field] !== undefined && !isArray(p[field])) { e.push(`${field} must be an array`); continue; }
    for (const [i, item] of (p[field] ?? []).entries()) {
      if (!TYPES.has(item?.type)) e.push(`${field}[${i}].type is invalid`);
      if (!ID.test(item?.id ?? "")) e.push(`${field}[${i}].id must be semantic lowercase kebab-case`);
      needText(e, item?.reason, `${field}[${i}].reason`);
      const key = `${item?.type}:${item?.id}`;
      if (field === "proposedRelationships") proposed.add(key);
      else if (context?.[item?.type] instanceof Set && !context[item.type].has(item.id)) e.push(`${field}[${i}] references unknown canonical ${item.type} '${item.id}'; use proposedRelationships for human review`);
    }
  }
  if ((p.relationships ?? []).some((x) => proposed.has(`${x?.type}:${x?.id}`))) e.push("the same relationship cannot be both canonical and proposed");
}

function content(p, e, ids) {
  const c = p.content, t = p.proposalType;
  if (!c || typeof c !== "object" || isArray(c)) { e.push("content must be an object"); return; }
  if (t === "tradition") {
    ["description", "scope"].forEach((f) => needText(e, c[f], `content.${f}`));
    ["variants", "distinctions", "commonQuestions"].forEach((f) => needTexts(e, c[f], `content.${f}`));
  } else if (t === "end") {
    ["description", "scope"].forEach((f) => needText(e, c[f], `content.${f}`)); needTexts(e, c.tensions, "content.tensions", true);
    if (!isArray(c.attributions) || !c.attributions.length) e.push("content.attributions must be non-empty; Ends require attribution");
    else c.attributions.forEach((a, i) => { needText(e, a?.holder, `content.attributions[${i}].holder`); needText(e, a?.context, `content.attributions[${i}].context`); needClaims(e, a?.claimIds, ids, `content.attributions[${i}].claimIds`); });
  } else if (t === "means") {
    ["description", "institutionalForm", "decisionRules", "enforcement"].forEach((f) => needText(e, c[f], `content.${f}`));
    ["actors", "conditions", "failureModes"].forEach((f) => needTexts(e, c[f], `content.${f}`));
  } else if (t === "topic") {
    ["description", "scope"].forEach((f) => needText(e, c[f], `content.${f}`)); ["inclusions", "exclusions"].forEach((f) => needTexts(e, c[f], `content.${f}`));
  } else if (t === "challenge") {
    ["question", "scope", "inclusionRationale"].forEach((f) => needText(e, c[f], `content.${f}`)); if (text(c.question) && !c.question.trim().endsWith("?")) e.push("content.question must end in ?");
  } else if (t === "criterion") {
    needText(e, c.definition, "content.definition"); ["normativeAssumptions", "evidenceRequirements", "limitations"].forEach((f) => needTexts(e, c[f], `content.${f}`));
  } else if (t === "statement") {
    if (!STATEMENT_KINDS.has(c.statementKind)) e.push("content.statementKind is invalid"); needText(e, c.text, "content.text"); needText(e, c.interpretationStatus, "content.interpretationStatus"); needClaims(e, c.claimIds, ids, "content.claimIds");
    if (["causal-hypothesis", "editorial-interpretation"].includes(c.statementKind)) { needText(e, c.rationale, "content.rationale"); needTexts(e, c.rivalInterpretations, "content.rivalInterpretations"); needTexts(e, c.conditions, "content.conditions"); }
  } else if (t === "source") {
    needTexts(e, c.authors, "content.authors"); ["title", "sourceType", "relevance"].forEach((f) => needText(e, c[f], `content.${f}`)); if (!isArray(c.accessUrls) || !c.accessUrls.length || c.accessUrls.some((x) => !url(x))) e.push("content.accessUrls must contain valid HTTP(S) URLs");
  } else if (t === "case") {
    ["name", "startDate", "endDate", "location", "scope", "selectionRationale"].forEach((f) => needText(e, c[f], `content.${f}`));
    ["conditions", "outcomes", "rivalExplanations", "transferLimitations"].forEach((f) => needTexts(e, c[f], `content.${f}`)); needClaims(e, c.claimIds, ids, "content.claimIds");
  }
}

export function validateProposal(p, expected = {}, context) {
  const e = [];
  if (!p || typeof p !== "object" || isArray(p)) return ["proposal must be a JSON object"];
  if (p.schemaVersion !== 2) e.push("schemaVersion must equal 2");
  if (!TYPES.has(p.proposalType)) e.push(`proposalType must be one of: ${[...TYPES].join(", ")}`);
  if (!ID.test(p.id ?? "")) e.push("id must be semantic lowercase kebab-case");
  if (expected.scope && expected.scope !== "proposals") e.push("proposal must be under proposals/<type>/<stable-id>");
  if (expected.type && p.proposalType !== expected.type) e.push(`proposalType must match directory type ${expected.type}`);
  if (expected.id && p.id !== expected.id) e.push(`id must match directory ID ${expected.id}`);
  needText(e, p.title, "title"); needText(e, p.summary, "summary"); if (p.status !== "draft") e.push("status must equal draft");
  ["aliases", "identifiers"].forEach((f) => { if (p[f] !== undefined) needTexts(e, p[f], f, true); });
  const sourceUrls = new Set();
  if (!isArray(p.sources) || !p.sources.length) e.push("sources must contain at least one authoritative source");
  else p.sources.forEach((s, i) => {
    ["url", "title", "publisher", "publishedAt", "accessedAt", "authorityNote"].forEach((f) => needText(e, s?.[f], `sources[${i}].${f}`));
    if (!url(s?.url)) e.push(`sources[${i}].url must be HTTP(S)`); else sourceUrls.add(s.url);
    if (!SOURCE_TYPES.has(s?.sourceType)) e.push(`sources[${i}].sourceType is not authoritative`);
    if (text(s?.publishedAt) && !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(s.publishedAt)) e.push(`sources[${i}].publishedAt must be YYYY, YYYY-MM, or YYYY-MM-DD`);
    if (text(s?.accessedAt) && !/^\d{4}-\d{2}-\d{2}$/.test(s.accessedAt)) e.push(`sources[${i}].accessedAt must be YYYY-MM-DD`);
    if (!s?.provenance || typeof s.provenance !== "object" || !url(s.provenance.publisherUrl)) e.push(`sources[${i}].provenance must include a publisherUrl`);
    if (s?.provenance?.identifier !== undefined && (!text(s.provenance.identifier) || !url(s.provenance.identifierUrl))) e.push(`sources[${i}].provenance identifier must have a verification URL`);
  });
  const ids = new Set();
  if (!isArray(p.claims) || !p.claims.length) e.push("claims must contain at least one claim");
  else p.claims.forEach((c, i) => {
    if (!ID.test(c?.id ?? "")) e.push(`claims[${i}].id must be lowercase kebab-case`); else if (ids.has(c.id)) e.push(`duplicate claim ID: ${c.id}`); else ids.add(c.id);
    needText(e, c?.text, `claims[${i}].text`); needTexts(e, c?.limitations, `claims[${i}].limitations`); if (!CLAIM_KINDS.has(c?.kind)) e.push(`claims[${i}].kind is invalid`);
    if (["empirical", "attributed-value"].includes(c?.kind)) { if (!isArray(c.sourceUrls) || !c.sourceUrls.length) e.push(`${c.kind} claim ${c.id ?? i} must cite sourceUrls`); else c.sourceUrls.forEach((u) => { if (!sourceUrls.has(u)) e.push(`claim ${c.id ?? i} cites undeclared source URL: ${u}`); }); }
    if (c?.kind === "attributed-value") needText(e, c.holder, `claims[${i}].holder`); if (c?.kind === "editorial-interpretation") needText(e, c.rationale, `claims[${i}].rationale`);
  });
  if (!isArray(p.conflictingEvidence) || !p.conflictingEvidence.length) e.push("conflictingEvidence must be non-empty");
  else p.conflictingEvidence.forEach((x, i) => { needText(e, x?.summary, `conflictingEvidence[${i}].summary`); needClaims(e, x?.claimIds, ids, `conflictingEvidence[${i}].claimIds`, true); if (!isArray(x?.sourceUrls)) e.push(`conflictingEvidence[${i}].sourceUrls must be an array`); else x.sourceUrls.forEach((u) => { if (!sourceUrls.has(u)) e.push(`conflictingEvidence cites undeclared source URL: ${u}`); }); });
  needTexts(e, p.limitations, "limitations");
  if (!isArray(p.duplicateCandidates)) e.push("duplicateCandidates must be an array"); else p.duplicateCandidates.forEach((x, i) => { if (!TYPES.has(x?.type)) e.push(`duplicateCandidates[${i}].type is invalid`); if (!ID.test(x?.id ?? "")) e.push(`duplicateCandidates[${i}].id must be lowercase kebab-case`); needText(e, x?.reason, `duplicateCandidates[${i}].reason`); });
  relationships(p, e, context); if (TYPES.has(p.proposalType)) content(p, e, ids); return e;
}

async function canonicalContext(root) {
  try { const graph = JSON.parse(await readFile(path.join(root, "content/framework/draft.json"), "utf8")); const keys = { tradition: "traditions", topic: "topics", challenge: "challenges", criterion: "criteria", source: "sources" }; return Object.fromEntries([...TYPES].map((t) => [t, new Set((graph[keys[t]] ?? []).map((x) => x.id))])); } catch { return undefined; }
}
export async function loadProposal(target) { const resolved = path.resolve(target); const file = (await stat(resolved)).isDirectory() ? path.join(resolved, "proposal.json") : resolved; const parts = path.dirname(file).split(path.sep); return { file, proposal: JSON.parse(await readFile(file, "utf8")), expected: { scope: parts.at(-3), type: parts.at(-2), id: parts.at(-1) } }; }
async function main() {
  const target = process.argv[2]; if (!target) { console.error("Usage: validate-proposal.mjs <proposal-directory-or-json>"); process.exitCode = 2; return; }
  try { const { file, proposal, expected } = await loadProposal(target); const repositoryRoot = path.resolve(path.dirname(file), "../../.."); const context = await canonicalContext(repositoryRoot); const errors = validateProposal(proposal, expected, context); if (!context) errors.push("framework draft unavailable; run npm run validate before validating relationships"); const { findDuplicates, unacknowledgedDuplicates } = await import("./check-duplicates.mjs"); const unacknowledged = unacknowledgedDuplicates(proposal, await findDuplicates(file, repositoryRoot)); if (unacknowledged.length) errors.push(`duplicateCandidates must acknowledge detected IDs: ${unacknowledged.map((x) => x.id).join(", ")}`); try { if (!text(await readFile(path.join(path.dirname(file), "research.md"), "utf8"))) errors.push("research.md must be non-empty"); } catch { errors.push("research.md must exist beside proposal.json"); } if (errors.length) { console.error(JSON.stringify({ valid: false, file, errors }, null, 2)); process.exitCode = 1; } else console.log(JSON.stringify({ valid: true, file, id: proposal.id, proposalType: proposal.proposalType }, null, 2)); } catch (error) { console.error(JSON.stringify({ valid: false, errors: [error instanceof Error ? error.message : String(error)] }, null, 2)); process.exitCode = 1; }
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main();
