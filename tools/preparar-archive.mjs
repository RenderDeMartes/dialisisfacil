// Prepara la subida a Internet Archive: convierte subs/*.vtt a .srt y los deja
// junto a cada video comprimido (archive.org los empareja por nombre).
//
// Uso: node tools/preparar-archive.mjs [carpeta-de-videos]
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const videos = process.argv[2] || 'F:/Dialisis_Videos/Web';

const aSrt = (vtt) => vtt.replace(/\r/g, '').replace(/^WEBVTT[^\n]*\n+/, '').trim().split(/\n\n+/)
  .map((bloque, i) => `${i + 1}\n${bloque.replace(/^([\d:]+)\.(\d{3}) --> ([\d:]+)\.(\d{3})/, '$1,$2 --> $3,$4')}`)
  .join('\n\n') + '\n';

let n = 0;
for (const f of readdirSync(join(raiz, 'subs')).filter((f) => f.endsWith('.vtt'))) {
  const slug = f.replace(/\.vtt$/, '');
  const srt = aSrt(readFileSync(join(raiz, 'subs', f), 'utf8'));
  for (const q of ['1080', '720']) {
    const dir = join(videos, q);
    if (!existsSync(join(dir, `${slug}-${q}.mp4`))) { console.warn(`falta ${q}/${slug}-${q}.mp4`); continue; }
    writeFileSync(join(dir, `${slug}-${q}.srt`), srt);
    n++;
  }
}
console.log(`${n} subtítulos .srt escritos en ${videos}`);
