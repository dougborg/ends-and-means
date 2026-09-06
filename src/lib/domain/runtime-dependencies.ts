import { convertToTSX } from "@astrojs/compiler/sync";
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

function jsxScriptDependency(node: ts.Node) {
  if (!ts.isJsxOpeningElement(node) && !ts.isJsxSelfClosingElement(node)) {
    return undefined;
  }
  if (!ts.isIdentifier(node.tagName) || node.tagName.text !== "script") {
    return undefined;
  }
  const source = node.attributes.properties.find(
    (property): property is ts.JsxAttribute =>
      ts.isJsxAttribute(property) && property.name.getText() === "src",
  );
  if (!source) return undefined;
  if (source.initializer && ts.isStringLiteral(source.initializer)) {
    return { kind: "Astro script src", specifier: source.initializer.text };
  }
  const expression =
    source.initializer && ts.isJsxExpression(source.initializer)
      ? staticSpecifier(source.initializer.expression)
      : undefined;
  return { kind: "Astro script src", specifier: expression };
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
    const script = jsxScriptDependency(node);
    if (script?.specifier) specifiers.push(script.specifier);
    else if (script)
      errors.push(`${script.kind} uses a non-static module specifier`);
    ts.forEachChild(node, visit);
  };
  visit(source);
  return { errors, specifiers };
}

function scanAstro(path: string, content: string): RuntimeDependencyScan {
  try {
    const converted = convertToTSX(content, {
      filename: path,
      includeScripts: true,
    });
    const scan = scanSource(`${path}.tsx`, converted.code);
    return {
      errors: [
        ...converted.diagnostics.map(({ text }) => text),
        ...scan.errors,
      ],
      specifiers: scan.specifiers,
    };
  } catch (error) {
    return {
      errors: [error instanceof Error ? error.message : "Astro parser failed"],
      specifiers: [],
    };
  }
}

export function scanRuntimeDependencies(
  path: string,
  content: string,
): RuntimeDependencyScan {
  return path.toLowerCase().endsWith(".astro")
    ? scanAstro(path, content)
    : scanSource(path, content);
}
