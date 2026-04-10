import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { generateStarterIgnoreFile } from "../ignore-generator";
import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("generateStarterIgnoreFile", () => {
  let testDir: string;

  beforeEach(() => {
    testDir = join(tmpdir(), `ignore-gen-test-${Date.now()}`);
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it("includes a header comment explaining the file", () => {
    const content = generateStarterIgnoreFile(testDir);
    expect(content).toContain(".understandignore");
    expect(content).toContain("same as .gitignore");
    expect(content).toContain("Built-in defaults");
  });

  it("all suggestions are commented out", () => {
    mkdirSync(join(testDir, "__tests__"), { recursive: true });
    mkdirSync(join(testDir, "docs"), { recursive: true });
    const content = generateStarterIgnoreFile(testDir);
    const lines = content.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
    expect(lines).toHaveLength(0);
  });

  it("suggests __tests__ when directory exists", () => {
    mkdirSync(join(testDir, "__tests__"), { recursive: true });
    const content = generateStarterIgnoreFile(testDir);
    expect(content).toContain("# __tests__/");
  });

  it("suggests docs when directory exists", () => {
    mkdirSync(join(testDir, "docs"), { recursive: true });
    const content = generateStarterIgnoreFile(testDir);
    expect(content).toContain("# docs/");
  });

  it("suggests test and tests when they exist", () => {
    mkdirSync(join(testDir, "test"), { recursive: true });
    mkdirSync(join(testDir, "tests"), { recursive: true });
    const content = generateStarterIgnoreFile(testDir);
    expect(content).toContain("# test/");
    expect(content).toContain("# tests/");
  });

  it("suggests fixtures when directory exists", () => {
    mkdirSync(join(testDir, "fixtures"), { recursive: true });
    const content = generateStarterIgnoreFile(testDir);
    expect(content).toContain("# fixtures/");
  });

  it("suggests examples when directory exists", () => {
    mkdirSync(join(testDir, "examples"), { recursive: true });
    const content = generateStarterIgnoreFile(testDir);
    expect(content).toContain("# examples/");
  });

  it("suggests .storybook when directory exists", () => {
    mkdirSync(join(testDir, ".storybook"), { recursive: true });
    const content = generateStarterIgnoreFile(testDir);
    expect(content).toContain("# .storybook/");
  });

  it("suggests migrations when directory exists", () => {
    mkdirSync(join(testDir, "migrations"), { recursive: true });
    const content = generateStarterIgnoreFile(testDir);
    expect(content).toContain("# migrations/");
  });

  it("suggests scripts when directory exists", () => {
    mkdirSync(join(testDir, "scripts"), { recursive: true });
    const content = generateStarterIgnoreFile(testDir);
    expect(content).toContain("# scripts/");
  });

  it("always includes generic test file suggestions", () => {
    const content = generateStarterIgnoreFile(testDir);
    expect(content).toContain("# *.snap");
    expect(content).toContain("# *.test.*");
    expect(content).toContain("# *.spec.*");
  });

  it("does not suggest directories that don't exist", () => {
    const content = generateStarterIgnoreFile(testDir);
    expect(content).not.toContain("# __tests__/");
    expect(content).not.toContain("# .storybook/");
    expect(content).not.toContain("# fixtures/");
  });
});
