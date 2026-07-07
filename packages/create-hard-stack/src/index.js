#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { createInterface } from "node:readline/promises";
import degit from "degit";

const REPO = "durgeshityaar/HARD-Stack";

// Files whose contents may reference the @hard-stack/ scope (imports, package
// names, shadcn aliases). Anything else (images, lockfiles, .env) is left alone.
const TEXT_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".mts",
  ".cts",
  ".json",
  ".astro",
  ".css",
  ".md",
  ".mdx",
  ".html",
  ".yml",
  ".yaml",
]);
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", ".turbo", ".astro", ".output", "build"]);

async function main() {
  let target = process.argv[2];
  if (!target) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    target = (await rl.question("Project name: ")).trim();
    rl.close();
  }
  if (!target) {
    console.error("A project name is required.");
    process.exit(1);
  }
  if (existsSync(target)) {
    console.error(`"${target}" already exists.`);
    process.exit(1);
  }

  const scope = toScope(target);
  if (!scope) {
    console.error(`Cannot derive a valid package scope from "${target}".`);
    process.exit(1);
  }

  console.log(`Cloning hard-stack into ./${target} ...`);
  await degit(REPO, { cache: false, force: true }).clone(target);

  // the CLI's own source ships inside the template repo it clones from — strip it
  rmSync(join(target, "packages/create-hard-stack"), { recursive: true, force: true });

  // rename the internal scope everywhere it's referenced: package.json names +
  // dependencies, source imports (incl. subpaths like /env/server), and shadcn
  // component aliases in components.json.
  rewriteScope(target, scope);

  // the monorepo root name is the one non-scoped package name — set it too
  const rootPkg = join(target, "package.json");
  const pkg = JSON.parse(readFileSync(rootPkg, "utf8"));
  pkg.name = scope;
  writeFileSync(rootPkg, `${JSON.stringify(pkg, null, 2)}\n`);

  const lockfile = join(target, "bun.lock");
  if (existsSync(lockfile)) rmSync(lockfile);

  // degit clones without git history; the root `prepare` hook runs `lefthook
  // install`, which needs a repo — init one so `bun install` doesn't error.
  try {
    execSync("git init -q", { cwd: target, stdio: "ignore" });
  } catch {
    // git missing or init failed — non-fatal, user can init later
  }

  console.log(`
Done. Next steps:
  cd ${target}
  bun install
  cp .env.example .env
  bun run dev
`);
}

// Derive a valid npm package scope from a project name: strip any leading
// @scope/, keep the last path segment, lowercase, and replace anything that's
// not url-safe. npm rejects uppercase and most punctuation in package names.
function toScope(name) {
  const base =
    name
      .replace(/^@[^/]+\//, "")
      .split("/")
      .pop() ?? "";
  return base
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[-_.]+|[-_.]+$/g, "");
}

function rewriteScope(dir, scope) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      rewriteScope(full, scope);
    } else if (TEXT_EXT.has(extname(entry))) {
      const contents = readFileSync(full, "utf8");
      if (contents.includes("@hard-stack/")) {
        writeFileSync(full, contents.replaceAll("@hard-stack/", `@${scope}/`));
      }
    }
  }
}

// ponytail: self-check for the scope sanitizer — run `node src/index.js --selftest`
if (process.argv[2] === "--selftest") {
  const assert = (a, b) => {
    if (a !== b) throw new Error(`expected ${b}, got ${a}`);
  };
  assert(toScope("My App"), "my-app");
  assert(toScope("@old/cool_thing"), "cool_thing");
  assert(toScope("apps/web-ui"), "web-ui");
  assert(toScope("--weird--"), "weird");
  console.log("selftest ok");
} else {
  main();
}
