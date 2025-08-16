#!/usr/bin/env node
const { execSync } = require('child_process');
const version = process.env.npm_package_version || '0.0.0-dev';
const buildTime = new Date().toISOString();
process.env.APP_VERSION = version;
process.env.BUILD_TIME = buildTime;
console.log(`[build-web] APP_VERSION=${version} BUILD_TIME=${buildTime}`);
const runner = (()=>{
	try { execSync('pnpm -v',{stdio:'ignore'}); return 'pnpm --filter web build'; } catch { return 'npm --workspace web run build'; }
})();
execSync(runner, { stdio: 'inherit' });
