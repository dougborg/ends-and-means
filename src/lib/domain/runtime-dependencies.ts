import ts from "typescript";

export interface RuntimeDependencyScan {
  errors: string[];
  specifiers: string[];
}

function scriptKind(path: string) {
  if (/\.(?:jsx)$/iu.test(path)) return ts.ScriptKind.JSX;
  if (/\.(?:js|cjs|mjs)$/iu.test(path)) return ts.ScriptKind.JS;
  if (/\.(?:tsx)$/iu.test(path)) return ts.ScriptKind.TSX;
  return ts.ScriptKind.TS;
}

function staticSpecifier(node: ts.Expression | undefined) {
  return node && ts.isStringLiteralLike(node) ? node.text : undefined;
}

function callKind(expression: ts.Expression) {
  if (expression.kind === ts.SyntaxKind.ImportKeyword) return "import";
  if (ts.isIdentifier(expression) && expression.text === "require") {
    return "require";
  }
  if (
    ts.isPropertyAccessExpression(expression) &&
    ts.isIdentifier(expression.expression) &&
    expression.expression.text === "require" &&
    expression.name.text === "resolve"
  ) {
    return "require.resolve";
  }
  return undefined;
}

function directSpecifier(node: ts.Node) {
  if (
    (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
    node.moduleSpecifier &&
    ts.isStringLiteralLike(node.moduleSpecifier)
  ) {
    return node.moduleSpecifier.text;
  }
  if (
    ts.isImportEqualsDeclaration(node) &&
    ts.isExternalModuleReference(node.moduleReference)
  ) {
    return staticSpecifier(node.moduleReference.expression);
  }
  return undefined;
}

function callDependency(node: ts.Node) {
  if (!ts.isCallExpression(node)) return undefined;
  const kind = callKind(node.expression);
  if (!kind) return undefined;
  return { kind, specifier: staticSpecifier(node.arguments[0]) };
}

function scanSource(path: string, content: string): RuntimeDependencyScan {
  const source = ts.createSourceFile(
    path,
    content,
    ts.ScriptTarget.Latest,
    true,
    scriptKind(path),
  );
  const parsed = source as ts.SourceFile & {
    parseDiagnostics: readonly ts.Diagnostic[];
  };
  const errors = parsed.parseDiagnostics.map((diagnostic) =>
    ts.flattenDiagnosticMessageText(diagnostic.messageText, " "),
  );
  const specifiers: string[] = [];
  const visit = (node: ts.Node) => {
    const direct = directSpecifier(node);
    if (direct) specifiers.push(direct);
    const call = callDependency(node);
    if (call?.specifier) specifiers.push(call.specifier);
    else if (call)
      errors.push(`${call.kind} uses a non-static module specifier`);
    ts.forEachChild(node, visit);
  };
  visit(source);
  return { errors, specifiers };
}

function astroRegions(content: string) {
  const withoutComments = content.replace(/<!--[\s\S]*?-->/gu, "");
  const regions: string[] = [];
  const frontmatter = withoutComments.match(
    /^(?:\uFEFF)?---[\t ]*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u,
  );
  if (frontmatter?.[1]) regions.push(frontmatter[1]);
  const markup = frontmatter
    ? withoutComments.slice(frontmatter[0].length)
    : withoutComments;
  for (const match of markup.matchAll(
    /<script\b[^>]*>([\s\S]*?)<\/script>/giu,
  )) {
    regions.push(match[1] ?? "");
  }
  return { markup, regions };
}

function scanAstro(path: string, content: string): RuntimeDependencyScan {
  const { markup, regions } = astroRegions(content);
  const scans = regions.map((region, index) =>
    scanSource(`${path}#script-${index + 1}.tsx`, region),
  );
  const staticSources = [
    ...markup.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/giu),
  ].map((match) => match[1] ?? "");
  return {
    errors: scans.flatMap(({ errors }) => errors),
    specifiers: [
      ...staticSources,
      ...scans.flatMap(({ specifiers }) => specifiers),
    ],
  };
}

export function scanRuntimeDependencies(
  path: string,
  content: string,
): RuntimeDependencyScan {
  return path.toLowerCase().endsWith(".astro")
    ? scanAstro(path, content)
    : scanSource(path, content);
}
