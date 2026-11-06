import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = `${root}src/assets/images/logo128.svg`;
const publicDir = `${root}public/`;

/**
 * Construit un .ico multi-résolutions à partir de PNG.
 * Le format ICO accepte des PNG depuis Windows Vista : pas besoin de BMP.
 */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4); // count

  const entries = [];
  let offset = 6 + images.length * 16;

  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((image) => image.data)]);
}

const sizes = [16, 32, 48];

const pngs = await Promise.all(
  sizes.map(async (size) => ({
    size,
    data: await sharp(source).resize(size, size).png().toBuffer(),
  })),
);

await mkdir(publicDir, { recursive: true });
await copyFile(`${root}src/assets/images/logo32.svg`, `${publicDir}favicon.svg`);
await writeFile(`${publicDir}favicon.ico`, buildIco(pngs));

await sharp(source)
  .resize(180, 180)
  .png()
  .toFile(`${publicDir}apple-touch-icon.png`);

console.log(
  `Icônes générées : favicon.svg, favicon.ico (${sizes.join("/")}px), apple-touch-icon.png (180px)`,
);
