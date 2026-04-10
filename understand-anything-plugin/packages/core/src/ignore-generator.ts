import { existsSync } from "node:fs";
import { join } from "node:path";

const HEADER = `# .understandignore — patterns for files/dirs to exclude from analysis
# Syntax: same as .gitignore (globs, # comments, ! negation, trailing / for dirs)
# Lines below are suggestions — uncomment to activate.
# Use ! prefix to force-include something excluded by defaults.
#
# Built-in defaults (always excluded unless negated):
#   node_modules/, .git/, dist/, build/, bin/, obj/, *.lock, *.min.js, etc.
#
`;

const DETECTABLE_DIRS = [
  { dir: "__tests__", pattern: "__tests__/" },
  { dir: "test", pattern: "test/" },
  { dir: "tests", pattern: "tests/" },
  { dir: "fixtures", pattern: "fixtures/" },
  { dir: "testdata", pattern: "testdata/" },
  { dir: "docs", pattern: "docs/" },
  { dir: "examples", pattern: "examples/" },
  { dir: "scripts", pattern: "scripts/" },
  { dir: "migrations", pattern: "migrations/" },
  { dir: ".storybook", pattern: ".storybook/" },
];

const GENERIC_SUGGESTIONS = [
  "*.test.*",
  "*.spec.*",
  "*.snap",
];

/**
 * Generates a starter .understandignore file content by scanning the project
 * for common directories. All suggestions are commented out.
 */
export function generateStarterIgnoreFile(projectRoot: string): string {
  const sections: string[] = [HEADER];

  const detected: string[] = [];
  for (const { dir, pattern } of DETECTABLE_DIRS) {
    if (existsSync(join(projectRoot, dir))) {
      detected.push(pattern);
    }
  }

  if (detected.length > 0) {
    sections.push("# --- Detected directories (uncomment to exclude) ---\n");
    for (const pattern of detected) {
      sections.push(`# ${pattern}`);
    }
    sections.push("");
  }

  sections.push("# --- Test file patterns (uncomment to exclude) ---\n");
  for (const pattern of GENERIC_SUGGESTIONS) {
    sections.push(`# ${pattern}`);
  }
  sections.push("");

  return sections.join("\n");
}
