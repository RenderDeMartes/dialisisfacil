// Graba la voz de la guía con Piper (código abierto, corre local) y la deja en audio/*.mp3.
// Usa los mismos textos que la página (assets/js/datos.js). Solo regenera lo que cambió.
//
// Preparar una vez:
//   py -3.12 -m venv tools/.voz/venv
//   tools/.voz/venv/Scripts/python -m pip install piper-tts
//   cd tools/.voz && venv/Scripts/python -m piper.download_voices es_MX-claude-high
// Uso:
//   node tools/generar-voz.mjs
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const voz = join(raiz, 'tools/.voz');
const MODELO = process.env.VOZ_MODELO || 'es_MX-claude-high';
const python = join(voz, process.platform === 'win32' ? 'venv/Scripts/python.exe' : 'venv/bin/python');
const ffmpeg = process.env.FFMPEG || (process.platform === 'win32'
  ? execFileSync('where', ['ffmpeg'], { encoding: 'utf8' }).split(/\r?\n/)[0].trim()
  : 'ffmpeg');

const window = {};
new Function('window', 'localStorage', readFileSync(join(raiz, 'assets/js/datos.js'), 'utf8'))(window, { getItem: () => null });
const { PASOS, LAVADO, AVISOS, AUDIO, textoPaso } = window.DF;

const trabajos = [
  ...PASOS.map((p) => [AUDIO.paso(p.n), textoPaso(p)]),
  ...LAVADO.map((l, i) => [AUDIO.lavado(i), `${l.parte}.`]),
  ...Object.entries(AVISOS).map(([k, t]) => [AUDIO.aviso(k), t])
];

mkdirSync(join(raiz, 'audio'), { recursive: true });
const registro = join(raiz, 'audio/voz.json');
const hechos = existsSync(registro) ? JSON.parse(readFileSync(registro, 'utf8')) : {};
const tmp = join(tmpdir(), 'df-voz.wav');
let n = 0;

for (const [archivo, texto] of trabajos) {
  const huella = createHash('sha1').update(`${MODELO}|${texto}`).digest('hex').slice(0, 12);
  const destino = join(raiz, archivo);
  if (hechos[archivo] === huella && existsSync(destino)) continue;
  execFileSync(python, ['-m', 'piper', '-m', join(voz, `${MODELO}.onnx`), '-f', tmp, '--sentence-silence', '0.35'],
    // En Windows Python lee stdin en cp1252 y se rompe con letras como la «Á».
    { input: texto, cwd: voz, env: { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' } });
  // Mono, volumen parejo y 48 kbps: unos 6 KB por segundo.
  execFileSync(ffmpeg, ['-nostdin', '-hide_banner', '-loglevel', 'error', '-y', '-i', tmp,
    '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '44100', '-ac', '1', '-b:a', '48k', destino]);
  hechos[archivo] = huella;
  n++;
  process.stdout.write(`${archivo}\n`);
}
rmSync(tmp, { force: true });
writeFileSync(registro, JSON.stringify({ _modelo: MODELO, ...hechos }, null, 1) + '\n');
console.log(`${n} audios nuevos de ${trabajos.length}`);
