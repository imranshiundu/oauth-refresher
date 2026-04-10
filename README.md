# oauth-refresher

Small CLI for refresh-token OAuth flows.

## Usage

With env vars:

```bash
OAUTH_TOKEN_URL=https://provider.example/token \
OAUTH_CLIENT_ID=abc \
OAUTH_CLIENT_SECRET=secret \
OAUTH_REFRESH_TOKEN=refresh-token \
node cli.js --dry-run
```

Or with a config file:

```json
{
  "tokenUrl": "https://provider.example/token",
  "clientId": "abc",
  "clientSecret": "secret",
  "refreshToken": "refresh-token"
}
```

Then:

```bash
node cli.js --config oauth.json --token-only
```
