// Prepara l'album: prende le foto originali da assets/img/album/ (pesanti, non pubblicate),
// ne ricava una versione grande e una miniatura leggere in public/assets/img/album/
// e scrive l'elenco in src/data/album.json (con le misure, così la pagina non "salta").
//
// Uso:  npm run album
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'assets/img/album');
const OUT = path.join(root, 'public/assets/img/album');
const DATA = path.join(root, 'src/data/album.json');

const BIG = 1800; // larghezza massima della foto aperta
const THUMB = 760; // larghezza massima della miniatura nella griglia
const TARGET_MEAN = 118; // luminosità media (0-255) a cui portare ogni foto

const collator = new Intl.Collator('it', { numeric: true, sensitivity: 'base' });
const isImage = (f) => /\.(png|jpe?g|webp|avif)$/i.test(f);

await mkdir(SRC, { recursive: true });
await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter(isImage).sort(collator.compare);

// Si riparte da zero: così togliere una foto dalla cartella la toglie anche dal sito.
for (const old of await readdir(OUT)) await rm(path.join(OUT, old), { force: true });

const list = [];
for (const [i, file] of files.entries()) {
  const id = String(i + 1).padStart(3, '0');
  // Le foto hanno luminosità molto diverse: le uniformiamo (contrasto + luminosità media),
  // così con il filtro rosso nessuna esce piatta o quasi nera.
  const flat = await sharp(path.join(SRC, file), { failOn: 'none' })
    .rotate() // rispetta l'orientamento
    .resize({ width: BIG, withoutEnlargement: true })
    .normalise({ lower: 1, upper: 99 })
    .toBuffer();
  const { channels } = await sharp(flat).stats();
  const mean = channels.slice(0, 3).reduce((a, c) => a + c.mean, 0) / 3;
  const factor = Math.min(2.2, Math.max(0.75, TARGET_MEAN / Math.max(mean, 1)));
  const input = sharp(flat).linear(factor, 0);

  const big = await input
    .clone()
    .resize({ width: BIG, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(OUT, `${id}.jpg`));
  await input
    .clone()
    .resize({ width: THUMB, withoutEnlargement: true })
    .jpeg({ quality: 76, mozjpeg: true })
    .toFile(path.join(OUT, `${id}-t.jpg`));

  list.push({ id, w: big.width, h: big.height });
  process.stdout.write(`\r${i + 1}/${files.length}  ${file}                    `);
}

await writeFile(DATA, `${JSON.stringify(list, null, 2)}\n`);
console.log(`\nFatto: ${list.length} foto → public/assets/img/album/ e src/data/album.json`);
