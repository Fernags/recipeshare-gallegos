import test from 'node:test';
import assert from 'node:assert/strict';
import { validSignInRequest } from '../lib/google.mjs';
test('Google callback requires matching nonempty CSRF values', () => {
  assert.equal(validSignInRequest('abc', 'abc'), true);
  for (const [cookie, body] of [[undefined, undefined], ['', ''], ['abc', 'different'], ['abc', null]]) {
    assert.equal(validSignInRequest(cookie, body), false);
  }
});
