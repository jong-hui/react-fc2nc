#!/usr/bin/env node
const { spawn } = require("child_process")
const path = require("path")

spawn(
  path.join("node_modules", ".bin", "jscodeshift"),
  [
    "--extensions=js,jsx,ts,tsx",
    ...process.argv.filter(arg => arg.startsWith("--")),
    "-t",
    "src/fc2nc.ts",
    process.cwd()
  ],
  {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  }
)