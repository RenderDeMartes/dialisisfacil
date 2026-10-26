// Compara los .srt de una exportación nueva con los subs/*.vtt corregidos:
// cuántas frases tiene cada uno y cuánto se movieron los tiempos.
//
// Uso: node tools/comparar-subs.mjs [carpeta-srt]
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const carpeta = process.argv[2] || 'F:/Dialisis_Videos/SubtitlesInFles';

// nombre de exportación -> id en la página (igual que tools/comprimir-videos.sh)
export const NOMBRES = {
  'Aviso importante': '00-aviso-importante',
  'Paso 00 Limpieza habitacion': '01-limpiar-el-cuarto',
  'Paso 01 Calentar la bolsa': '02-calentar-la-bolsa',
  'Paso 02 Reunir materiales y tomar presion arterial': '03-reunir-materiales-y-presion',
  'Paso 03 Lavado de manos sencillo': '04-lavado-de-manos-sencillo',
  'Paso 04 Limpieza de botella': '05-limpiar-la-botella-de-alcohol',
  'Paso 05 Lavado de manos completo': '06-lavado-de-manos-completo',
  'Paso 06 Limpieza mesa y gigante': '07-limpiar-la-mesa-y-el-gigante',
  'Paso 07 Limpieza de yodo y suero': '08-limpiar-el-yodo-y-la-bolsa',
  'Paso 08 Limpieza Organizador': '09-lavar-el-organizador',
  'Paso 09 Limpieza cateter y botella de alcohol': '10-limpiar-el-cateter',
  'Paso 10 Lavado de manos 5 minutos': '11-lavado-de-manos-de-5-minutos',
  'Paso 11 Iniciar procesio dialisis': '12-abrir-y-colgar-la-bolsa',
  'Paso 12 Conectar el paciente al organizador y drenar paciente': '13-conectar-y-drenar',
  'Paso 13 Introducir liquido al paciente': '14-dejar-entrar-el-liquido',
  'Paso 14 Desconectar paciente': '15-desconectar',
  'Paso 15 Medicion de liquido': '16-medir-el-liquido-y-recoger'
};

const seg = (t) => { const [h, m, s] = t.replace(',', '.').split(':').map(Number); return h * 3600 + m * 60 + s; };
export const leer = (txt) => txt.replace(/\r/g, '').replace(/^WEBVTT[^\n]*\n+/, '').trim().split(/\n\n+/).map((b) => {
  const m = b.match(/(\d\d:\d\d:\d\d[.,]\d{3}) --> (\d\d:\d\d:\d\d[.,]\d{3})\n([\s\S]+)$/);
  return m && { ini: seg(m[1]), fin: seg(m[2]), texto: m[3].replace(/\n/g, ' ').trim() };
}).filter(Boolean);

if ((process.argv[1] || '').endsWith('comparar-subs.mjs')) {
  for (const [nombre, id] of Object.entries(NOMBRES)) {
    const srt = join(carpeta, `${nombre}.srt`);
    if (!existsSync(srt)) { console.log(`${id}: FALTA ${nombre}.srt`); continue; }
    const nuevo = leer(readFileSync(srt, 'utf8'));
    const viejo = leer(readFileSync(join(raiz, 'subs', `${id}.vtt`), 'utf8'));
    const iguales = nuevo.length === viejo.length && nuevo.every((c, i) => Math.abs(c.ini - viejo[i].ini) < 0.01 && Math.abs(c.fin - viejo[i].fin) < 0.01);
    console.log(`${id}: ${iguales ? 'tiempos iguales' : `CAMBIÓ (frases ${viejo.length} -> ${nuevo.length}, primera ${viejo[0]?.ini} -> ${nuevo[0]?.ini})`}`);
  }
}
