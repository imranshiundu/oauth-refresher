#!/usr/bin/env node
import fs from 'node:fs/promises';
import { refreshAccessToken, saveTokenPayload, summarizeConfig } from './index.js';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--config') args.config = argv[++i];
    else if (arg === '--out') args.out = argv[++i];
    else if (arg === '--token-only') args.tokenOnly = true;
    else if (arg === '--dry-run') args.dryRun = true;
  }
  return args;
}

async function loadConfig(args) {
  if (args.config) {
    return JSON.parse(await fs.readFile(args.config, 'utf8'));
  }
  return {
    tokenUrl: process.env.OAUTH_TOKEN_URL,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    scope: process.env.OAUTH_SCOPE,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = await loadConfig(args);

  if (!config.tokenUrl || !config.clientId || !config.clientSecret || !config.refreshToken) {
    console.error('Provide credentials via --config config.json or OAUTH_* environment variables.');
    process.exit(1);
  }

  if (args.dryRun) {
    console.log(JSON.stringify(summarizeConfig(config), null, 2));
    return;
  }

  const payload = await refreshAccessToken(config);
  if (args.out) await saveTokenPayload(args.out, payload);
  console.log(args.tokenOnly ? (payload.access_token || '') : JSON.stringify(payload, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
