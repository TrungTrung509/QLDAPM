#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const crewlyRoot = "/usr/local/lib/node_modules/crewly";

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

console.log("[Patch] Checking for version-check services in", crewlyRoot);

walkDir(crewlyRoot, (filePath) => {
  if (filePath.endsWith("version-check.service.js")) {
    let content = fs.readFileSync(filePath, "utf8");
    // Force updateAvailable to false
    let patched = content.replace(
      /updateAvailable\s*=\s*latestVersion\s*!==\s*null\s*&&[^;]+;/g,
      "updateAvailable = false;",
    );
    patched = patched.replace(
      /async checkForUpdate\(\)\s*\{[\s\S]*?return this\.cachedResult;\s*\}/,
      "async checkForUpdate() { const currentVersion = this.getLocalVersion(); this.cachedResult = { currentVersion, latestVersion: currentVersion, updateAvailable: false }; return this.cachedResult; }",
    );
    if (patched !== content) {
      fs.writeFileSync(filePath, patched, "utf8");
      console.log("[Patch] Successfully patched:", filePath);
    }
  }

  if (filePath.endsWith("system-control.service.js")) {
    let content = fs.readFileSync(filePath, "utf8");
    let patched = content.replace(
      /async upgradeSystem\([^)]*\)\s*\{[\s\S]*?\n\s*\}/,
      'async upgradeSystem() { return { success: true, message: "System is running customized build. Upgrade disabled." }; }',
    );
    if (patched !== content) {
      fs.writeFileSync(filePath, patched, "utf8");
      console.log("[Patch] Successfully patched:", filePath);
    }
  }
});

console.log("[Patch] Crewly patching complete.");
