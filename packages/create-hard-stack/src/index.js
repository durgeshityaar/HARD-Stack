#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import degit from "degit";

const REPO = "durgeshityaar/HARD-Stack";

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

  console.log(`Cloning hard-stack into ./${target} ...`);
  await degit(REPO, { cache: false, force: true }).clone(target);

  // the CLI's own source ships inside the template repo it clones from — strip it
  rmSync(join(target, "packages/create-hard-stack"), { recursive: true, force: true });

  renamePackages(target, target);
  const rootPkg = join(target, "package.json");
  const pkg = JSON.parse(readFileSync(rootPkg, "utf8"));
  pkg.name = target;
  writeFileSync(rootPkg, `${JSON.stringify(pkg, null, 2)}\n`);

  const lockfile = join(target, "bun.lock");
  if (existsSync(lockfile)) rmSync(lockfile);

  console.log(`
Done. Next steps:
  cd ${target}
  bun install
  cp .env.example .env
  bun run dev
`);
}

// ponytail: string replace across package.json files, not a full AST rename —
// upgrade to a codemod if scoped imports ever need renaming inside .ts source too
function renamePackages(dir, newScope) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".git") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      renamePackages(full, newScope);
    } else if (entry === "package.json") {
      const contents = readFileSync(full, "utf8").replaceAll("@hard-stack/", `@${newScope}/`);
      writeFileSync(full, contents);
    }
  }
}

main();
