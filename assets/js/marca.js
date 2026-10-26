/* Diálisis Fácil · logo e íconos como texto SVG (sin dependencias). CC0 1.0
 * Mismos trazos que el brand kit (marca.js), sin React. */
(() => {
  const AG = 'var(--agua)';
  const drop = (cx, cy, r) => `M${cx} ${cy - r * 2}C${cx - r * 0.4} ${cy - r * 1.2} ${cx - r} ${cy - r * 0.6} ${cx - r} ${cy}A${r} ${r} 0 0 0 ${cx + r} ${cy}C${cx + r} ${cy - r * 0.6} ${cx + r * 0.4} ${cy - r * 1.2} ${cx} ${cy - r * 2}Z`;
  const P = (d, o) => ['path', { d, ...o }], C = (cx, cy, r, o) => ['circle', { cx, cy, r, ...o }], R = (x, y, width, height, rx, o) => ['rect', { x, y, width, height, rx, ...o }];
  const G = (tx, ty, sc, kids) => ['g', { tx, ty, sc }, kids], D = (a, b, c, o) => P(drop(a, b, c), o);
  const fa = { fill: AG, stroke: 'none' }, fas = { fill: AG }, fk = { fill: 'currentColor', stroke: 'none' }, wh = { fill: 'var(--icono-fondo)' }, bold = { 'stroke-width': 3.2 };
  const HAND = 'M15 46L12 32L6.5 24.5a2.8 2.8 0 0 1 4.3-3.5L14 25V10a3 3 0 0 1 6 0V22V7a3 3 0 0 1 6 0V22V9a3 3 0 0 1 6 0V23V14a2.5 2.5 0 0 1 5 0V31C37 38 35 42 33 46';
  const flow = (mode) => {
    const on = { 'stroke-width': 3.2 }, off = { 'stroke-width': 1.6, 'stroke-dasharray': '2 3' };
    return [
      R(7.5, 7, 10, 8, 2, fa), R(5, 3, 15, 14, 3.5),
      ...(mode !== 'llenar' ? [R(7.5, 39, 10, 4, 1.5, fa)] : []),
      R(5, 35, 15, 10, 3.5), C(37, 11, 4.5), P('M28 40v-10a9 9 0 0 1 18 0v10'),
      P('M12.5 17v10', mode !== 'drenar' ? on : off), P('M12.5 27v8', mode !== 'llenar' ? on : off), P('M12.5 27H28.5', mode !== 'purgar' ? on : off),
      C(12.5, 27, 1.8, fk),
      mode === 'llenar' ? P('M25 23.5l3.5 3.5-3.5 3.5', on) : P('M9.5 31.5l3 3 3-3', on)
    ];
  };
  const ICONS = {
    calentar: [P('M12 10V7.5a4 4 0 0 1 8 0V10'), R(9, 19, 14, 16, 3, fa), R(6, 10, 20, 28, 5), P('M16 38v6'), R(33, 5, 9, 26, 4.5), C(37.5, 36, 6, fas), P('M37.5 29V14', bold)],
    mascarilla: [C(24, 7, 3.5), C(24, 21, 12, wh), R(15, 21, 18, 10, 4, fas), P('M15 24h-2.6'), P('M33 24h2.6'), C(19.5, 16, 1.5, fk), C(28.5, 16, 1.5, fk), P('M8 46c0-6 7-9.5 16-9.5s16 3.5 16 9.5')],
    limpiar: [P('M8 35l7-9h25l-7 9z', fas), P('M4 41h40'), P('M12 19c5-4 13-4 18 0'), P('M16 13c3-2 7-2 10 0'), D(39, 14, 3.5, fas)],
    lavado: [P('M4 8h9a5 5 0 0 1 5 5v2'), P('M8.5 8V4.5'), P('M5 4.5h7'), D(18, 22, 1.8, fa), G(14, 12, 0.72, [P(HAND)]), C(41, 9, 2.5), C(35, 5, 1.6)],
    lavadoCodo: [G(11, 0, 0.6, [P(HAND)]), P('M20 27.6L19 46'), P('M30.8 27.6L32 46'), P('M13 36a12 4 0 0 0 24 0'), P('M34 38l3-3 3 3'), C(42, 26, 2), C(8, 30, 1.6)],
    cronometro: [P('M24 28V16a12 12 0 0 1 0 24z', fa), C(24, 28, 15), P('M20 5h8'), P('M24 5v8'), P('M37 15l3-3'), P('M24 28V18', bold)],
    escurrir: [G(8, 0, 0.7, [P(HAND)]), D(18, 38, 2, fa), D(26, 43, 1.7, fa), D(31, 37, 1.5, fa)],
    secar: [P('M6 7h36'), R(10, 7, 28, 10, 5), P('M14 17v23h20V17'), P('M14 40l3.3 2.5 3.3-2.5 3.4 2.5 3.3-2.5 3.4 2.5 3.3-2.5')],
    gigante: [P('M24 9v31'), P('M12 9h24'), P('M12 9v2.5a2.5 2.5 0 0 0 5 0'), P('M36 9v2.5a2.5 2.5 0 0 1-5 0'), P('M13 45l11-5 11 5')],
    yodo: [R(15, 8, 18, 7, 2.5), R(17, 15, 14, 25, 3.5), P('M21 20v15'), P('M24 20v15'), P('M27 20v15')],
    organizador: [R(2, 20, 6, 10, 2), R(40, 20, 6, 10, 2), R(8, 15, 32, 20, 10, wh), C(24, 25, 5, fas)],
    cateter: [P('M6 44c0-12 16-12 16-24v-6'), R(16.5, 5, 11, 9, 2.5), P('M36 9v22'), P('M31.5 26.5l4.5 4.5 4.5-4.5')],
    rezo: [R(13, 33, 22, 11, 2.5, fas), P('M24 5v31'), P('M24 5c-3.5 1.5-6 7-6 14v11l-6 6'), P('M24 5c3.5 1.5 6 7 6 14v11l6 6'), P('M18 24l-3 3v5'), P('M30 24l3 3v5')],
    colgar: [P('M8 46V6'), P('M8 8h22'), P('M30 8v4'), P('M26 14v-.5a4 4 0 0 1 8 0v.5'), R(23, 22, 14, 11, 2.5, fa), R(20, 14, 20, 22, 5), P('M30 36v10'), P('M3 46h10')],
    disco: [C(24, 24, 17), C(24, 24, 4.5, fas), C(14.5, 18.5, 2.2, fk), C(20.2, 13.7, 2.2), C(27.8, 13.7, 2.2), C(33.5, 18.5, 2.2)],
    residuos: [P('M4 44h40'), R(8, 32, 32, 10, 4, fas), P('M24 6v18'), P('M18 18l6 6 6-6')],
    conectar: [R(3, 18, 12, 12, 3), P('M15 24h6', bold), P('M33 21h-4v6h4'), R(33, 18, 12, 12, 3), P('M11 11h7'), P('M15.5 8.5l2.5 2.5-2.5 2.5'), P('M37 11h-7'), P('M32.5 8.5L30 11l2.5 2.5')],
    alcohol: [R(4, 22, 12, 22, 3), P('M10 22v-5'), P('M6 17h8'), P('M14 17h4'), D(18, 24, 1.8, fa), G(18, 12, 0.65, [P(HAND)])],
    desenroscar: [C(24, 24, 5, fas), P('M12 24a12 12 0 0 1 20-9'), P('M32 8v7h-7'), P('M36 24a12 12 0 0 1-20 9'), P('M16 40v-7h7')],
    prensaA: [R(4, 21, 40, 6, 0, fa), P('M4 21h12'), P('M4 27h12'), P('M32 21h12'), P('M32 27h12'), R(16, 13, 16, 22, 5), P('M37 21.5l3 2.5-3 2.5', { 'stroke-width': 2 })],
    prensaC: [R(4, 21, 12, 6, 0, fa), P('M4 21h12'), P('M4 27h12'), P('M32 21h12'), P('M32 27h12'), R(16, 13, 16, 22, 5), P('M24 13v22', { 'stroke-width': 3.6 })],
    drenar: flow('drenar'), purgar: flow('purgar'), llenar: flow('llenar'),
    bolitas: [C(7, 18, 4.5, wh), P('M18 13.5a4.5 4.5 0 0 0 0 9z', fk), C(18, 18, 4.5), C(29, 18, 4.5), C(29, 18, 1.6, fk), C(40, 18, 4.5, fk), P('M6 33h32'), P('M34 29l4 4-4 4')],
    esperar: [P('M19 12h10c-1 3-3 5-5 6-2-1-4-3-5-6z', fa), P('M18 41c1-4 4-6 6-6s5 2 6 6z', fa), P('M13 5h22'), P('M13 43h22'), P('M16 5c0 9 8 13 8 19s-8 10-8 19'), P('M32 5c0 9-8 13-8 19s8 10 8 19')],
    yodoNuevo: [R(8, 12, 18, 7, 2.5), R(10, 19, 14, 22, 3.5), P('M14 24v13'), P('M17 24v13'), P('M20 24v13'), P('M38 10v12', bold), P('M32 16h12', bold)],
    entregar: [R(4, 16, 12, 5, 2), R(6, 21, 8, 13, 2.5), P('M19 27h8'), P('M24 24l3 3-3 3'), C(37, 12, 5), P('M28 42v-7a9 9 0 0 1 18 0v7')],
    tubo: [R(2, 20, 6, 10, 2), R(40, 20, 6, 10, 2), R(8, 15, 32, 20, 10, wh), P('M24 4v40', { 'stroke-width': 3.6 }), C(24, 25, 4, fas)],
    medir: [P('M13 22h20.5l-1.5 18H14.5z', fa), P('M10 8h26l-3 34H13z'), P('M36 14h3a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-4.5'), P('M14 14h5'), P('M14.5 30h5')],
    anotar: [R(7, 5, 24, 38, 3), P('M12 13h14'), P('M12 19h14'), P('M12 25h9'), P('M41 15l-11 17-4.5 2.5.8-5 11-17z', wh), P('M34.5 18.5l4 2.5')],
    basura: [P('M9 13h30'), P('M19 13V8h10v5'), P('M12.5 13l2 29h19l2-29'), P('M20.5 20v15'), P('M27.5 20v15')],
    limpiarBolsa: [R(10, 17, 14, 18, 3, fa), P('M13 8V5.5a4 4 0 0 1 8 0V8'), R(7, 8, 20, 30, 5), P('M17 38v6'), P('M36 9v24'), P('M31.5 28.5l4.5 4.5 4.5-4.5')],
    envolver: [P('M24 5l19 19-19 19L5 24z', fas), R(18.5, 17, 11, 15, 3, wh), R(17, 13, 14, 5, 2, wh)],
    warn: [P('M24 6L44 40H4z'), P('M24 18v10'), P('M24 34v1')],
    wait: [C(24, 24, 18), P('M24 14v10l7 5')]
  };

  const attrs = (o) => Object.entries(o).map(([k, val]) => `${k}="${val}"`).join(' ');
  const build = (sw) => (spec) => {
    const [t, a = {}, kids] = spec;
    if (t === 'g') return `<g transform="translate(${a.tx} ${a.ty}) scale(${a.sc})" stroke-width="${sw / a.sc}">${kids.map(build(sw)).join('')}</g>`;
    return `<${t} ${attrs(a)}/>`;
  };

  // Ícono de paso. Decorativo: el texto del paso siempre lo acompaña.
  const icono = (name, sw = 2.5) =>
    `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${(ICONS[name] || ICONS.wait).map(build(sw)).join('')}</svg>`;

  const LEFT = 'M32 6C25.2 19.6 15 29.8 15 40A17 17 0 0 0 32 57Z', RIGHT = 'M32 6L32 57A17 17 0 0 0 49 40C49 29.8 38.8 19.6 32 6Z';
  // La gota partida. Colores por variables para que siga el tema.
  const gota = () =>
    `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="${LEFT}" fill="var(--logo-a)" transform="translate(-1.6 0)"/><path d="${RIGHT}" fill="var(--agua)" stroke="var(--logo-a)" stroke-width="2.5" stroke-linejoin="round" transform="translate(1.6 0)"/></svg>`;

  window.DFMarca = { icono, gota, NOMBRES: Object.keys(ICONS) };
})();
