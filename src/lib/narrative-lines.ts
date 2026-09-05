export interface NarrativeLineProblem {
  line: number;
  message: string;
}

const sectionHeading = /^## [a-z0-9]+(?:-[a-z0-9]+)*$/u;
const terminalPunctuation = /[.!?](?:["')\]_*]+)?$/u;

export function validateNarrativeLines(
  markdown: string,
): NarrativeLineProblem[] {
  return markdown.split("\n").flatMap((source, index) => {
    const line = source.trim();
    if (!line || sectionHeading.test(line) || terminalPunctuation.test(line))
      return [];
    return [
      {
        line: index + 1,
        message: "prose lines must contain one complete sentence",
      },
    ];
  });
}
