/* Diálisis Fácil · fuente única del logo, los íconos y los 40 pasos. CC0 1.0 */
(() => {
  const AZ = '#0A5573', AG = '#8FD8E3', TI = '#0E2A3B';
  const drop = (cx, cy, r) => `M${cx} ${cy - r * 2}C${cx - r * 0.4} ${cy - r * 1.2} ${cx - r} ${cy - r * 0.6} ${cx - r} ${cy}A${r} ${r} 0 0 0 ${cx + r} ${cy}C${cx + r} ${cy - r * 0.6} ${cx + r * 0.4} ${cy - r * 1.2} ${cx} ${cy - r * 2}Z`;
  const P = (d, o) => ['path', { d, ...o }], C = (cx, cy, r, o) => ['circle', { cx, cy, r, ...o }], R = (x, y, width, height, rx, o) => ['rect', { x, y, width, height, rx, ...o }];
  const G = (tx, ty, sc, kids) => ['g', { tx, ty, sc }, kids], D = (a, b, c, o) => P(drop(a, b, c), o);
  const fa = { fill: AG, stroke: 'none' }, fas = { fill: AG }, fk = { fill: 'currentColor', stroke: 'none' }, wh = { fill: '#FFFFFF' }, bold = { strokeWidth: 3.2 };
  const HAND = 'M15 46L12 32L6.5 24.5a2.8 2.8 0 0 1 4.3-3.5L14 25V10a3 3 0 0 1 6 0V22V7a3 3 0 0 1 6 0V22V9a3 3 0 0 1 6 0V23V14a2.5 2.5 0 0 1 5 0V31C37 38 35 42 33 46';
  const flow = (mode) => {
    const on = { strokeWidth: 3.2 }, off = { strokeWidth: 1.6, strokeDasharray: '2 3' };
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
    prensaA: [R(4, 21, 40, 6, 0, fa), P('M4 21h12'), P('M4 27h12'), P('M32 21h12'), P('M32 27h12'), R(16, 13, 16, 22, 5), P('M37 21.5l3 2.5-3 2.5', { strokeWidth: 2 })],
    prensaC: [R(4, 21, 12, 6, 0, fa), P('M4 21h12'), P('M4 27h12'), P('M32 21h12'), P('M32 27h12'), R(16, 13, 16, 22, 5), P('M24 13v22', { strokeWidth: 3.6 })],
    drenar: flow('drenar'), purgar: flow('purgar'), llenar: flow('llenar'),
    bolitas: [C(7, 18, 4.5, wh), P('M18 13.5a4.5 4.5 0 0 0 0 9z', fk), C(18, 18, 4.5), C(29, 18, 4.5), C(29, 18, 1.6, fk), C(40, 18, 4.5, fk), P('M6 33h32'), P('M34 29l4 4-4 4')],
    esperar: [P('M19 12h10c-1 3-3 5-5 6-2-1-4-3-5-6z', fa), P('M18 41c1-4 4-6 6-6s5 2 6 6z', fa), P('M13 5h22'), P('M13 43h22'), P('M16 5c0 9 8 13 8 19s-8 10-8 19'), P('M32 5c0 9-8 13-8 19s8 10 8 19')],
    yodoNuevo: [R(8, 12, 18, 7, 2.5), R(10, 19, 14, 22, 3.5), P('M14 24v13'), P('M17 24v13'), P('M20 24v13'), P('M38 10v12', bold), P('M32 16h12', bold)],
    entregar: [R(4, 16, 12, 5, 2), R(6, 21, 8, 13, 2.5), P('M19 27h8'), P('M24 24l3 3-3 3'), C(37, 12, 5), P('M28 42v-7a9 9 0 0 1 18 0v7')],
    tubo: [R(2, 20, 6, 10, 2), R(40, 20, 6, 10, 2), R(8, 15, 32, 20, 10, wh), P('M24 4v40', { strokeWidth: 3.6 }), C(24, 25, 4, fas)],
    medir: [P('M13 22h20.5l-1.5 18H14.5z', fa), P('M10 8h26l-3 34H13z'), P('M36 14h3a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-4.5'), P('M14 14h5'), P('M14.5 30h5')],
    anotar: [R(7, 5, 24, 38, 3), P('M12 13h14'), P('M12 19h14'), P('M12 25h9'), P('M41 15l-11 17-4.5 2.5.8-5 11-17z', wh), P('M34.5 18.5l4 2.5')],
    basura: [P('M9 13h30'), P('M19 13V8h10v5'), P('M12.5 13l2 29h19l2-29'), P('M20.5 20v15'), P('M27.5 20v15')],
    limpiarBolsa: [R(10, 17, 14, 18, 3, fa), P('M13 8V5.5a4 4 0 0 1 8 0V8'), R(7, 8, 20, 30, 5), P('M17 38v6'), P('M36 9v24'), P('M31.5 28.5l4.5 4.5 4.5-4.5')],
    envolver: [P('M24 5l19 19-19 19L5 24z', fas), R(18.5, 17, 11, 15, 3, wh), R(17, 13, 14, 5, 2, wh)],
    warn: [P('M24 6L44 40H4z'), P('M24 18v10'), P('M24 34v1')],
    wait: [C(24, 24, 18), P('M24 14v10l7 5')]
  };
  const SCHEMES = { primary: { m: AZ, a: AG, l: AZ }, inverse: { m: '#FFFFFF', a: AG, l: 'none' }, mono: { m: TI, a: 'none', l: TI }, white: { m: '#FFFFFF', a: 'none', l: '#FFFFFF' } };
  const LEFT = 'M32 6C25.2 19.6 15 29.8 15 40A17 17 0 0 0 32 57Z', RIGHT = 'M32 6L32 57A17 17 0 0 0 49 40C49 29.8 38.8 19.6 32 6Z';

  const make = (h) => {
    const W = (s) => (s === 'fill' ? '100%' : s);
    const box = (size, o, label) => ({ width: W(size), height: W(size), viewBox: '0 0 64 64', style: { display: 'block' }, ...(o.hidden ? { 'aria-hidden': true } : { role: 'img', 'aria-label': label }) });
    const svg = (name, size = 72, sw = 2.5, under) => {
      const build = (spec, i) => {
        const [t, a = {}, kids] = spec;
        if (t === 'g') return h('g', { key: i, transform: `translate(${a.tx} ${a.ty}) scale(${a.sc})`, strokeWidth: sw / a.sc }, kids.map(build));
        return h(t, { key: i, ...a });
      };
      const kids = ICONS[name].map(build);
      return h('svg', { width: W(size), height: W(size), viewBox: '0 0 48 48', fill: 'none', stroke: 'currentColor', strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, style: { display: 'block' } }, under ? [h('g', { key: 'u' }, under), ...kids] : kids);
    };
    const halves = (scheme = 'primary', o = {}) => {
      const S = SCHEMES[scheme], g = o.sep ?? 1.6, c = o.colors;
      return [
        h('path', { key: 'l', d: LEFT, fill: c ? c[0] : S.m, transform: `translate(${-g} 0)` }),
        h('path', { key: 'r', d: RIGHT, fill: c ? c[1] : S.a, stroke: c ? 'none' : S.l, strokeWidth: 2.5, strokeLinejoin: 'round', transform: `translate(${g} 0)` })
      ];
    };
    const sym = (size, scheme = 'primary', o = {}) => {
      let kids = halves(scheme, o);
      if (o.smile) kids = kids.concat([h('path', { key: 's', d: 'M24 44q8 7 16 0', fill: 'none', stroke: TI, strokeWidth: 3, strokeLinecap: 'round' }), h('circle', { key: 'e1', cx: 25, cy: 33, r: 2.2, fill: '#FFFFFF' }), h('circle', { key: 'e2', cx: 39, cy: 33, r: 2.2, fill: TI })]);
      return h('svg', box(size, o, 'Diálisis Fácil'), o.rot ? h('g', { transform: `rotate(${o.rot} 32 32)` }, kids) : kids);
    };
    const badge = (size, o = {}) => h('svg', box(size, o, 'Diálisis Fácil'),
      h('circle', { cx: 32, cy: 32, r: 32, fill: AZ, opacity: o.alpha ?? 1 }), h('g', { transform: 'translate(10.56 9.6) scale(0.67)', opacity: o.alpha ?? 1 }, halves('inverse')));
    const pasos = (size, scheme = 'primary', o = {}) => {
      const m = scheme === 'inverse' ? '#FFFFFF' : AZ;
      return h('svg', box(size, o, 'Paso a paso'),
        h('g', { transform: 'translate(7.04 -2.68) scale(0.78)' }, halves(scheme)),
        h('circle', { cx: 18, cy: 55, r: 4, fill: m }), h('circle', { cx: 32, cy: 55, r: 4, fill: m }),
        h('circle', { cx: 46, cy: 55, r: 4, fill: AG, stroke: scheme === 'inverse' ? 'none' : m, strokeWidth: 2 }));
    };
    const construction = () => {
      const F = "'Atkinson Hyperlegible Mono', monospace";
      return h('svg', { width: '100%', height: '100%', viewBox: '0 0 120 120', role: 'img', 'aria-label': 'Construcción del logo y espacio libre', style: { display: 'block' } },
        h('rect', { x: 24.4, y: 13, width: 71.2, height: 85, rx: 2, fill: 'none', stroke: '#3D5361', strokeWidth: 0.8, strokeDasharray: '3 3' }),
        h('line', { x1: 60, y1: 6, x2: 60, y2: 104, stroke: '#3D5361', strokeWidth: 0.6, strokeDasharray: '1.5 2.5' }),
        h('g', { transform: 'translate(28 24)' }, halves('primary')),
        h('circle', { cx: 60, cy: 64, r: 17, fill: 'none', stroke: TI, strokeWidth: 0.8, strokeDasharray: '2 2' }),
        h('line', { x1: 60, y1: 64, x2: 77, y2: 64, stroke: TI, strokeWidth: 0.9 }),
        h('text', { x: 66.5, y: 61.5, fontSize: 6.5, fontFamily: F, fontWeight: 700, fill: TI }, 'x'),
        h('path', { d: 'M24.4 103v6M41.4 103v6M24.4 106h17', stroke: TI, strokeWidth: 0.9, fill: 'none' }),
        h('text', { x: 31, y: 116, fontSize: 6.5, fontFamily: F, fontWeight: 700, fill: TI }, 'x'));
    };
    return { svg, halves, sym, badge, pasos, construction };
  };

  const PHASES = [
    ['1', 'Preparación', 'Pasos 1–17', [['calentar', 'Calentar la bolsa con calor seco', 'Paso 1'], ['mascarilla', 'Pelo recogido y mascarilla', 'Paso 2'], ['limpiar', 'Limpiar con alcohol y servilleta', 'Pasos 3, 5, 8, 15'], ['lavado', 'Lavado de manos sencillo', 'Paso 4'], ['lavadoCodo', 'Lavado completo hasta el codo', 'Pasos 6, 16'], ['secar', 'Secar con papel: mano y brazo', 'Pasos 7, 17'], ['gigante', 'Limpiar el gigante', 'Paso 9'], ['yodo', 'Tapón de yodo', 'Pasos 10, 19, 27'], ['limpiarBolsa', 'Limpiar la bolsa de arriba hacia abajo', 'Paso 11'], ['organizador', 'Lavar y colocar el organizador', 'Paso 12'], ['cateter', 'Limpiar el catéter de arriba hacia abajo', 'Paso 13'], ['envolver', 'Envolver el tapón en una servilleta', 'Paso 14'], ['cronometro', '30 segundos por cada parte', 'Paso 16'], ['escurrir', 'Subir las manos y dejarlas escurrir', 'Paso 17']]],
    ['2', 'Conexión', 'Pasos 18–27', [['rezo', 'Manos juntas, en posición de rezo', 'Pasos 18, 33'], ['colgar', 'Abrir y colgar la bolsa', 'Paso 20'], ['disco', 'El reloj en el organizador', 'Paso 21'], ['residuos', 'Bolsa de residuos al piso, estirada', 'Paso 22'], ['conectar', 'Conectar sin tocar', 'Pasos 23, 26'], ['alcohol', 'Alcohol en las manos', 'Pasos 24, 35'], ['desenroscar', 'Desenroscar las dos piezas a la vez', 'Pasos 25, 36']]],
    ['3', 'Drenaje e infusión', 'Pasos 28–34', [['prensaA', 'Abrir la prensa', 'Pasos 28, 32'], ['drenar', 'Drenar: sale el líquido usado', 'Paso 29'], ['esperar', 'Esperar varios minutos', 'Pasos 29, 32, 33'], ['prensaC', 'Cerrar la prensa', 'Pasos 29, 34'], ['purgar', 'Sacar el aire: contar hasta 5', 'Paso 30'], ['bolitas', 'Pasar las bolitas en orden', 'Pasos 31, 34'], ['llenar', 'Llenar: entra el líquido limpio', 'Paso 32']]],
    ['4', 'Desconexión y cierre', 'Pasos 35–40', [['yodoNuevo', 'Cerrar con tapón de yodo nuevo', 'Pasos 36, 37'], ['entregar', 'Entregar al paciente', 'Paso 37'], ['tubo', 'Tubo blanco al centro', 'Paso 38'], ['medir', 'Medir lo que salió', 'Paso 39'], ['anotar', 'Anotar: hora, bolsa, entró y salió', 'Paso 39'], ['basura', 'Basura y lavado de manos', 'Paso 40']]]
  ];

  const GUIDE = [
    ['1', 'Preparación', 'Pasos 1–17', [
      [1, 'calentar', 'Calentar la bolsa:', 'una hora antes, con el reloj hacia abajo, hasta la temperatura del cuerpo. Nunca usarla fría.'],
      [2, 'mascarilla', 'Pelo recogido y mascarilla.', ''],
      [3, 'limpiar', 'Limpiar la manija del lavabo', 'con papel y alcohol.'],
      [4, 'lavado', 'Lavado de manos sencillo', 'con agua y jabón, sin sacudir las manos.'],
      [5, 'limpiar', 'Limpiar la botella de alcohol', 'con una servilleta doblada a la mitad.'],
      [6, 'lavadoCodo', 'Lavado de manos completo hasta el codo:', 'palmas, dorsos, entre los dedos, cada dedo, uñas, yemas y brazo en círculos.'],
      [7, 'secar', 'Secar con papel desechable', 'una mano y su brazo (de la muñeca al codo), luego la otra mano y el otro brazo.'],
      [8, 'limpiar', 'Limpiar la mesa', 'con la servilleta doblada en 4 y alcohol, cambiando de cara para cada zona.'],
      [9, 'gigante', 'Limpiar el gigante', '(el soporte) de la misma forma, incluido el tubo.'],
      [10, 'yodo', 'Limpiar el tapón de yodo:', 'echarle alcohol, secarlo y dejarlo en la esquina de la mesa.'],
      [11, 'limpiarBolsa', 'Limpiar la bolsa de suero', 'de arriba hacia abajo, agarrándola solo por arriba.'],
      [12, 'organizador', 'Lavar el organizador', 'con agua y jabón, con las «orejas» hacia afuera. Secarlo y ponerlo en la orilla con el círculo hacia el paciente.'],
      [13, 'cateter', 'Limpiar el catéter:', 'el tubo azul de arriba hacia abajo con fuerza, y después el tapón.'],
      [14, 'envolver', 'Envolver el tapón en una servilleta', 'y dejarlo sobre la ropa del paciente.'],
      [15, 'limpiar', 'Limpiar otra vez la botella de alcohol', 'antes de devolverla a la mesa.'],
      [16, 'cronometro', 'Lavado de manos guiado:', '30 segundos por cada parte, con el cronómetro de la página.'],
      [17, 'escurrir', 'Secar:', 'subir las manos y dejarlas escurrir sin moverlas. Luego secar manos y brazos en orden con papel desechable, y cerrar la llave del lavabo con papel.']]],
    ['2', 'Conexión', 'Pasos 18–27', [
      [18, 'rezo', 'Tomar la servilleta con las manos juntas,', '«en posición de rezo».'],
      [19, 'yodo', 'Abrir el tapón de yodo', 'y ponerlo en el organizador, con la parte café hacia adentro.'],
      [20, 'colgar', 'Abrir la bolsa jalando fuerte,', 'sujetándola de la manguera. Revisar la fecha de vencimiento, la concentración indicada, que el líquido esté transparente y que no tenga fugas. Ponerla en la mesa con el reloj hacia el paciente y colgarla con cuidado.'],
      [21, 'disco', 'Poner el reloj en el organizador,', 'con lo amarillo al frente y las mangueras a los lados.'],
      [22, 'residuos', 'Bolsa de residuos al piso,', 'bien estirada.'],
      [23, 'conectar', 'Conectar el catéter al organizador', 'sin tocar la servilleta, y dejar caer la servilleta.'],
      [24, 'alcohol', 'Ponerse alcohol en las manos.', ''],
      [25, 'desenroscar', 'Desenroscar a la vez', 'lo amarillo y el catéter.'],
      [26, 'conectar', 'Poner el catéter', 'donde estaba lo amarillo.'],
      [27, 'yodo', 'Retirar el tapón viejo', 'con lo amarillo.']]],
    ['3', 'Drenaje e infusión', 'Pasos 28–34', [
      [28, 'prensaA', 'Abrir la prensa', 'y moverla un poco hacia el organizador para que salga el líquido.'],
      [29, 'drenar', 'Drenar (esperar varios minutos):', 'dejar salir todo el líquido. Poner la mano detrás de la bolsa: si la mano no se ve, el líquido está turbio; guardar la bolsa y llamar a su unidad. Cerrar la prensa.'],
      [30, 'purgar', 'Sacar el aire de la bolsa:', 'pasar al 2 y contar hasta 5.'],
      [31, 'bolitas', 'Pasar las bolitas en orden:', 'a la blanca, despacio a la media luna y despacio a la tercera opción.'],
      [32, 'llenar', 'Dejar entrar el líquido limpio (esperar varios minutos):', 'abrir la prensa blanca del catéter.'],
      [33, 'rezo', 'Mantener la servilleta en posición de rezo', 'hasta que la bolsa se vacíe.'],
      [34, 'prensaC', 'Cerrar la prensa', 'y pasar el reloj por las 4 bolitas hasta la última.']]],
    ['4', 'Desconexión y cierre', 'Pasos 35–40', [
      [35, 'alcohol', 'Ponerse alcohol en las manos.', ''],
      [36, 'desenroscar', 'Desenroscar un poco el yodo nuevo,', 'y luego el yodo y el catéter a la vez.'],
      [37, 'yodoNuevo', 'Conectar el catéter al yodo nuevo,', 'enroscar bien y entregárselo al paciente.'],
      [38, 'tubo', 'Tubo blanco al centro del organizador.', ''],
      [39, 'medir', 'Medir y anotar:', 'cortar la bolsa, medir el líquido (quitar la espuma si hay) y vaciarlo en el inodoro. Anotar fecha, hora, concentración de la bolsa, cuánto entró, cuánto salió y cómo se veía. Si sale menos de lo que entró varias veces seguidas, avisar a su unidad.'],
      [40, 'basura', 'Recoger la basura', 'y lavarse las manos.']]]
  ];

  window.DFMarca = { make, PHASES, GUIDE };
  window.dispatchEvent(new Event('dfmarca-lista'));
})();
