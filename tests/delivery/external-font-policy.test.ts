import { describe, expect, it } from "vitest";
import {
  findExternalFontCss,
  findExternalFontHtml,
} from "../../scripts/external-font-policy";

describe("external font resource policy", () => {
  it.each([
    ["remote stylesheet", '<link rel="stylesheet" href="https://fonts.example/type.css">'],
    ["font preload", "<link href='https://fonts.example/type.woff2' as='font' rel='preload'>"],
    ["embedded import", "<style>@import url('https://fonts.example/type.css');</style>"],
    ["embedded font face", "<style>@font-face { src: url(https://fonts.example/type.woff2) }</style>"],
    ["inline font source", '<p style="src: url(https://fonts.example/type.woff2)">'],
    ["protocol-relative stylesheet", '<link rel="stylesheet" href="//fonts.example/type.css">'],
  ])("detects the %s mutation in HTML", (_name, html) => {
    expect(findExternalFontHtml(html)).toHaveLength(1);
  });

  it.each([
    ["remote import", '@import "https://fonts.example/type.css";'],
    ["remote font face", "@font-face { src: url('https://fonts.example/type.woff2') }"],
    ["protocol-relative font face", "@font-face { src: url('//fonts.example/type.woff2') }"],
  ])("detects the %s mutation in emitted CSS", (_name, css) => {
    expect(findExternalFontCss(css)).toHaveLength(1);
  });

  it("allows ordinary external content anchors and local font resources", () => {
    const html = [
      '<a href="https://example.org/research">Research</a>',
      '<link rel="preload" as="font" href="/fonts/local.woff2">',
    ].join("");
    expect(findExternalFontHtml(html)).toEqual([]);
    expect(
      findExternalFontCss("@font-face { src: url('/fonts/local.woff2') }"),
    ).toEqual([]);
  });
});
