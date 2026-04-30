# oauth-refresher

A small dependency-free Node.js CLI and library for OAuth refresh-token workflows.

It is useful when you need a lightweight helper that can refresh an access token from a server, cron job, local script, Termux workflow, or CI job without pulling in a large SDK.

## Status

This repository is no longer just a placeholder. It now includes:

- CLI entrypoint: `cli.js`
- Reusable library functions: `index.js`
- Package metadata and npm scripts: `package.json`
- Node test coverage: `test/index.test.js`

## Requirements

- Node.js 18 or newer
- An OAuth provider that supports the refresh-token grant

## Install locally

```bash
git clone https://github.com/imranshiundu/oauth-refresher.git
cd oauth-refresher
npm test
```

## Run with environment variables

```bash
OAUTH_TOKEN_URL=https://provider.example/token \
OAUTH_CLIENT_ID=your-client-id \
OAUTH_CLIENT_SECRET=your-client-secret \
OAUTH_REFRESH_TOKEN=your-refresh-token \
node cli.js --dry-run
```

## Run with a config file

Create `oauth.json`:

```json
{
  "tokenUrl": "https://provider.example/token",
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "refreshToken": "your-refresh-token"
}
```

Then run:

```bash
node cli.js --config oauth.json --token-only
```

## Save the token payload

```bash
node cli.js --config oauth.json --out token.json
```

## Use as a library

```js
import { refreshAccessToken } from './index.js';

const token = await refreshAccessToken({
  tokenUrl: process.env.OAUTH_TOKEN_URL,
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  refreshToken: process.env.OAUTH_REFRESH_TOKEN,
});

console.log(token.access_token);
```

## Security notes

Never commit real OAuth secrets, refresh tokens, or generated token files. Keep config files local, use environment variables for deployment, and rotate credentials immediately if a token is exposed.
