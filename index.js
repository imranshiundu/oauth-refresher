import fs from 'node:fs/promises';

export function buildRefreshRequest({ tokenUrl, clientId, clientSecret, refreshToken, scope }) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });
  if (scope) body.set('scope', scope);

  return {
    url: tokenUrl,
    options: {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    },
  };
}

export function maskSecret(value = '') {
  if (!value) return '';
  if (value.length <= 6) return '*'.repeat(value.length);
  return `${value.slice(0, 3)}***${value.slice(-3)}`;
}

export async function refreshAccessToken(config, fetchImpl = fetch) {
  const request = buildRefreshRequest(config);
  const response = await fetchImpl(request.url, request.options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Refresh failed with status ${response.status}: ${payload.error || 'unknown_error'}`);
  }
  return payload;
}

export async function saveTokenPayload(filePath, payload) {
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8');
  return filePath;
}

export function summarizeConfig(config) {
  return {
    tokenUrl: config.tokenUrl,
    clientId: config.clientId,
    clientSecret: maskSecret(config.clientSecret),
    refreshToken: maskSecret(config.refreshToken),
    scope: config.scope || null,
  };
}
