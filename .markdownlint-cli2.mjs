export default {
  customRules: ["markdownlint-sentences-per-line"],
  gitignore: true,
  globs: ["**/*.md", "#archive"],
  ignores: ["archive/**"],
  config: {
    default: true,
    MD013: false,
    MD033: false,
    MD060: false,
    "markdownlint-sentences-per-line": false,
  },
  overrides: [
    {
      filter: ["content/domain/presentation/narratives/**/*.md"],
      combine: "merge",
      config: { MD041: false, "markdownlint-sentences-per-line": true },
    },
    {
      filter: [".github/pull_request_template.md"],
      combine: "merge",
      config: { MD041: false },
    },
  ],
};
