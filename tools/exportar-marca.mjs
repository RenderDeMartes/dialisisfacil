// Exporta el logo y los íconos de assets/js/marca.js como archivos SVG sueltos
// (colores fijos de la marca) y arma marca/diálisis-fácil-kit.zip para descargar.
//
// Uso: node tools/exportar-marca.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const window = {};
new Function('window', readFileSync(join(raiz, 'assets/js/marca.js'), 'utf8'))(window);
const { icono, gota, NOMBRES } = window.DFMarca;

// En archivo suelto no hay CSS: se cambian las variables por los colores de la marca.
const fijar = (svg, colores) => svg
  .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
  .replace(/ aria-hidden="true" focusable="false"/, '')
  .replace(/var\(--agua\)/g, colores.agua)
  .replace(/var\(--icono-fondo\)/g, colores.fondo)
  .replace(/var\(--logo-a\)/g, colores.logo)
  .replace(/currentColor/g, colores.trazo);

const AZUL = '#0A5573', AGUA = '#8FD8E3', TINTA = '#0E2A3B';
const sal = join(raiz, 'marca/descargas');
rmSync(sal, { recursive: true, force: true });
mkdirSync(join(sal, 'iconos'), { recursive: true });
mkdirSync(join(sal, 'logo'), { recursive: true });

for (const n of NOMBRES) {
  writeFileSync(join(sal, 'iconos', `${n}.svg`), fijar(icono(n), { agua: AGUA, fondo: '#FFFFFF', logo: AZUL, trazo: AZUL }) + '\n');
}
writeFileSync(join(sal, 'logo', 'gota-color.svg'), fijar(gota(), { agua: AGUA, fondo: '#FFFFFF', logo: AZUL, trazo: AZUL }) + '\n');
writeFileSync(join(sal, 'logo', 'gota-blanca.svg'), fijar(gota(), { agua: AGUA, fondo: AZUL, logo: '#FFFFFF', trazo: '#FFFFFF' }).replace(/stroke="#FFFFFF" stroke-width="2.5"/, 'stroke="none"') + '\n');
writeFileSync(join(sal, 'logo', 'gota-una-tinta.svg'), fijar(gota(), { agua: 'none', fondo: '#FFFFFF', logo: TINTA, trazo: TINTA }) + '\n');
writeFileSync(join(sal, 'logo', 'sello-circulo.svg'), readFileSync(join(raiz, 'img/favicon.svg'), 'utf8'));

// Zip con el kit completo (manual, plantillas, logo e íconos).
const zip = join(raiz, 'marca', 'dialisis-facil-kit-de-marca.zip');
rmSync(zip, { force: true });
// bsdtar de Windows (no el tar de Git Bash) sabe escribir .zip con -a.
const tar = process.platform === 'win32' ? join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe') : 'bsdtar';
execFileSync(tar, ['-a', '-c', '-f', 'dialisis-facil-kit-de-marca.zip', 'kit', 'descargas'], { cwd: join(raiz, 'marca'), stdio: 'inherit' });
console.log(`${NOMBRES.length} íconos, 4 logos y ${zip}`);
