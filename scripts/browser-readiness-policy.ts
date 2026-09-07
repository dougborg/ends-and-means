import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import ts from "typescript";

export interface BrowserReadinessFinding {
  file: string;
  line: number;
  method: "goto" | "waitForLoadState";
}

function literalText(node: ts.Node | undefined) {
  return node &&
    (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    ? node.text
    : undefined;
}

function propertyName(node: ts.PropertyName) {
  return ts.isIdentifier(node) || ts.isStringLiteral(node) ? node.text : undefined;
}

function usesNetworkIdle(call: ts.CallExpression) {
  if (!ts.isPropertyAccessExpression(call.expression)) return undefined;
  const method = call.expression.name.text;
  if (method === "waitForLoadState")
    return literalText(call.arguments[0]) === "networkidle"
      ? "waitForLoadState"
      : undefined;
  if (method !== "goto") return undefined;
  const options = call.arguments[1];
  if (!options || !ts.isObjectLiteralExpression(options)) return undefined;
  return options.properties.some(
    (property) =>
      ts.isPropertyAssignment(property) &&
      propertyName(property.name) === "waitUntil" &&
      literalText(property.initializer) === "networkidle",
  )
    ? "goto"
    : undefined;
}

export function findNetworkIdleWaits(source: string, file = "fixture.ts") {
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const findings: BrowserReadinessFinding[] = [];
  function visit(node: ts.Node) {
    if (ts.isCallExpression(node)) {
      const method = usesNetworkIdle(node);
      if (method) {
        const { line } = tree.getLineAndCharacterOfPosition(node.getStart(tree));
        findings.push({ file, line: line + 1, method });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  return findings;
}

function relativeImports(source: string, file: string) {
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const imports: string[] = [];
  for (const statement of tree.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      statement.moduleSpecifier.text.startsWith(".")
    )
      imports.push(statement.moduleSpecifier.text);
  }
  return imports;
}

function resolveImport(from: string, specifier: string) {
  const candidate = resolve(dirname(from), specifier);
  for (const path of [candidate, `${candidate}.ts`, `${candidate}.tsx`, join(candidate, "index.ts")])
    if (existsSync(path) && [".ts", ".tsx"].includes(extname(path))) return path;
  return undefined;
}

export function visualReadinessSources(visualDirectory: string) {
  const entrypoints: string[] = [];
  function collectEntrypoints(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) collectEntrypoints(path);
      else if (entry.isFile() && entry.name.endsWith(".spec.ts"))
        entrypoints.push(path);
    }
  }
  collectEntrypoints(visualDirectory);
  const pending = [...entrypoints];
  const visited = new Set<string>();
  while (pending.length > 0) {
    const file = pending.pop();
    if (!file || visited.has(file)) continue;
    visited.add(file);
    const source = readFileSync(file, "utf8");
    for (const specifier of relativeImports(source, file)) {
      const imported = resolveImport(file, specifier);
      if (imported && !visited.has(imported)) pending.push(imported);
    }
  }
  return [...visited].toSorted();
}
