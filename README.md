# oauth-refresher

Build, send and refresh OAuth 2.0 access tokens via `refresh_token` grant — library
plus small CLI for ops scripts.

## Library

```js
import { buildRefreshRequest, refreshAccessToken } from './index.js';

const request = buildRefreshRequest({
  tokenUrl: 'https://provider.example/oauth/token',
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  scope: 'read offline_access',         // optional
});

const { accessToken, expireIn } = await refreshAccessToken(config /* + custom fetchImpl */);
```

| Export | Purpose |
|---|---|
| `buildRefreshRequest({tokenUrl, clientId, clientSecret, refreshToken, scope})` | serializes a standard `grant_type=refresh_token` body |
| `refreshAccessToken(config[, fetchImpl])` | posts it, returns new access token info |

## CLI

```bash
node cli.js --help
```

## Secret hygiene

On verbose/debug output (`maskSecret`), both `clientSecret` and `refreshToken` are
masked to partial forms — debugging logs never print a usable full credential.

## Tests

```bash
npm test
```
