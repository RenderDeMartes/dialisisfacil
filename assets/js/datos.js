/* Diálisis Fácil · contenido de la guía: fases, 42 pasos y videos. CC0 1.0
 *
 * Cada paso:
 *   n, fase, icono (de marca.js), titulo, texto
 *   aviso:  { tipo: 'espera' | 'alerta', texto }   (opcional)
 *   reloj:  { tipo: 'lavado' } | { tipo: 'cuenta', seg }   (opcional)
 *   video:  { id, t }  id de VIDEOS y segundo donde empieza este paso (opcional)
 */
(() => {
  // Dónde viven los videos. Se cambia solo aquí si se mueven.
  const ARCHIVO = 'https://archive.org/download/dialisisfacil/';

  const FASES = [
    { n: 1, nombre: 'Preparación', desde: 1, hasta: 19 },
    { n: 2, nombre: 'Conexión', desde: 20, hasta: 29 },
    { n: 3, nombre: 'Drenaje e infusión', desde: 30, hasta: 36 },
    { n: 4, nombre: 'Desconexión y cierre', desde: 37, hasta: 42 }
  ];

  const VIDEOS = [
    { id: '00-aviso-importante', titulo: 'Aviso importante', dur: 26, pasos: [],
      desc: 'La enfermera recuerda que este video es una guía: antes de hacer la diálisis en casa, el paciente y su familiar deben completar la capacitación en la unidad.' },
    { id: '01-limpiar-el-cuarto', titulo: 'Limpiar el cuarto', dur: 57, pasos: [1],
      desc: 'Cómo debe ser el cuarto de la diálisis y cómo limpiarlo: el cielo raso y las paredes, de arriba hacia abajo, con jabón, agua y desinfectante.' },
    { id: '02-calentar-la-bolsa', titulo: 'Calentar la bolsa', dur: 39, pasos: [2],
      desc: 'Cómo calentar la bolsa de líquido en el calentador una hora antes de empezar, con las mangueras hacia abajo.' },
    { id: '03-reunir-materiales-y-presion', titulo: 'Reunir materiales y tomar la presión', dur: 34, pasos: [3],
      desc: 'Qué materiales tener listos (bolsa, alcohol, organizador y tapón de yodo) y la toma de presión arterial antes de cada diálisis.' },
    { id: '04-lavado-de-manos-sencillo', titulo: 'Lavado de manos sencillo', dur: 63, pasos: [6],
      desc: 'El primer lavado de manos del procedimiento: palmas, dorsos, entre los dedos y yemas. Cómo escurrir sin sacudir y secarse con una servilleta.' },
    { id: '05-limpiar-la-botella-de-alcohol', titulo: 'Limpiar la botella de alcohol', dur: 35, pasos: [7],
      desc: 'Cómo limpiar la botella de alcohol de arriba hacia abajo, en círculos y sin devolverse, para poder tocarla después con las manos limpias.' },
    { id: '06-lavado-de-manos-completo', titulo: 'Lavado de manos completo, hasta el codo', dur: 140, pasos: [8, 9],
      desc: 'El segundo lavado de manos, con todos los pasos y hasta el codo. Cómo enjuagar de los dedos hacia el codo y secar mano y brazo sin devolverse.' },
    { id: '07-limpiar-la-mesa-y-el-gigante', titulo: 'Limpiar la mesa y el gigante', dur: 88, pasos: [10, 11],
      desc: 'Cómo usar una servilleta doblada en cuatro para limpiar la mesa y el gigante (el soporte de la bolsa), una cara por zona.' },
    { id: '08-limpiar-el-yodo-y-la-bolsa', titulo: 'Limpiar el tapón de yodo y la bolsa', dur: 79, pasos: [12, 13],
      desc: 'Cómo limpiar con alcohol el tapón de yodo y la bolsa de líquido, en zigzag y sin devolverse, antes de ponerlos en la mesa.' },
    { id: '09-lavar-el-organizador', titulo: 'Lavar el organizador', dur: 64, pasos: [14],
      desc: 'Cómo lavar y secar el organizador y colocarlo pegado a la orilla de la mesa.' },
    { id: '10-limpiar-el-cateter', titulo: 'Limpiar el catéter', dur: 53, pasos: [15, 16, 17],
      desc: 'Cómo limpiar el catéter del paciente sin jalarlo de la piel, envolver el tapón y volver a limpiar la botella de alcohol.' },
    { id: '11-lavado-de-manos-de-5-minutos', titulo: 'Lavado de manos de 5 minutos', dur: 390, pasos: [18, 19, 20],
      desc: 'El tercer lavado de manos, de 5 minutos con reloj: qué parte lavar en cada minuto, cómo enjuagar y secar, y qué no se debe tocar después.' },
    { id: '12-abrir-y-colgar-la-bolsa', titulo: 'Abrir el yodo y colgar la bolsa', dur: 89, pasos: [21, 22, 23, 24],
      desc: 'Inicio de la diálisis: abrir el tapón de yodo, abrir y revisar la bolsa, colgarla en el gigante y poner el reloj en el organizador.' },
    { id: '13-conectar-y-drenar', titulo: 'Conectar al paciente y drenar', dur: 77, pasos: [25, 26, 27, 28, 29, 30, 31],
      desc: 'Cómo conectar el catéter del paciente al organizador, retirar el tapón viejo y abrir la prensa para que salga el líquido usado.' },
    { id: '14-dejar-entrar-el-liquido', titulo: 'Dejar entrar el líquido limpio', dur: 53, pasos: [32, 33, 34, 35],
      desc: 'Cómo sacar el aire de la bolsa, pasar las bolitas del reloj en orden y abrir la prensa para que entre el líquido limpio.' },
    { id: '15-desconectar', titulo: 'Desconectar al paciente', dur: 70, pasos: [36, 37, 38, 39],
      desc: 'Cómo cerrar la prensa, pasar el reloj a la bolita 4 y desconectar el catéter con el tapón de yodo nuevo.' },
    { id: '16-medir-el-liquido-y-recoger', titulo: 'Revisar y medir el líquido', dur: 76, pasos: [41, 42],
      desc: 'Cómo revisar si el líquido drenado está transparente o turbio, medirlo, desecharlo y recoger todo al final.' }
  ];

  const P = (n, fase, icono, titulo, texto, extra = {}) => ({ n, fase, icono, titulo, texto, ...extra });
  const v = (id, t = 0) => ({ video: { id, t } });

  const PASOS = [
    // 1 · Preparación
    P(1, 1, 'limpiar', 'Limpiar el cuarto',
      'El cuarto debe estar cerrado, con cielo raso y paredes que se puedan limpiar, un lavamanos, una mesa y el gigante. Limpie con jabón, agua y desinfectante: primero el cielo raso, después las paredes de arriba hacia la mitad y luego de la mitad hacia abajo.',
      v('01-limpiar-el-cuarto', 16)),
    P(2, 1, 'calentar', 'Calentar la bolsa',
      'Una hora antes de empezar, ponga la bolsa en el calentador con el reloj y las mangueras hacia abajo, para que llegue a la temperatura del cuerpo. Nunca use la bolsa fría.',
      { aviso: { tipo: 'espera', texto: 'Una hora antes' }, ...v('02-calentar-la-bolsa', 1.8) }),
    P(3, 1, 'anotar', 'Reunir materiales y tomar la presión',
      'Tenga a mano la bolsa ya caliente, el alcohol, el organizador y el tapón de yodo. Tome la presión arterial del paciente para llevar el control en cada diálisis.',
      v('03-reunir-materiales-y-presion', 0.8)),
    P(4, 1, 'mascarilla', 'Pelo recogido y mascarilla',
      'Recójase el pelo y póngase la mascarilla (cubrebocas). Uñas cortas, sin esmalte, sin anillos ni pulseras.'),
    P(5, 1, 'limpiar', 'Limpiar la manija del lavabo',
      'Con papel y alcohol, limpie la manija o la llave del lavabo donde se va a lavar las manos.'),
    P(6, 1, 'lavado', 'Lavado de manos sencillo',
      'Con agua y jabón lave las palmas, los dorsos, entre los dedos, el dedo gordo y las yemas. Deje escurrir sin sacudir las manos y séquese con una servilleta: una cara para cada mano.',
      v('04-lavado-de-manos-sencillo', 1)),
    P(7, 1, 'limpiar', 'Limpiar la botella de alcohol',
      'Con una servilleta doblada a la mitad y alcohol, limpie la botella de arriba hacia abajo, en círculos y sin devolverse. Dele vuelta para limpiar el fondo, sin sostenerla de la parte ya limpia.',
      v('05-limpiar-la-botella-de-alcohol', 1.1)),
    P(8, 1, 'lavadoCodo', 'Lavado de manos completo',
      'Mójese hasta el codo. Lave en orden: palmas, dorsos, entre los dedos por dentro y por fuera, cada dedo, las uñas, las yemas y el brazo de la muñeca al codo, en círculos. Enjuague de los dedos hacia el codo y deje las manos hacia arriba.',
      v('06-lavado-de-manos-completo', 0.3)),
    P(9, 1, 'secar', 'Secar manos y brazos',
      'Con papel desechable, seque una mano (palma, entre los dedos y dorso) y luego ese brazo hasta el codo, en círculos y sin devolverse. Después, la otra mano y el otro brazo.',
      v('06-lavado-de-manos-completo', 100.9)),
    P(10, 1, 'limpiar', 'Limpiar la mesa',
      'Doble una servilleta en cuatro y póngale alcohol. Pase cada cara una sola vez, de lo más lejos a lo más cerca, dando vuelta a la servilleta. Con la última cara limpie el borde.',
      v('07-limpiar-la-mesa-y-el-gigante', 0.5)),
    P(11, 1, 'gigante', 'Limpiar el gigante',
      'Con otra servilleta doblada en cuatro y alcohol, limpie el gigante (el soporte) de un extremo al otro con una cara. Con otra cara, hasta la mitad, junto con el tornillo. Con la última, hacia abajo, sin devolverse.',
      v('07-limpiar-la-mesa-y-el-gigante', 52.7)),
    P(12, 1, 'yodo', 'Limpiar el tapón de yodo',
      'Báñelo en alcohol por ambos lados y séquelo con una servilleta. Envuélvalo y déjelo en una esquina de la mesa, sin abrirlo.',
      v('08-limpiar-el-yodo-y-la-bolsa', 7.5)),
    P(13, 1, 'limpiarBolsa', 'Limpiar la bolsa',
      'Con una servilleta doblada a la mitad y alcohol, limpie la bolsa en zigzag de arriba hacia abajo, sin devolverse. Dele vuelta y limpie el otro lado. Póngala en la mesa y limpie el borde por donde la sostenía.',
      v('08-limpiar-el-yodo-y-la-bolsa', 27.4)),
    P(14, 1, 'organizador', 'Lavar el organizador',
      'Lávelo con agua y jabón por arriba y por abajo, con las ventosas bien talladas y las «orejas» hacia afuera. Séquelo y péguelo en la orilla de la mesa, con la parte redonda hacia el paciente.',
      v('09-lavar-el-organizador', 0.1)),
    P(15, 1, 'cateter', 'Limpiar el catéter',
      'Con una servilleta doblada en cuatro y alcohol, tome el tubo azul cerca de la piel, sin jalarlo, y límpielo con fuerza de arriba hacia abajo. Después limpie bien el tapón.',
      v('10-limpiar-el-cateter', 0.1)),
    P(16, 1, 'envolver', 'Envolver el tapón',
      'Envuelva el tapón con el otro lado de la servilleta, sin tocarlo, y déjelo sobre la ropa del paciente.',
      v('10-limpiar-el-cateter', 21.8)),
    P(17, 1, 'limpiar', 'Limpiar otra vez la botella',
      'Limpie de nuevo la botella de alcohol, de arriba hacia abajo y en círculos, y déjela en la esquina de la mesa.',
      v('10-limpiar-el-cateter', 30.5)),
    P(18, 1, 'cronometro', 'Lavado de manos de 5 minutos',
      'Mójese los brazos y tome suficiente jabón. Use el cronómetro: le dice qué parte lavar y cuándo cambiar. Al final, enjuague de los dedos hacia el codo, con las manos hacia arriba.',
      { reloj: { tipo: 'lavado' }, ...v('11-lavado-de-manos-de-5-minutos', 0.4) }),
    P(19, 1, 'escurrir', 'Escurrir y secar',
      'Suba las manos y déjelas escurrir sin moverlas. Seque una mano y su brazo, luego la otra mano y el otro brazo. Cierre la llave del lavabo con papel.',
      { aviso: { tipo: 'alerta', texto: 'Desde ahora no se toque la mascarilla, el pelo ni la ropa. Si lo hace, repita el lavado de 5 minutos.' }, ...v('11-lavado-de-manos-de-5-minutos', 310.5) }),

    // 2 · Conexión
    P(20, 2, 'rezo', 'Tomar la servilleta',
      'Doble una servilleta y sosténgala con las manos juntas, «en posición de rezo». Le recuerda no tocar nada que no esté limpio.',
      v('11-lavado-de-manos-de-5-minutos', 374.6)),
    P(21, 2, 'yodo', 'Abrir el tapón de yodo',
      'Ábralo por la pestaña, sujetándolo de la parte blanca, y póngalo en el organizador con la parte café hacia adentro.',
      v('12-abrir-y-colgar-la-bolsa', 6.6)),
    P(22, 2, 'colgar', 'Abrir y colgar la bolsa',
      'Ábrala jalando fuerte hacia abajo desde la ranura y sujete todas las mangueras como una pinza. Revise la fecha de vencimiento, la concentración, que el líquido esté transparente y que la bolsa no esté rota. Cuélguela en el gigante.',
      v('12-abrir-y-colgar-la-bolsa', 33.2)),
    P(23, 2, 'disco', 'Poner el reloj en el organizador',
      'Sostenga el reloj con una mano y extienda la bolsa con la otra, sin que toque la ropa. Ponga el reloj en el organizador, con lo amarillo al frente y las mangueras a los lados.',
      v('12-abrir-y-colgar-la-bolsa', 58.8)),
    P(24, 2, 'residuos', 'Bolsa de residuos al piso',
      'Deje la bolsa de residuos en el piso, bien estirada.',
      v('12-abrir-y-colgar-la-bolsa', 75.2)),
    P(25, 2, 'conectar', 'Conectar el catéter al organizador',
      'Tome la punta del catéter sin tocar la servilleta ni la ropa y conéctela al otro lado del organizador. Deje caer la servilleta.',
      v('13-conectar-y-drenar', 2.3)),
    P(26, 2, 'alcohol', 'Alcohol en las manos',
      'Póngase alcohol en las manos.',
      v('13-conectar-y-drenar', 18.8)),
    P(27, 2, 'desenroscar', 'Desenroscar a la vez',
      'Desenrosque al mismo tiempo lo amarillo y el catéter.',
      v('13-conectar-y-drenar', 30.2)),
    P(28, 2, 'conectar', 'Pasar el catéter al centro',
      'Rápido, ponga el catéter en el centro, donde estaba lo amarillo, y enrosque.',
      v('13-conectar-y-drenar', 34.1)),
    P(29, 2, 'yodo', 'Retirar el tapón viejo',
      'Con lo amarillo, retire el tapón viejo y apártelo para no confundirse.',
      v('13-conectar-y-drenar', 40.2)),

    // 3 · Drenaje e infusión
    P(30, 3, 'prensaA', 'Abrir la prensa',
      'El reloj viene en la bolita 1, para drenar. Abra la prensa, con el piquito hacia abajo, y muévala un poco hacia el organizador para que el catéter no quede prensado.',
      v('13-conectar-y-drenar', 49.2)),
    P(31, 3, 'drenar', 'Drenar',
      'Deje salir todo el líquido usado. Cuando termine, cierre la prensa.',
      { aviso: { tipo: 'alerta', texto: 'Ponga la mano detrás de la bolsa. Si no ve los dedos, el líquido está turbio: guarde la bolsa y llame a su unidad.' },
        reloj: { tipo: 'cuenta', seg: 20 * 60 }, ...v('13-conectar-y-drenar', 60.3) }),
    P(32, 3, 'purgar', 'Sacar el aire',
      'Pase el reloj al 2 y cuente hasta 5.',
      v('14-dejar-entrar-el-liquido', 16.7)),
    P(33, 3, 'bolitas', 'Pasar las bolitas en orden',
      'Pase a la bolita blanca. Después, despacio a la media luna y despacio a la tercera.',
      v('14-dejar-entrar-el-liquido', 23.2)),
    P(34, 3, 'llenar', 'Dejar entrar el líquido limpio',
      'En la tercera, abra otra vez la prensa, con el piquito hacia abajo, y muévala un poco. El líquido limpio entra al paciente.',
      { aviso: { tipo: 'espera', texto: 'Espere varios minutos' }, reloj: { tipo: 'cuenta', seg: 20 * 60 }, ...v('14-dejar-entrar-el-liquido', 32.8) }),
    P(35, 3, 'rezo', 'Esperar con la servilleta',
      'Mantenga la servilleta en las manos, en posición de rezo, hasta que la bolsa se vacíe. No toque nada.',
      v('14-dejar-entrar-el-liquido', 43.8)),
    P(36, 3, 'prensaC', 'Cerrar la prensa',
      'Cuando termine de entrar el líquido, cierre la prensa. Pase el reloj hasta la bolita 4, hasta que pegue: sale un seguro azul que empuja el yodo.',
      v('15-desconectar', 0.3)),

    // 4 · Desconexión y cierre
    P(37, 4, 'alcohol', 'Alcohol en las manos',
      'Póngase alcohol en las manos.',
      v('15-desconectar', 22.5)),
    P(38, 4, 'desenroscar', 'Desenroscar el yodo nuevo',
      'Desenrosque un poco el yodo nuevo, hasta que suene. Luego desenrosque a la vez el yodo y el catéter.',
      v('15-desconectar', 27.1)),
    P(39, 4, 'yodoNuevo', 'Cerrar con el yodo nuevo',
      'Enrosque bien el catéter en el yodo nuevo y entrégueselo al paciente. Tape bien el centro del organizador para que no se derrame el líquido usado.',
      v('15-desconectar', 51.9)),
    P(40, 4, 'tubo', 'Tubo blanco al centro',
      'Ponga el tubo blanco en el centro del organizador.'),
    P(41, 4, 'medir', 'Revisar, medir y anotar',
      'Ponga la mano detrás de la bolsa: si ve los dedos, el líquido está bien, aunque sea amarillo. Corte la bolsa, mida el líquido con un pichel que use solo para eso y vacíelo en el inodoro. Anote fecha, hora, concentración de la bolsa, cuánto entró, cuánto salió y cómo se veía.',
      { aviso: { tipo: 'alerta', texto: 'Si no ve los dedos, el líquido está turbio: puede haber infección. Llame a su unidad. Avise también si sale menos de lo que entró varias veces seguidas.' }, ...v('16-medir-el-liquido-y-recoger', 11.5) }),
    P(42, 4, 'basura', 'Recoger y lavarse las manos',
      'Recoja la basura en orden y lávese las manos.',
      v('16-medir-el-liquido-y-recoger', 1.5))
  ];

  // Lavado de 5 minutos, igual que en el video: 30 s por parte, 15 s por mano en yemas y brazos.
  const LAVADO = [
    ['Palmas', 30], ['Dorsos: 15 segundos cada mano', 30],
    ['Entre los dedos, por dentro', 30], ['Entre los dedos, por fuera: 15 segundos cada mano', 30],
    ['Dedos de una mano, uno por uno', 30], ['Dedos de la otra mano', 30],
    ['Uñas de una mano, por arriba y por abajo', 30], ['Uñas de la otra mano', 30],
    ['Yemas de una mano', 15], ['Yemas de la otra mano', 15],
    ['Un brazo, de la muñeca al codo, en círculos', 15], ['El otro brazo', 15]
  ].map(([parte, seg]) => ({ parte, seg }));

  const urlVideo = (id, calidad) => `${ARCHIVO}${id}-${calidad}.mp4`;

  window.DF = { FASES, VIDEOS, PASOS, LAVADO, urlVideo };
})();
