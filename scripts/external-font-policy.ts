export interface ExternalFontResource {
  context: "css-import" | "font-face" | "inline-style" | "link";
  url: string;
}

const remoteUrl = /https?:\/\/[^\s)'"<>]+/gi;
const withoutComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

function remoteUrls(value: string) {
  return [...value.matchAll(remoteUrl)].map(([url]) => url ?? "");
}

export function findExternalFontCss(css: string): ExternalFontResource[] {
  const source = withoutComments(css);
  const findings: ExternalFontResource[] = [];
  for (const [rule] of source.matchAll(/@import\s+[^;]+;?/gi))
    for (const url of remoteUrls(rule))
      findings.push({ context: "css-import", url });
  for (const [rule] of source.matchAll(/@font-face\s*{[^}]*}/gi))
    for (const url of remoteUrls(rule)) findings.push({ context: "font-face", url });
  return findings;
}

function attribute(tag: string, name: string) {
  const match = tag.match(
    new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"),
  );
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

export function findExternalFontHtml(html: string): ExternalFontResource[] {
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].flatMap(([tag]) => {
    const href = attribute(tag, "href");
    const rel = attribute(tag, "rel")?.toLowerCase().split(/\s+/) ?? [];
    const as = attribute(tag, "as")?.toLowerCase();
    if (
      href &&
      /^https?:\/\//i.test(href) &&
      (rel.includes("stylesheet") || (rel.includes("preload") && as === "font"))
    )
      return [{ context: "link" as const, url: href }];
    return [];
  });
  const embedded = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].flatMap(
    (match) => findExternalFontCss(match[1] ?? ""),
  );
  const inline = [...html.matchAll(/\bstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)].flatMap((match) => {
    const style = match[1] ?? match[2] ?? "";
    if (/\bsrc\s*:/i.test(style))
      return remoteUrls(style).map((url) => ({
        context: "inline-style" as const,
        url,
      }));
    return [];
  });
  return [...links, ...embedded, ...inline];
}
