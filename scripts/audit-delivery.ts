import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { auditDeliverySnapshot, type DeliveryItem, type DeliverySnapshot } from "./delivery-state.ts";

interface ProjectListItem {
  content: { number?: number; title: string; type: "Issue" | "PullRequest"; body?: string; state?: "OPEN" | "CLOSED" | "MERGED" };
  labels?: string[];
  priority?: DeliveryItem["priority"];
  status: DeliveryItem["status"];
  workstream?: DeliveryItem["workstream"];
  "linked pull requests"?: string[];
}

function gh(args: string[]) {
  return execFileSync("gh", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function linkedPrStates(urls: string[]) {
  return urls.map((url) => JSON.parse(gh(["pr", "view", url, "--json", "state"])).state as "OPEN" | "CLOSED" | "MERGED");
}

function issueUpdatedAt(number: number) {
  return JSON.parse(gh(["issue", "view", String(number), "--json", "updatedAt"])).updatedAt as string;
}

function loadLiveSnapshot(): DeliverySnapshot {
  const project = JSON.parse(gh(["project", "view", "7", "--owner", "dougborg", "--format", "json"]));
  const list = JSON.parse(gh(["project", "item-list", "7", "--owner", "dougborg", "--format", "json", "--limit", "200"]));
  const items = (list.items as ProjectListItem[]).map((item): DeliveryItem => {
    const number = item.content.number ?? 0;
    const links = item["linked pull requests"] ?? [];
    return {
      number,
      title: item.content.title,
      type: item.content.type,
      state: item.content.state ?? "OPEN",
      status: item.status,
      workstream: item.workstream,
      priority: item.priority,
      labels: item.labels ?? [],
      body: item.content.body,
      updatedAt: item.status === "In progress" && number > 0 ? issueUpdatedAt(number) : undefined,
      linkedPullRequestStates: linkedPrStates(links),
    };
  });
  return { project: { number: project.number, public: project.public }, capturedAt: new Date().toISOString(), items };
}

function usage() {
  return "Usage: pnpm audit:delivery -- --project-snapshot <path> | --live-project | --repository-only";
}

function loadSnapshot(args: string[]) {
  const pathIndex = args.indexOf("--project-snapshot");
  const snapshotPath = args[pathIndex + 1];
  if (pathIndex >= 0 && snapshotPath) {
    return JSON.parse(readFileSync(resolve(snapshotPath), "utf8")) as DeliverySnapshot;
  }
  if (args.includes("--live-project")) return loadLiveSnapshot();
  if (args.includes("--repository-only")) return undefined;
  throw new Error(usage());
}

try {
  const snapshot = loadSnapshot(process.argv.slice(2));
  if (!snapshot) {
    console.log("Project state: UNAVAILABLE (repository-only audit; no GitHub credentials requested)");
    process.exit(0);
  }
  const findings = auditDeliverySnapshot(snapshot);
  if (findings.length === 0) {
    console.log(`Project #${snapshot.project.number}: clean (${snapshot.items.length} delivery items checked)`);
  } else {
    for (const finding of findings) console.error(`${finding.code}: ${finding.message}`);
    process.exitCode = 1;
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Project state: UNAVAILABLE (${message})`);
  process.exitCode = 2;
}
