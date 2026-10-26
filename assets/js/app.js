/* Diálisis Fácil · la guía web. Sin dependencias. CC0 1.0 */
(() => {
  const { FASES, VIDEOS, PASOS, LAVADO, AVISOS, AUDIO, urlVideo, textoPaso } = window.DF;
  const { icono, gota } = window.DFMarca;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const raiz = document.documentElement;
  const main = $('#principal');
  const TOTAL = PASOS.length;
  const REPO = 'https://github.com/RenderDeMartes/dialisisfacil';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const mmss = (s) => { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const faseDe = (n) => FASES.find((f) => n >= f.desde && n <= f.hasta);
  const videoDe = (id) => VIDEOS.find((v) => v.id === id);

  // ---------- Almacenamiento local (sin cookies). Si el navegador lo bloquea, todo sigue funcionando. ----------
  const leer = (k, def) => { try { const v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } };
  const escribir = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } };

  // ---------- Ajustes ----------
  const DEFECTO = {
    tamano: '1', tema: 'auto', interlineado: '', espaciado: '', movimiento: '',
    leerAuto: '', avisosReloj: 'si', velocidad: '1', motorVoz: 'grabada', voz: '',
    subtitulos: 'si', tamanoSubs: '1', calidad: '1080', pantalla: 'si'
  };
  let A = { ...DEFECTO, ...leer('df-ajustes', {}) };
  const ESCALA = { 1: 1, 2: 1.15, 3: 1.3, 4: 1.5, 5: 1.75 };

  const aplicarAjustes = () => {
    raiz.dataset.tema = A.tema;
    raiz.style.setProperty('--escala', ESCALA[A.tamano] || 1);
    raiz.style.setProperty('--interlineado', A.interlineado === 'amplio' ? 1.9 : 1.6);
    raiz.style.setProperty('--espaciado', A.espaciado === 'amplio' ? '0.06em' : '0.01em');
    raiz.style.setProperty('--palabras', A.espaciado === 'amplio' ? '0.2em' : 'normal');
    raiz.style.setProperty('--subs', A.tamanoSubs);
    if (A.movimiento === 'reducido') raiz.dataset.movimiento = 'reducido'; else delete raiz.dataset.movimiento;
    const tema = { claro: '#0A5573', oscuro: '#0A1F2C', contraste: '#000000' }[A.tema] || '#0A5573';
    $('meta[name="theme-color"]').setAttribute('content', tema);
    $$('video').forEach(ajustarVideo);
    pantallaEncendida();
  };

  const form = $('#form-ajustes');
  const llenarForm = () => {
    for (const el of form.elements) {
      if (!el.name || !(el.name in A)) continue;
      if (el.type === 'radio') el.checked = A[el.name] === el.value;
      else if (el.type === 'checkbox') el.checked = A[el.name] === el.value;
      else el.value = A[el.name];
    }
    $('#velocidad-valor').textContent = String(A.velocidad).replace('.', ',');
  };
  form.addEventListener('input', (e) => {
    const el = e.target;
    if (!el.name || !(el.name in A)) return;
    A[el.name] = el.type === 'checkbox' ? (el.checked ? el.value : '') : el.value;
    escribir('df-ajustes', A);
    $('#velocidad-valor').textContent = String(A.velocidad).replace('.', ',');
    aplicarAjustes();
  });
  form.addEventListener('submit', (e) => e.preventDefault());
  $('#restablecer').addEventListener('click', () => {
    A = { ...DEFECTO }; escribir('df-ajustes', A); llenarForm(); aplicarAjustes(); anunciar('Ajustes restablecidos.');
  });

  const dlgAjustes = $('#ajustes');
  $('#abrir-ajustes').addEventListener('click', () => { llenarForm(); llenarVoces(); dlgAjustes.showModal(); });
  $$('[data-cerrar]', dlgAjustes).forEach((b) => b.addEventListener('click', () => dlgAjustes.close()));
  dlgAjustes.addEventListener('click', (e) => { if (e.target === dlgAjustes) dlgAjustes.close(); });

  // ---------- Anuncios para lectores de pantalla ----------
  const anunciar = (t) => { const a = $('#anuncio'); a.textContent = ''; setTimeout(() => { a.textContent = t; }, 50); };

  // ---------- Voz (texto a voz del navegador) ----------
  const habla = window.speechSynthesis;
  let voces = [];
  const PREFERIDAS = ['es-CR', 'es-MX', 'es-US', 'es-419', 'es-CO', 'es-PA', 'es-GT'];
  const cargarVoces = () => {
    if (!habla) return;
    voces = habla.getVoices().filter((v) => /^es([-_]|$)/i.test(v.lang));
    voces.sort((a, b) => {
      const r = (v) => { const i = PREFERIDAS.indexOf(v.lang.replace('_', '-')); return i < 0 ? (/es-ES/i.test(v.lang) ? 90 : 50) : i; };
      return r(a) - r(b);
    });
  };
  const llenarVoces = () => {
    cargarVoces();
    const sel = $('#voz');
    sel.innerHTML = '<option value="">Automática (español)</option>' +
      voces.map((v) => `<option value="${esc(v.voiceURI)}">${esc(v.name)} · ${esc(v.lang)}</option>`).join('');
    sel.value = A.voz;
    $('#sin-voz').hidden = !!voces.length;
  };
  if (habla) { cargarVoces(); habla.addEventListener?.('voiceschanged', cargarVoces); }

  let hablando = false;
  const alTerminarVoz = new Set();
  const terminoVoz = () => { hablando = false; alTerminarVoz.forEach((g) => g()); alTerminarVoz.clear(); };
  const grabada = new Audio();
  grabada.preload = 'none';
  const callar = () => {
    grabada.onended = grabada.onerror = null;
    grabada.pause();
    habla?.cancel();
    terminoVoz();
  };

  // Voz grabada (audio/…mp3) si está elegida y existe; si no, la voz del navegador.
  const hablar = (texto, alFin, archivo) => {
    callar();
    if (archivo && A.motorVoz !== 'navegador') {
      if (alFin) alTerminarVoz.add(alFin);
      hablando = true;
      grabada.src = archivo;
      grabada.playbackRate = Number(A.velocidad) || 1;
      grabada.onended = terminoVoz;
      grabada.onerror = () => { grabada.onerror = null; hablarNavegador(texto); };
      grabada.play().catch((e) => { if (e.name !== 'AbortError') hablarNavegador(texto); });
      return true;
    }
    return hablarNavegador(texto, alFin);
  };

  // Se parte en frases: algunos navegadores cortan las lecturas largas.
  const hablarNavegador = (texto, alFin) => {
    if (!habla) { anunciar('Este navegador no puede leer en voz alta.'); terminoVoz(); return false; }
    habla.cancel();
    const voz = voces.find((v) => v.voiceURI === A.voz) || voces[0];
    const frases = (texto.replace(/\s+/g, ' ').match(/[^.!?:;]+[.!?:;]*/g) || []).map((f) => f.trim()).filter(Boolean);
    if (alFin) alTerminarVoz.add(alFin);
    hablando = true;
    frases.forEach((f, i) => {
      const u = new SpeechSynthesisUtterance(f);
      u.lang = voz ? voz.lang : 'es-419';
      if (voz) u.voice = voz;
      u.rate = Number(A.velocidad) || 1;
      if (i === frases.length - 1) u.onend = u.onerror = terminoVoz;
      habla.speak(u);
    });
    return true;
  };
  $('#probar-voz').addEventListener('click', () => hablar(AVISOS.prueba, null, AUDIO.aviso('prueba')));

  // ---------- Pantalla encendida (Wake Lock) ----------
  let candado = null;
  const pantallaEncendida = async () => {
    const quiere = A.pantalla === 'si' && document.body.dataset.vista === 'paso' && document.visibilityState === 'visible';
    if (!('wakeLock' in navigator)) return;
    try {
      if (quiere && !candado) { candado = await navigator.wakeLock.request('screen'); candado.addEventListener('release', () => { candado = null; }); }
      else if (!quiere && candado) { await candado.release(); candado = null; }
    } catch (e) { candado = null; }
  };
  document.addEventListener('visibilitychange', pantallaEncendida);

  // ---------- Sonido y vibración para los cronómetros ----------
  let audio = null;
  const pitido = (veces = 1) => {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      for (let i = 0; i < veces; i++) {
        const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime + i * 0.35;
        o.frequency.value = 880; o.connect(g); g.connect(audio.destination);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.3, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        o.start(t); o.stop(t + 0.3);
      }
    } catch (e) { /* sin audio */ }
    navigator.vibrate?.(veces > 1 ? [200, 120, 200, 120, 200] : 200);
  };

  // ---------- Cronómetros ----------
  // Un solo cronómetro activo; sigue corriendo si se cambia de paso.
  const LAVADO_TOTAL = LAVADO.reduce((s, p) => s + p.seg, 0);
  let reloj = null; // { paso, tipo, total, fin, restante, corriendo, parte }
  let intervalo = null;

  const parteLavado = (transcurrido) => {
    let acc = 0;
    for (let i = 0; i < LAVADO.length; i++) { acc += LAVADO[i].seg; if (transcurrido < acc) return i; }
    return LAVADO.length;
  };
  const restante = () => !reloj ? 0 : reloj.corriendo ? Math.max(0, (reloj.fin - Date.now()) / 1000) : reloj.restante;

  const iniciarReloj = (paso) => {
    const p = PASOS[paso - 1];
    const total = p.reloj.tipo === 'lavado' ? LAVADO_TOTAL : p.reloj.seg;
    if (!reloj || reloj.paso !== paso) reloj = { paso, tipo: p.reloj.tipo, total, restante: total, corriendo: false, parte: -1 };
    if (reloj.restante <= 0) reloj.restante = total;
    reloj.fin = Date.now() + reloj.restante * 1000;
    reloj.corriendo = true;
    if (audio?.state === 'suspended') audio.resume();
    clearInterval(intervalo); intervalo = setInterval(tic, 250); tic();
  };
  const pausarReloj = () => { if (!reloj) return; reloj.restante = restante(); reloj.corriendo = false; clearInterval(intervalo); pintarReloj(); };
  const reiniciarReloj = () => { if (!reloj) return; clearInterval(intervalo); reloj = null; pintarReloj(); };

  const tic = () => {
    if (!reloj) return;
    const r = restante();
    if (reloj.tipo === 'lavado') {
      const i = parteLavado(reloj.total - r);
      if (i !== reloj.parte && i < LAVADO.length) {
        reloj.parte = i;
        if (A.avisosReloj === 'si') { pitido(1); setTimeout(() => hablar(LAVADO[i].parte, null, AUDIO.lavado(i)), 350); }
        anunciar(LAVADO[i].parte);
      }
    }
    if (r <= 0 && reloj.corriendo) {
      reloj.corriendo = false; reloj.restante = 0; clearInterval(intervalo);
      const clave = reloj.tipo === 'lavado' ? 'fin-lavado' : 'fin-tiempo', msj = AVISOS[clave];
      if (A.avisosReloj === 'si') { pitido(3); setTimeout(() => hablar(msj, null, AUDIO.aviso(clave)), 1000); }
      anunciar(msj);
    }
    pintarReloj();
  };

  const htmlReloj = (paso) => {
    const p = PASOS[paso - 1];
    const lavado = p.reloj.tipo === 'lavado';
    return `<section class="reloj no-imprimir" id="reloj" aria-labelledby="reloj-titulo">
      <h2 class="oculto" id="reloj-titulo">${lavado ? 'Cronómetro del lavado de manos' : 'Cronómetro'}</h2>
      ${lavado ? '<div class="reloj__parte" id="reloj-parte"></div>' : ''}
      <div class="reloj__tiempo" id="reloj-tiempo" role="timer" aria-live="off"></div>
      ${lavado ? '<div class="reloj__partes" aria-hidden="true">' + LAVADO.map(() => '<span></span>').join('') + '</div><div class="reloj__siguiente" id="reloj-siguiente"></div>'
               : '<div class="reloj__barra" aria-hidden="true"><div></div></div><div class="reloj__siguiente">Tiempo de referencia. Puede tardar más o menos.</div>'}
      <div class="acciones">
        <button type="button" class="btn btn--lleno" id="reloj-iniciar"></button>
        <button type="button" class="btn" id="reloj-reiniciar">↺ Reiniciar</button>
      </div>
    </section>`;
  };

  const pintarReloj = () => {
    const banda = $('#reloj-global');
    const enPaso = Number((location.hash.match(/^#\/paso\/(\d+)/) || [])[1]);
    // Banda arriba cuando el cronómetro corre y se está en otra pantalla.
    if (reloj && (reloj.corriendo || reloj.restante < reloj.total) && enPaso !== reloj.paso) {
      const p = PASOS[reloj.paso - 1];
      banda.hidden = false;
      banda.innerHTML = `<span>⏱ Paso ${p.n} · ${esc(p.titulo)}: <span class="mono">${mmss(restante())}</span>${reloj.corriendo ? '' : ' (en pausa)'}</span>
        <a class="btn btn--chico" href="#/paso/${p.n}">Volver al paso ${p.n}</a>`;
    } else { banda.hidden = true; banda.innerHTML = ''; }

    const caja = $('#reloj');
    if (!caja) return;
    const p = PASOS[enPaso - 1];
    const mio = reloj && reloj.paso === enPaso;
    const total = p.reloj.tipo === 'lavado' ? LAVADO_TOTAL : p.reloj.seg;
    const r = mio ? restante() : total;
    $('#reloj-tiempo', caja).textContent = mmss(r);
    $('#reloj-tiempo', caja).setAttribute('aria-label', `Quedan ${mmss(r).replace(':', ' minutos y ')} segundos`);
    const btn = $('#reloj-iniciar', caja);
    btn.textContent = mio && reloj.corriendo ? '❚❚ Pausar' : (mio && r < total && r > 0 ? '▶ Seguir' : '▶ Iniciar');
    if (p.reloj.tipo === 'lavado') {
      const i = mio ? parteLavado(total - r) : -1;
      $('#reloj-parte', caja).textContent = i < 0 ? 'Listo para empezar' : i >= LAVADO.length ? '¡Terminó! Ahora enjuague.' : LAVADO[i].parte;
      $('#reloj-siguiente', caja).textContent = i >= 0 && i < LAVADO.length - 1 ? `Después: ${LAVADO[i + 1].parte}` : '5 minutos en total. La voz le avisa cada cambio.';
      $$('.reloj__partes span', caja).forEach((s, k) => { s.className = k < i ? 'hecha' : k === i ? 'actual' : ''; });
      caja.dataset.fase = i >= 0 && i % 2 ? 'par' : '';
    } else {
      $('.reloj__barra div', caja).style.width = `${((total - r) / total) * 100}%`;
    }
  };

  // ---------- Video con subtítulos y transcripción ----------
  const vttCache = new Map();
  const tiempoVtt = (t) => { const p = t.split(':').map(Number); return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1]; };
  const leerVtt = async (id) => {
    if (vttCache.has(id)) return vttCache.get(id);
    const txt = await fetch(`subs/${id}.vtt`).then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); });
    const cues = txt.replace(/\r/g, '').split(/\n\n+/).map((b) => {
      const m = b.match(/^([\d:.]+)\s+-->\s+([\d:.]+)[^\n]*\n([\s\S]+)$/);
      return m && { ini: tiempoVtt(m[1]), fin: tiempoVtt(m[2]), texto: m[3].replace(/\n/g, ' ').trim() };
    }).filter(Boolean);
    vttCache.set(id, cues);
    return cues;
  };

  function ajustarVideo(v) {
    const pista = v.textTracks && v.textTracks[0];
    if (pista) pista.mode = A.subtitulos === 'si' ? 'showing' : 'hidden';
  }

  const htmlVideo = (id, { abierta = false } = {}) => {
    const orden = A.calidad === '720' ? ['720', '1080'] : ['1080', '720'];
    return `<div class="pila">
      <div class="video-caja">
        <video controls playsinline preload="metadata" poster="img/videos/${id}.jpg" data-video="${id}">
          ${orden.map((q) => `<source src="${urlVideo(id, q)}" type="video/mp4">`).join('')}
          <track kind="captions" srclang="es" label="Español" src="subs/${id}.vtt" default>
        </video>
      </div>
      <div class="nota nota--alerta" data-error hidden role="alert">${icono('warn', 3)}<p>No se pudo cargar el video. Revise su conexión a internet. Mientras tanto, puede leer lo que dice en la transcripción.</p></div>
      <div class="video-controles no-imprimir">
        <button type="button" class="btn btn--chico" data-vel="0.75" aria-pressed="false">Más lento</button>
        <button type="button" class="btn btn--chico" data-vel="1" aria-pressed="true">Normal</button>
        <button type="button" class="btn btn--chico" data-repetir hidden>↺ Ver este paso otra vez</button>
      </div>
      <details ${abierta ? 'open' : ''}>
        <summary>Leer lo que se dice en el video (transcripción)</summary>
        <div class="transcripcion" data-transcripcion><p class="texto-2">Cargando…</p></div>
      </details>
    </div>`;
  };

  const montarVideo = async (caja, id, desde = 0) => {
    const v = $('video', caja);
    ajustarVideo(v);
    v.addEventListener('loadedmetadata', () => { ajustarVideo(v); if (desde) v.currentTime = desde; }, { once: true });
    const fuentes = $$('source', v);
    fuentes[fuentes.length - 1].addEventListener('error', () => { $('[data-error]', caja).hidden = false; });
    $$('[data-vel]', caja).forEach((b) => b.addEventListener('click', () => {
      v.playbackRate = Number(b.dataset.vel);
      $$('[data-vel]', caja).forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    }));
    const rep = $('[data-repetir]', caja);
    if (desde) { rep.hidden = false; rep.addEventListener('click', () => { v.currentTime = desde; v.play(); }); }

    const lugar = $('[data-transcripcion]', caja);
    try {
      const cues = await leerVtt(id);
      lugar.innerHTML = `<ol>${cues.map((c, i) => `<li><button type="button" data-cue="${i}"><span class="mono">${mmss(c.ini)}</span><span>${esc(c.texto)}</span></button></li>`).join('')}</ol>`;
      lugar.addEventListener('click', (e) => {
        const b = e.target.closest('[data-cue]'); if (!b) return;
        v.currentTime = cues[b.dataset.cue].ini; v.play().catch(() => {});
      });
      let actual = -1;
      v.addEventListener('timeupdate', () => {
        const i = cues.findIndex((c) => v.currentTime >= c.ini && v.currentTime < c.fin);
        if (i === actual || i < 0) return;
        $$('[aria-current]', lugar).forEach((b) => b.removeAttribute('aria-current'));
        const b = $(`[data-cue="${i}"]`, lugar); b.setAttribute('aria-current', 'true');
        if (lugar.closest('details').open) lugar.scrollTo({ top: b.offsetTop - lugar.clientHeight / 2, behavior: raiz.dataset.movimiento ? 'auto' : 'smooth' });
        actual = i;
      });
    } catch (e) {
      lugar.innerHTML = '<p>No se pudo cargar la transcripción.</p>';
    }
  };

  // ---------- Vistas ----------
  const ultimoPaso = () => Number(leer('df-ultimo-paso', 0)) || 0;

  const vistaInicio = () => {
    const ult = ultimoPaso();
    return {
      titulo: 'Diálisis Fácil · Diálisis peritoneal en casa, paso a paso',
      html: `<section class="portada">
        <div class="contenedor pila">
          <h1 tabindex="-1">Diálisis peritoneal en casa, paso a paso.</h1>
          <p>${TOTAL} pasos con videos, subtítulos y voz. Para hacerla entre dos personas: una lee y la otra hace.</p>
          <div class="acciones">
            ${ult > 1 && ult <= TOTAL ? `<a class="btn btn--lleno" href="#/paso/${ult}">Continuar en el paso ${ult}</a><a class="btn" href="#/paso/1">Empezar desde el paso 1</a>`
                                      : '<a class="btn btn--lleno" href="#/paso/1">Empezar la guía</a>'}
            <a class="btn" href="#/videos">Ver los videos</a>
          </div>
        </div>
      </section>
      <div class="contenedor pila pila--grande">
        <section class="pila" aria-labelledby="como">
          <h2 class="titulo-seccion" id="como">Cómo usar la guía</h2>
          <div class="tarjetas">
            <div class="tarjeta"><h3>Una persona lee, la otra hace</h3><p>Quien hace el cambio no toca el teléfono, por las bacterias.</p></div>
            <div class="tarjeta"><h3>Escuche cada paso</h3><p>Toque «Escuchar este paso» o active la lectura automática en Ajustes.</p></div>
            <div class="tarjeta"><h3>Vea cómo se hace</h3><p>Cada paso tiene su parte del video, con subtítulos y el texto completo.</p></div>
            <div class="tarjeta"><h3>A su medida</h3><p>En Ajustes puede agrandar la letra, cambiar los colores y mantener la pantalla encendida.</p></div>
          </div>
        </section>
        <section class="pila" aria-labelledby="fases">
          <h2 class="titulo-seccion" id="fases">Las 4 fases</h2>
          <div class="tarjetas">
            ${FASES.map((f) => `<a class="tarjeta" href="#/paso/${f.desde}"><span class="etiqueta">Fase ${f.n} · Pasos ${f.desde}–${f.hasta}</span><h3>${esc(f.nombre)}</h3></a>`).join('')}
          </div>
        </section>
        <div class="nota nota--info" role="note">${icono('warn', 3)}<p>Esta guía es una ayuda visual y no es oficial. No reemplaza las indicaciones de su médico ni la capacitación de su unidad. Si el líquido sale turbio, llame a su unidad.</p></div>
      </div>`
    };
  };

  const vistaPaso = (n) => {
    const p = PASOS[n - 1];
    const f = faseDe(n);
    const aviso = p.aviso ? `<div class="nota nota--${p.aviso.tipo}" role="note">${icono(p.aviso.tipo === 'alerta' ? 'warn' : 'wait', 3)}<p>${p.aviso.tipo === 'alerta' ? '<b>Atención:</b> ' : ''}${esc(p.aviso.texto)}</p></div>` : '';
    const anterior = n > 1 ? `<a class="btn" href="#/paso/${n - 1}" rel="prev">◀ Anterior</a>` : '<a class="btn" href="#/">◀ Inicio</a>';
    const siguiente = n < TOTAL ? `<a class="btn btn--lleno" href="#/paso/${n + 1}" rel="next">Siguiente ▶</a>` : '<a class="btn btn--lleno" href="#/fin">Terminar ✓</a>';
    return {
      titulo: `Paso ${n}: ${p.titulo} · Diálisis Fácil`,
      vista: 'paso',
      html: `<article class="contenedor paso pila" aria-labelledby="paso-titulo">
        <div class="paso__cabeza"><span class="etiqueta">Fase ${f.n} · ${esc(f.nombre)}</span><span class="etiqueta">Paso ${n} de ${TOTAL}</span></div>
        <div class="progreso" role="progressbar" aria-label="Avance de la guía" aria-valuemin="1" aria-valuemax="${TOTAL}" aria-valuenow="${n}" aria-valuetext="Paso ${n} de ${TOTAL}"><div style="width:${(n / TOTAL) * 100}%"></div></div>
        <div class="paso__cuerpo">
          <div class="paso__icono"><span class="paso__num mono" aria-hidden="true">${n}</span>${icono(p.icono, 2.4)}</div>
          <div class="pila">
            <h1 id="paso-titulo" tabindex="-1"><span class="oculto">Paso ${n}: </span>${esc(p.titulo)}</h1>
            <p class="paso__texto">${esc(p.texto)}</p>
            ${aviso}
            <div class="paso__herramientas no-imprimir">
              <button type="button" class="btn btn--lleno" id="escuchar" aria-pressed="false">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>
                <span>Escuchar este paso</span>
              </button>
              ${p.video ? `<button type="button" class="btn" id="ver-video" aria-expanded="false" aria-controls="video-paso">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/></svg>
                <span>Ver este paso en video</span></button>` : ''}
            </div>
            <div id="video-paso" hidden></div>
            ${p.reloj ? htmlReloj(n) : ''}
          </div>
        </div>
      </article>
      <nav class="navegacion no-imprimir" aria-label="Cambiar de paso"><div>${anterior}${siguiente}</div></nav>`,
      despues: () => montarPaso(n)
    };
  };

  const montarPaso = (n) => {
    const p = PASOS[n - 1];
    escribir('df-ultimo-paso', n);
    const bEsc = $('#escuchar');
    const marcar = (on) => { bEsc.setAttribute('aria-pressed', String(on)); $('span', bEsc).textContent = on ? 'Detener la voz' : 'Escuchar este paso'; };
    bEsc.addEventListener('click', () => {
      if (hablando) { callar(); marcar(false); return; }
      if (hablar(textoPaso(p), () => marcar(false), AUDIO.paso(n))) marcar(true);
    });
    const bVid = $('#ver-video');
    if (bVid) bVid.addEventListener('click', () => {
      const caja = $('#video-paso');
      const abrir = caja.hidden;
      caja.hidden = !abrir;
      bVid.setAttribute('aria-expanded', String(abrir));
      $('span', bVid).textContent = abrir ? 'Ocultar el video' : 'Ver este paso en video';
      if (abrir && !caja.dataset.listo) {
        const vd = videoDe(p.video.id);
        caja.innerHTML = `<p class="etiqueta">Video: ${esc(vd.titulo)} · empieza en ${mmss(p.video.t)}</p>` + htmlVideo(p.video.id);
        caja.dataset.listo = '1';
        montarVideo(caja, p.video.id, p.video.t);
      }
      if (!abrir) $$('video', caja).forEach((v) => v.pause());
    });
    if (p.reloj) {
      $('#reloj-iniciar').addEventListener('click', () => {
        if (reloj && reloj.paso === n && reloj.corriendo) pausarReloj(); else iniciarReloj(n);
      });
      $('#reloj-reiniciar').addEventListener('click', () => { if (reloj && reloj.paso === n) reiniciarReloj(); });
    }
    pintarReloj();
    if (A.leerAuto === 'si' && !$('#aviso').open) { if (hablar(textoPaso(p), () => marcar(false), AUDIO.paso(n))) marcar(true); }
  };

  const vistaPasos = () => ({
    titulo: 'Los 42 pasos · Diálisis Fácil',
    vista: 'pasos',
    html: `<div class="contenedor pila pila--grande">
      <div class="pila">
        <div class="solo-imprimir marca-pdf">${gota()}<b>Diálisis <span>Fácil</span></b><span>dialisisfacil.com</span></div>
        <h1 tabindex="-1" class="titulo-seccion">${TOTAL} pasos para la diálisis peritoneal en casa</h1>
        <p class="texto-2 no-imprimir">Toque un paso para abrirlo. También puede descargar la guía completa en PDF.</p>
        <p class="solo-imprimir">Se hace entre dos personas: una lee los pasos en voz alta y la otra los hace. Esta guía es una ayuda visual y no es oficial: no reemplaza las indicaciones de su médico ni la capacitación de su unidad. Si el líquido sale turbio, llame a su unidad. Videos, voz y cronómetros en dialisisfacil.com.</p>
        <div class="acciones no-imprimir"><a class="btn btn--lleno" href="#/paso/1">Empezar en el paso 1</a><a class="btn" href="descargas/guia-dialisis-facil.pdf" download>Descargar la guía en PDF</a></div>
      </div>
      ${FASES.map((f) => `<section class="fase" aria-labelledby="fase-${f.n}">
        <div class="fase__titulo"><span class="fase__num" aria-hidden="true">${f.n}</span><div><h2 id="fase-${f.n}">${esc(f.nombre)}</h2><span class="etiqueta">Pasos ${f.desde}–${f.hasta}</span></div></div>
        <ol class="lista-pasos">
          ${PASOS.filter((p) => p.fase === f.n).map((p) => `<li><a href="#/paso/${p.n}">
            <span class="mono" aria-hidden="true">${p.n}</span><span class="mini">${icono(p.icono, 2.6)}</span>
            <span><b><span class="oculto">Paso ${p.n}: </span>${esc(p.titulo)}</b><span class="resumen">${esc(p.texto)}</span>${p.aviso ? `<span class="resumen solo-imprimir"><b>${p.aviso.tipo === 'alerta' ? '⚠ Atención:' : '⏱'}</b> ${esc(p.aviso.texto)}</span>` : ''}</span></a></li>`).join('')}
        </ol>
      </section>`).join('')}
    </div>`
  });

  const rangoPasos = (ps) => !ps.length ? 'Antes de empezar' : ps.length === 1 ? `Paso ${ps[0]}` : `Pasos ${ps[0]}–${ps[ps.length - 1]}`;

  const vistaVideos = () => ({
    titulo: 'Videos · Diálisis Fácil',
    vista: 'videos',
    html: `<div class="contenedor pila pila--grande">
      <div class="pila">
        <h1 tabindex="-1" class="titulo-seccion">Videos</h1>
        <p class="texto-2">${VIDEOS.length} videos cortos con una enfermera especialista. Todos tienen subtítulos y el texto completo de lo que se dice.</p>
      </div>
      <ul class="tarjetas" role="list" style="list-style:none;margin:0;padding:0">
        ${VIDEOS.map((v) => `<li><a class="tarjeta" href="#/video/${v.id}">
          <div class="poster"><img src="img/videos/${v.id}.jpg" alt="" loading="lazy" width="640" height="360"><span class="duracion" aria-label="Duración ${mmss(v.dur)}">${mmss(v.dur)}</span></div>
          <span class="etiqueta">${rangoPasos(v.pasos)}</span>
          <h2 style="font-size:1.35rem">${esc(v.titulo)}</h2>
          <p class="texto-2">${esc(v.desc)}</p>
        </a></li>`).join('')}
      </ul>
    </div>`
  });

  const vistaVideo = (id) => {
    const v = videoDe(id);
    if (!v) return vistaNoEncontrada();
    const i = VIDEOS.indexOf(v);
    return {
      titulo: `${v.titulo} · Videos · Diálisis Fácil`,
      vista: 'video',
      html: `<div class="contenedor angosto pila">
        <a href="#/videos" class="no-imprimir">◀ Todos los videos</a>
        <span class="etiqueta">Video ${i + 1} de ${VIDEOS.length} · ${mmss(v.dur)} · ${rangoPasos(v.pasos)}</span>
        <h1 tabindex="-1" class="titulo-seccion">${esc(v.titulo)}</h1>
        <p>${esc(v.desc)}</p>
        <div id="caja-video">${htmlVideo(id, { abierta: true })}</div>
        ${v.pasos.length ? `<section class="pila" aria-labelledby="pasos-video"><h2 id="pasos-video" style="font-size:1.5rem">Pasos de este video</h2>
          <ol class="lista-pasos">${v.pasos.map((n) => { const p = PASOS[n - 1]; return `<li><a href="#/paso/${n}"><span class="mono" aria-hidden="true">${n}</span><span class="mini">${icono(p.icono, 2.6)}</span><span><b><span class="oculto">Paso ${n}: </span>${esc(p.titulo)}</b></span></a></li>`; }).join('')}</ol></section>` : ''}
        <div class="acciones no-imprimir">
          ${i > 0 ? `<a class="btn" href="#/video/${VIDEOS[i - 1].id}">◀ Video anterior</a>` : ''}
          ${i < VIDEOS.length - 1 ? `<a class="btn btn--lleno" href="#/video/${VIDEOS[i + 1].id}">Video siguiente ▶</a>` : ''}
        </div>
      </div>`,
      despues: () => montarVideo($('#caja-video'), id, 0)
    };
  };

  const COLORES = [
    ['Azul Fácil', '#0A5573', 'Botones, enlaces, símbolo y trazo de íconos'], ['Tinta', '#0E2A3B', 'Texto principal'],
    ['Hueso', '#FBF8F2', 'Fondo principal'], ['Pizarra', '#3D5361', 'Texto secundario'],
    ['Agua', '#8FD8E3', 'El líquido en los íconos y las esperas'], ['Ámbar', '#F4B740', 'Solo alertas, siempre con ícono o palabra'],
    ['Bruma', '#E3F4F7', 'Fondo de íconos y barras de avance']
  ];
  const DESCARGAS = 'marca/descargas/';

  const vistaMarca = () => {
    const nombreIcono = (k) => (PASOS.find((p) => p.icono === k) || {}).titulo || k;
    return {
      titulo: 'Marca y colaboración · Diálisis Fácil',
      vista: 'marca',
      html: `<div class="contenedor pila pila--grande">
        <div class="pila">
          <h1 tabindex="-1" class="titulo-seccion">Marca y colaboración</h1>
          <p>Diálisis Fácil es un proyecto abierto. El logo, los íconos, los colores y los textos de la guía son de dominio público (CC0 1.0): cualquier persona o institución puede usarlos, copiarlos y mejorarlos sin pedir permiso.</p>
          <div class="acciones">
            <a class="btn btn--lleno" href="marca/dialisis-facil-kit-de-marca.zip" download>Descargar el kit completo (.zip)</a>
            <a class="btn" href="marca/kit/index.html">Ver el manual de marca</a>
          </div>
        </div>

        <section class="pila" aria-labelledby="m-logo">
          <h2 class="titulo-seccion" id="m-logo">Logo</h2>
          <p class="texto-2">La gota partida: lo usado sale y lo limpio entra. Siempre con el nombre cerca. No se gira, no se le pone cara y no se cambian sus colores.</p>
          <div class="tarjetas">
            ${[['gota-color', 'A color', ''], ['gota-blanca', 'Blanco, sobre azul', 'background:#0A5573'], ['gota-una-tinta', 'Una tinta', ''], ['sello-circulo', 'Sello en círculo', '']].map(([f, t, bg]) => `
              <div class="tarjeta"><div class="poster" style="aspect-ratio:2/1;display:flex;align-items:center;justify-content:center;${bg}"><img src="${DESCARGAS}logo/${f}.svg" alt="" style="height:70%;width:auto"></div>
              <h3>${t}</h3><a href="${DESCARGAS}logo/${f}.svg" download>Descargar SVG<span class="oculto">: logo ${t}</span></a></div>`).join('')}
          </div>
        </section>

        <section class="pila" aria-labelledby="m-color">
          <h2 class="titulo-seccion" id="m-color">Colores</h2>
          <p class="texto-2">Todo el texto cumple contraste AAA (7:1 o más). Nunca se usa solo el color: cada mensaje lleva ícono o palabra.</p>
          <ul class="tarjetas" role="list" style="list-style:none;margin:0;padding:0">
            ${COLORES.map(([n, hex, uso]) => `<li class="tarjeta"><div style="height:4.5rem;border-radius:var(--radio-gota);border:2px solid var(--borde);background:${hex}"></div><h3>${n}</h3><span class="mono">${hex}</span><p class="texto-2">${uso}</p></li>`).join('')}
          </ul>
        </section>

        <section class="pila" aria-labelledby="m-letra">
          <h2 class="titulo-seccion" id="m-letra">Tipografía</h2>
          <p>Atkinson Hyperlegible Next, del Braille Institute, pensada para personas con baja visión. La versión Mono es para números, pasos y tiempos. Es gratuita (SIL Open Font License).</p>
          <div class="acciones"><a class="btn" href="https://fonts.google.com/specimen/Atkinson+Hyperlegible+Next">Atkinson Hyperlegible Next</a><a class="btn" href="https://fonts.google.com/specimen/Atkinson+Hyperlegible+Mono">Atkinson Hyperlegible Mono</a></div>
        </section>

        <section class="pila" aria-labelledby="m-iconos">
          <h2 class="titulo-seccion" id="m-iconos">Íconos</h2>
          <p class="texto-2">Retícula de 48, trazo redondo de 2,5. Azul para los objetos, Agua solo para el líquido. Toque uno para descargarlo en SVG.</p>
          <div class="nota nota--alerta" role="note">${icono('warn', 3)}<p><b>Pendiente:</b> nefrología está revisando que cada ícono muestre bien su paso. <a href="marca/kit/Revision Clinica de Iconos.dc.html" style="color:inherit">Abrir la hoja de revisión</a>.</p></div>
          <ul class="tarjetas" role="list" style="list-style:none;margin:0;padding:0;grid-template-columns:repeat(auto-fill,minmax(min(100%,9rem),1fr))">
            ${window.DFMarca.NOMBRES.filter((k) => !['warn', 'wait', 'esperar', 'entregar'].includes(k)).map((k) => `<li><a class="tarjeta" href="${DESCARGAS}iconos/${k}.svg" download style="align-items:center;text-align:center">
              <span class="paso__icono" style="width:100%;aspect-ratio:1/1">${icono(k, 2.5)}</span><span style="font-size:1rem;font-weight:700">${esc(nombreIcono(k))}</span><span class="oculto">Descargar SVG</span></a></li>`).join('')}
          </ul>
        </section>

        <section class="pila" aria-labelledby="m-colaborar">
          <h2 class="titulo-seccion" id="m-colaborar">Cómo colaborar</h2>
          <div class="tarjetas">
            <div class="tarjeta"><h3>Sugerencias y correcciones</h3><p>¿Un paso no se entiende o encontró un error? Cuéntenos.</p><a href="https://veuxweb.com/es/">Escribir a VEUX</a></div>
            <div class="tarjeta"><h3>Profesionales de salud</h3><p>Ayúdenos a revisar los pasos y los íconos con su experiencia clínica.</p><a href="marca/kit/Revision Clinica de Iconos.dc.html">Hoja de revisión de íconos</a></div>
            <div class="tarjeta"><h3>Código y traducciones</h3><p>La página es código abierto. Puede proponer mejoras, traducciones o adaptarla para su unidad.</p><a href="${REPO}">Ver el proyecto en GitHub</a></div>
          </div>
        </section>
      </div>`
    };
  };

  const vistaFin = () => ({
    titulo: 'Terminó · Diálisis Fácil',
    html: `<div class="contenedor angosto pila pila--grande">
      <div class="paso__icono" style="aspect-ratio:2/1">${icono('anotar', 2.4)}</div>
      <h1 tabindex="-1" class="titulo-seccion">Terminó el cambio</h1>
      <p class="paso__texto">Recuerde anotar fecha, hora, concentración de la bolsa, cuánto entró, cuánto salió y cómo se veía el líquido.</p>
      <div class="nota nota--alerta" role="note">${icono('warn', 3)}<p><b>Llame a su unidad</b> si el líquido salió turbio, si tiene fiebre o dolor de barriga, o si sale menos de lo que entró varias veces seguidas.</p></div>
      <div class="acciones"><a class="btn btn--lleno" href="#/">Volver al inicio</a><a class="btn" href="#/paso/1">Empezar de nuevo</a></div>
    </div>`,
    despues: () => escribir('df-ultimo-paso', 0)
  });

  const vistaNoEncontrada = () => ({
    titulo: 'No encontrado · Diálisis Fácil',
    html: '<div class="contenedor angosto pila"><h1 tabindex="-1" class="titulo-seccion">No encontramos esa página</h1><a class="btn btn--lleno" href="#/">Ir al inicio</a></div>'
  });

  // ---------- Rutas ----------
  let primera = true;
  const rutear = () => {
    callar();
    $$('video').forEach((v) => v.pause());
    const h = location.hash.replace(/^#/, '') || '/';
    let m, vista;
    if (h === '/' || h === '') vista = vistaInicio();
    else if ((m = h.match(/^\/paso\/(\d+)$/)) && +m[1] >= 1 && +m[1] <= TOTAL) vista = vistaPaso(+m[1]);
    else if (h === '/pasos') vista = vistaPasos();
    else if (h === '/videos') vista = vistaVideos();
    else if ((m = h.match(/^\/video\/([\w-]+)$/))) vista = vistaVideo(m[1]);
    else if (h === '/fin') vista = vistaFin();
    else if (h === '/marca') vista = vistaMarca();
    else vista = vistaNoEncontrada();

    document.body.dataset.vista = vista.vista || 'otra';
    document.title = vista.titulo;
    main.innerHTML = vista.html;
    $$('.cabecera nav [data-nav]').forEach((a) => {
      const activo = vista.vista === a.dataset.nav || (a.dataset.nav === 'videos' && vista.vista === 'video');
      if (activo) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (vista.despues) vista.despues();
    pintarReloj();
    pantallaEncendida();
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Al cambiar de pantalla, el foco va al título para que el lector de pantalla lo anuncie.
    if (!primera) { const t = $('h1', main); if (t) t.focus({ preventScroll: true }); }
    primera = false;
  };
  window.addEventListener('hashchange', rutear);

  // Flechas del teclado y deslizar con el dedo en los pasos
  const irPaso = (d) => {
    const m = location.hash.match(/^#\/paso\/(\d+)/);
    if (!m) return;
    const n = +m[1] + d;
    if (n >= 1 && n <= TOTAL) location.hash = `#/paso/${n}`; else if (n > TOTAL) location.hash = '#/fin';
  };
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || $('dialog[open]')) return;
    if (e.target.closest('input, select, textarea, video, [contenteditable]')) return;
    if (e.key === 'ArrowRight') irPaso(1);
    else if (e.key === 'ArrowLeft') irPaso(-1);
  });
  let toque = null;
  main.addEventListener('touchstart', (e) => {
    toque = e.target.closest('video, input, .transcripcion, .reloj') ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  main.addEventListener('touchend', (e) => {
    if (!toque) return;
    const dx = e.changedTouches[0].clientX - toque.x, dy = e.changedTouches[0].clientY - toque.y;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 50) irPaso(dx < 0 ? 1 : -1);
    toque = null;
  }, { passive: true });

  // ---------- Aviso inicial ----------
  // Sale siempre al entrar a la página: hay que aceptarlo para usar la guía.
  const dlgAviso = $('#aviso');
  $$('[data-icono]', dlgAviso).forEach((s) => { s.outerHTML = icono(s.dataset.icono, 3); });
  const mostrarAviso = () => { dlgAviso.returnValue = ''; dlgAviso.showModal(); };
  dlgAviso.addEventListener('close', () => {
    // Si se cerró sin elegir un botón (Escape, gesto de atrás), vuelve a salir.
    if (!dlgAviso.returnValue) { mostrarAviso(); return; }
    if (dlgAviso.returnValue === 'video') location.hash = '#/video/00-aviso-importante';
  });
  dlgAviso.addEventListener('cancel', (e) => e.preventDefault());

  // ---------- Arranque ----------
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  $('#logo-cabecera').outerHTML = gota();
  llenarForm();
  aplicarAjustes();
  rutear();
  mostrarAviso();

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => { /* sin modo sin conexión */ });
  }
})();
