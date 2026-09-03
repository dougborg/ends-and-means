#!/usr/bin/env node

import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const TYPES = new Set(["crux", "system", "source", "case"]);
const SOURCE_TYPES = new Set(["primary", "official", "peer-reviewed", "academic-book", "reputable-secondary"]);
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CRUX_IDS = Array.from({ length: 14 }, (_, index) => `c${String(index + 1).padStart(2, "0")}`);
const hasText = (value) => typeof value === "string" && value.trim().length > 0;
const isArray = Array.isArray;
const normalizeText = (value) => String(value ?? "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
const DATE_PATTERN = /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/;

function validUrl(value) {
  if (!hasText(value)) return false;
  try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
}

function requireText(errors, value, field) {
  if (!hasText(value)) errors.push(`${field} must be a non-empty string`);
}

function validateRelationships(proposal, errors, context) {
  const proposed = new Set();
  if (proposal.proposedRelationships !== undefined && !isArray(proposal.proposedRelationships)) errors.push("proposedRelationships must be an array");
  else for (const [index, item] of (proposal.proposedRelationships ?? []).entries()) {
    if (!["system", "crux", "source", "case"].includes(item?.type)) errors.push(`proposedRelationships[${index}].type is invalid`);
    if (!ID_PATTERN.test(item?.id ?? "")) errors.push(`proposedRelationships[${index}].id must be lowercase kebab-case`);
    requireText(errors, item?.reason, `proposedRelationships[${index}].reason`);
    proposed.add(`${item?.type}:${item?.id}`);
  }
  const requireKnown = (type, id, field) => {
    const known = context?.[`${type}s`];
    if (known instanceof Set && !known.has(id) && !proposed.has(`${type}:${id}`)) errors.push(`${field} references unknown canonical ${type} '${id}'; declare it in proposedRelationships for human review`);
  };
  if (proposal.proposalType === "case" && isArray(proposal.content?.systems)) proposal.content.systems.forEach((id, index) => requireKnown("system", id, `content.systems[${index}]`));
  if (proposal.proposalType === "system" && isArray(proposal.content?.cruxes)) proposal.content.cruxes.forEach((item, index) => requireKnown("crux", item?.cruxId, `content.cruxes[${index}].cruxId`));
}

function validateContent(proposal, errors, claimIds, context) {
  const content = proposal.content;
  if (!content || typeof content !== "object" || isArray(content)) {
    errors.push("content must be an object");
    return;
  }
  if (proposal.proposalType === "crux") {
    requireText(errors, content.question, "content.question");
    if (hasText(content.question) && !content.question.trim().endsWith("?")) errors.push("content.question must end in ?");
    requireText(errors, content.scope, "content.scope");
    requireText(errors, content.inclusionRationale, "content.inclusionRationale");
    if (typeof content.valueLaden !== "boolean") errors.push("content.valueLaden must be boolean");
  }
  if (proposal.proposalType === "system") {
    requireText(errors, content.description, "content.description");
    requireText(errors, content.boundaries, "content.boundaries");
    if (!isArray(content.cruxes)) errors.push("content.cruxes must be an array covering c01 through c14");
    else {
      const ids = content.cruxes.map((item) => item?.cruxId);
      if (content.cruxes.length !== 14 || new Set(ids).size !== 14 || CRUX_IDS.some((id) => !ids.includes(id))) errors.push("content.cruxes must contain each of c01 through c14 exactly once");
      content.cruxes.forEach((item, index) => {
        for (const field of ["cruxId", "ends", "means", "practice", "evidenceSummary"]) requireText(errors, item?.[field], `content.cruxes[${index}].${field}`);
        if (!isArray(item?.claimIds) || item.claimIds.length === 0) errors.push(`content.cruxes[${index}].claimIds must contain at least one bounded claim`);
        else for (const id of item.claimIds) if (!claimIds.has(id)) errors.push(`content.cruxes[${index}] references unknown claim: ${id}`);
      });
      const usedClaims = content.cruxes.flatMap((item) => isArray(item?.claimIds) ? item.claimIds : []);
      if (new Set(usedClaims).size < content.cruxes.length) errors.push("each system crux must have distinct claim coverage; do not reuse one claim across the matrix");
      const claimById = new Map((proposal.claims ?? []).map((claim) => [claim.id, claim]));
      const empiricalTextOwners = new Map();
      const narrativeOwners = new Map();
      content.cruxes.forEach((item) => {
        for (const id of item?.claimIds ?? []) {
          const claim = claimById.get(id);
          if (claim?.kind !== "empirical") continue;
          const normalized = normalizeText(claim.text);
          const previous = empiricalTextOwners.get(normalized);
          if (normalized && previous && previous !== item.cruxId) errors.push(`system cruxes ${previous} and ${item.cruxId} reuse identical empirical claim text`);
          else if (normalized) empiricalTextOwners.set(normalized, item.cruxId);
        }
        const narrative = normalizeText([item?.ends, item?.means, item?.practice, item?.evidenceSummary].join(" "));
        const previous = narrativeOwners.get(narrative);
        if (narrative && previous && previous !== item?.cruxId) errors.push(`system cruxes ${previous} and ${item?.cruxId} reuse an identical combined narrative`);
        else if (narrative) narrativeOwners.set(narrative, item?.cruxId);
      });
    }
  }
  if (proposal.proposalType === "source") {
    if (!isArray(content.authors) || content.authors.length === 0 || content.authors.some((v) => !hasText(v))) errors.push("content.authors must contain at least one author");
    for (const field of ["title", "sourceType", "relevance"]) requireText(errors, content[field], `content.${field}`);
    if (!isArray(content.accessUrls) || content.accessUrls.length === 0 || content.accessUrls.some((v) => !validUrl(v))) errors.push("content.accessUrls must contain valid HTTP(S) URLs");
  }
  if (proposal.proposalType === "case") {
    for (const field of ["name", "dates", "location", "summary"]) requireText(errors, content[field], `content.${field}`);
    if (!isArray(content.systems) || content.systems.length === 0 || content.systems.some((v) => !hasText(v))) errors.push("content.systems must contain at least one system ID");
    if (!isArray(content.claimIds)) errors.push("content.claimIds must be an array");
    else for (const id of content.claimIds) if (!claimIds.has(id)) errors.push(`content.claimIds references unknown claim: ${id}`);
  }
  validateRelationships(proposal, errors, context);
}

export function validateProposal(proposal, expected = {}, context = undefined) {
  const errors = [];
  if (!proposal || typeof proposal !== "object" || isArray(proposal)) return ["proposal must be a JSON object"];
  if (proposal.schemaVersion !== 1) errors.push("schemaVersion must equal 1");
  if (!TYPES.has(proposal.proposalType)) errors.push("proposalType must be crux, system, source, or case");
  if (!ID_PATTERN.test(proposal.id ?? "")) errors.push("id must be lowercase kebab-case");
  if (expected.scope && expected.scope !== "proposals") errors.push("proposal must be under proposals/<type>/<stable-id>");
  if (expected.type && proposal.proposalType !== expected.type) errors.push(`proposalType must match directory type ${expected.type}`);
  if (expected.id && proposal.id !== expected.id) errors.push(`id must match directory ID ${expected.id}`);
  requireText(errors, proposal.title, "title");
  requireText(errors, proposal.summary, "summary");
  if (proposal.status !== "draft") errors.push("status must equal draft");
  for (const field of ["aliases", "identifiers"]) if (proposal[field] !== undefined && (!isArray(proposal[field]) || proposal[field].some((v) => !hasText(v)))) errors.push(`${field} must be an array of non-empty strings`);

  const sourceUrls = new Set();
  if (!isArray(proposal.sources) || proposal.sources.length === 0) errors.push("sources must contain at least one authoritative source");
  else proposal.sources.forEach((source, index) => {
    for (const field of ["url", "title", "publisher", "publishedAt", "accessedAt", "authorityNote"]) requireText(errors, source?.[field], `sources[${index}].${field}`);
    if (!validUrl(source?.url)) errors.push(`sources[${index}].url must be HTTP(S)`);
    else sourceUrls.add(source.url);
    if (!SOURCE_TYPES.has(source?.sourceType)) errors.push(`sources[${index}].sourceType is not authoritative`);
    if (hasText(source?.publishedAt) && !DATE_PATTERN.test(source.publishedAt)) errors.push(`sources[${index}].publishedAt must be YYYY, YYYY-MM, or YYYY-MM-DD`);
    if (hasText(source?.accessedAt) && !/^\d{4}-\d{2}-\d{2}$/.test(source.accessedAt)) errors.push(`sources[${index}].accessedAt must be YYYY-MM-DD`);
    if (!source?.provenance || typeof source.provenance !== "object") errors.push(`sources[${index}].provenance must identify publisher or identifier provenance`);
    else {
      if (!validUrl(source.provenance.publisherUrl)) errors.push(`sources[${index}].provenance.publisherUrl must be HTTP(S)`);
      if (source.provenance.identifier !== undefined && !hasText(source.provenance.identifier)) errors.push(`sources[${index}].provenance.identifier must be non-empty`);
      if (source.provenance.identifier !== undefined && !validUrl(source.provenance.identifierUrl)) errors.push(`sources[${index}].provenance.identifierUrl must verify the identifier`);
    }
  });

  const claimIds = new Set();
  if (!isArray(proposal.claims) || proposal.claims.length === 0) errors.push("claims must contain at least one claim");
  else proposal.claims.forEach((claim, index) => {
    if (!ID_PATTERN.test(claim?.id ?? "")) errors.push(`claims[${index}].id must be lowercase kebab-case`);
    else if (claimIds.has(claim.id)) errors.push(`duplicate claim ID: ${claim.id}`);
    else claimIds.add(claim.id);
    requireText(errors, claim?.text, `claims[${index}].text`);
    if (!isArray(claim?.limitations) || claim.limitations.length === 0 || claim.limitations.some((v) => !hasText(v))) errors.push(`claims[${index}].limitations must be non-empty`);
    if (claim?.kind === "empirical") {
      if (!isArray(claim.sourceUrls) || claim.sourceUrls.length === 0) errors.push(`empirical claim ${claim.id ?? index} must cite sourceUrls`);
      else for (const url of claim.sourceUrls) if (!sourceUrls.has(url)) errors.push(`claim ${claim.id ?? index} cites undeclared source URL: ${url}`);
    } else if (claim?.kind === "value-judgment") requireText(errors, claim.rationale, `claims[${index}].rationale`);
    else errors.push(`claims[${index}].kind must be empirical or value-judgment`);
  });

  if (!isArray(proposal.conflictingEvidence) || proposal.conflictingEvidence.length === 0) errors.push("conflictingEvidence must be non-empty");
  else proposal.conflictingEvidence.forEach((item, index) => {
    requireText(errors, item?.summary, `conflictingEvidence[${index}].summary`);
    if (!isArray(item?.claimIds)) errors.push(`conflictingEvidence[${index}].claimIds must be an array`);
    else for (const id of item.claimIds) if (!claimIds.has(id)) errors.push(`conflictingEvidence references unknown claim: ${id}`);
    if (!isArray(item?.sourceUrls)) errors.push(`conflictingEvidence[${index}].sourceUrls must be an array`);
    else for (const url of item.sourceUrls) if (!sourceUrls.has(url)) errors.push(`conflictingEvidence cites undeclared source URL: ${url}`);
  });
  if (!isArray(proposal.limitations) || proposal.limitations.length === 0 || proposal.limitations.some((v) => !hasText(v))) errors.push("limitations must be non-empty");
  if (!isArray(proposal.duplicateCandidates)) errors.push("duplicateCandidates must be an array");
  else proposal.duplicateCandidates.forEach((item, index) => {
    if (!TYPES.has(item?.type)) errors.push(`duplicateCandidates[${index}].type is invalid`);
    if (!ID_PATTERN.test(item?.id ?? "")) errors.push(`duplicateCandidates[${index}].id must be lowercase kebab-case`);
    requireText(errors, item?.reason, `duplicateCandidates[${index}].reason`);
  });
  if (TYPES.has(proposal.proposalType)) validateContent(proposal, errors, claimIds, context);
  return errors;
}

async function canonicalContext(root) {
  try {
    const [graph, report] = await Promise.all([
      readFile(path.join(root, "generated/content/graph.json"), "utf8").then(JSON.parse),
      readFile(path.join(root, "generated/reports/content-report.json"), "utf8").then(JSON.parse),
    ]);
    return {
      systems: new Set((graph.systems ?? []).map((item) => item.id)),
      cruxes: new Set((graph.cruxes ?? []).map((item) => item.id)),
      sources: new Set((graph.sources ?? []).map((item) => item.id)),
      cases: new Set((graph.cases ?? []).map((item) => item.id)),
      graphValid: report?.validation?.valid === true,
    };
  } catch { return undefined; }
}

export async function loadProposal(target) {
  const resolved = path.resolve(target);
  const file = (await stat(resolved)).isDirectory() ? path.join(resolved, "proposal.json") : resolved;
  const parts = path.dirname(file).split(path.sep);
  return { file, proposal: JSON.parse(await readFile(file, "utf8")), expected: { scope: parts.at(-3), type: parts.at(-2), id: parts.at(-1) } };
}

async function main() {
  const target = process.argv[2];
  if (!target) { console.error("Usage: validate-proposal.mjs <proposal-directory-or-json>"); process.exitCode = 2; return; }
  try {
    const { file, proposal, expected } = await loadProposal(target);
    const context = await canonicalContext(process.cwd());
    const errors = validateProposal(proposal, expected, context);
    if (!context) errors.push("canonical graph unavailable; run npm run validate before validating cross-links");
    else if (!context.graphValid) errors.push("canonical graph validation is not valid; resolve npm run validate diagnostics first");
    const { findDuplicates, unacknowledgedDuplicates } = await import("./check-duplicates.mjs");
    const unacknowledged = unacknowledgedDuplicates(proposal, await findDuplicates(file, process.cwd()));
    if (unacknowledged.length) errors.push(`duplicateCandidates must acknowledge detected IDs: ${unacknowledged.map((item) => item.id).join(", ")}`);
    try {
      const memo = await readFile(path.join(path.dirname(file), "research.md"), "utf8");
      if (!hasText(memo)) errors.push("research.md must be non-empty");
    } catch {
      errors.push("research.md must exist beside proposal.json");
    }
    if (errors.length) { console.error(JSON.stringify({ valid: false, file, errors }, null, 2)); process.exitCode = 1; }
    else console.log(JSON.stringify({ valid: true, file, id: proposal.id, proposalType: proposal.proposalType }, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ valid: false, errors: [error instanceof Error ? error.message : String(error)] }, null, 2));
    process.exitCode = 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main();
