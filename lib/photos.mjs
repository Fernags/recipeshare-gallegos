import sharp from 'sharp';
export async function preparePhoto(file) {
  if (file.size > 3 * 1024 * 1024) throw new Error('Choose a photo up to 3 MB.');
  try {
    const image = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40000000 });
    const { format } = await image.metadata();
    if (!['jpeg', 'png', 'webp'].includes(format)) throw new Error();
    return await image.rotate().resize({ width: 1280, height: 1280, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: 'white' }).jpeg({ quality: 80 }).toBuffer();
  } catch {
    throw new Error('Choose a readable JPEG, PNG or WebP photo.');
  }
}
