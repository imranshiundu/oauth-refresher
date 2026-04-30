import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildRefreshRequest,
  maskSecret,
  refreshAccessToken,
  summarizeConfig,
} from '../index.js';

const baseConfig = {
  tokenUrl: 'https://provider.example/token',
  clientId: 'client-id',
  clientSecret: 'client-secret',
  refreshToken: 'refresh-token',
};

test('buildRefreshRequest sends credentials in the form body by default', () => {
  const request = buildRefreshRequest(baseConfig);
  const body = new URLSearchParams(request.options.body);

  assert.equal(request.url, baseConfig.tokenUrl);
  assert.equal(request.options.method, 'POST');
  assert.equal(body.get('grant_type'), 'refresh_token');
  assert.equal(body.get('client_id'), baseConfig.clientId);
  assert.equal(body.get('client_secret'), baseConfig.clientSecret);
  assert.equal(body.get('refresh_token'), baseConfig.refreshToken);
});

test('maskSecret never prints the full secret', () => {
  assert.equal(maskSecret('abcdef'), '******');
  assert.equal(maskSecret('client-secret'), 'cli***ret');
});

test('summarizeConfig masks sensitive values', () => {
  const summary = summarizeConfig(baseConfig);

  assert.notEqual(summary.clientSecret, baseConfig.clientSecret);
  assert.notEqual(summary.refreshToken, baseConfig.refreshToken);
});

test('refreshAccessToken returns a successful JSON payload', async () => {
  const fakeFetch = async () => new Response(JSON.stringify({ access_token: 'new-token' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });

  const payload = await refreshAccessToken(baseConfig, fakeFetch);
  assert.equal(payload.access_token, 'new-token');
});
