import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { preparePhoto } from '../lib/photos.mjs';
test('a PNG upload is decoded and stored as a JPEG', async () => {
  const png = await sharp({ create: { width: 8, height: 8, channels: 3, background: 'red' } }).png().toBuffer();
  const photo = await preparePhoto(new Blob([png]));
  assert.equal((await sharp(photo).metadata()).format, 'jpeg');
});
test('invalid and oversized uploads are rejected', async () => {
  await assert.rejects(preparePhoto(new Blob(['unreadable'])), /readable JPEG/);
  await assert.rejects(preparePhoto({ size: 4 * 1024 * 1024 }), /3 MB/);
});
