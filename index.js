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

export async function refreshAccessToken(config, fetchImpl = fetch) {
  const request = buildRefreshRequest(config);
  const response = await fetchImpl(request.url, request.options);
  if (!response.ok) throw new Error(`Refresh failed with status ${response.status}`);
  return response.json();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(buildRefreshRequest({ tokenUrl: 'https://example.com/oauth/token', clientId: 'demo', clientSecret: 'secret', refreshToken: 'refresh-token' }));
}
