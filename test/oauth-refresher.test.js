import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRefreshRequest, maskSecret, refreshAccessToken } from '../index.js';

test('buildRefreshRequest creates form-encoded payload', () => {
  const request = buildRefreshRequest({
    tokenUrl: 'https://example.com/token',
    clientId: 'abc',
    clientSecret: 'secret',
    refreshToken: 'refresh',
  });

  assert.equal(request.url, 'https://example.com/token');
  assert.match(request.options.body, /grant_type=refresh_token/);
  assert.equal(maskSecret('supersecretvalue'), 'sup***lue');
});

test('refreshAccessToken returns parsed payload', async () => {
  const payload = await refreshAccessToken(
    { tokenUrl: 'https://example.com/token', clientId: 'abc', clientSecret: 'secret', refreshToken: 'refresh' },
    async () => ({ ok: true, status: 200, json: async () => ({ access_token: 'token-123' }) }),
  );

  assert.equal(payload.access_token, 'token-123');
});
