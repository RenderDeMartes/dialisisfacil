const { useComposition, CompositionStage, Easing, animate } = window;
const INK = '#0E2A3B', BLUE = '#0A5573', BONE = '#FBF8F2', AGUA = '#8FD8E3', SLATE = '#3D5361';
const FONT = "'Atkinson Hyperlegible Next', system-ui, sans-serif", MONO = "'Atkinson Hyperlegible Mono', monospace";
const dropPath = (cx, cy, r) => `M${cx} ${cy - r * 2}C${cx - r * 0.4} ${cy - r * 1.2} ${cx - r} ${cy - r * 0.6} ${cx - r} ${cy}A${r} ${r} 0 0 0 ${cx + r} ${cy}C${cx + r} ${cy - r * 0.6} ${cx + r * 0.4} ${cy - r * 1.2} ${cx} ${cy - r * 2}Z`;
const MOTION = {
  enter: (s, e) => animate({ from: 0, to: 1, start: s, end: e, ease: Easing.easeOutCubic }),
  pop: (s, e) => animate({ from: 0, to: 1, start: s, end: e, ease: Easing.easeOutBack }),
  glide: (s, e) => animate({ from: 0, to: 1, start: s, end: e, ease: Easing.easeInOutCubic }),
};
const lerp = (a, b, p) => a + (b - a) * p;

function Symbol({ a, b, m }) {
  return (<g>
    <path d="M32 6C25.2 19.6 15 29.8 15 40A17 17 0 0 0 32 57Z" fill={BLUE} style={{ transform: `translate(-1.6px, ${(1 - a) * -40 * m}px)`, opacity: a }} />
    <path d="M32 6L32 57A17 17 0 0 0 49 40C49 29.8 38.8 19.6 32 6Z" fill={AGUA} stroke={BLUE} strokeWidth="2.5" strokeLinejoin="round" style={{ transform: `translate(1.6px, ${(1 - b) * 40 * m}px)`, opacity: b }} />
  </g>);
}

function Piece({ title, subtitle, series, reduced }) {
  const { T, CUES, authoredTotal } = useComposition();
  const m = reduced ? 0 : 1;
  const a = (reduced ? MOTION.enter : MOTION.pop)(0.1, CUES.Marca - 0.5)(T);
  const b = MOTION.enter(0.5, CUES.Marca)(T);
  const move = MOTION.glide(CUES.Marca, CUES.Marca + 1)(T);
  const word = MOTION.enter(CUES.Marca + 0.5, CUES.Titulo)(T);
  const t1 = MOTION.enter(CUES.Titulo, CUES.Titulo + 0.8)(T);
  const t2 = MOTION.enter(CUES.Titulo + 0.4, CUES.Titulo + 1.2)(T);
  const t3 = MOTION.enter(CUES.Titulo + 0.8, CUES.Titulo + 1.6)(T);
  const out = 1 - MOTION.enter(CUES.Salida, authoredTotal - 0.1)(T);
  const size = lerp(300, 128, move), x = lerp(960 - 150, 140, move), y = lerp(540 - 150, 130, move);
  const rise = (p) => ({ opacity: p, transform: `translateY(${(1 - p) * 40 * m}px)` });
  return (
    <div style={{ position: 'absolute', inset: 0, background: BONE, fontFamily: FONT, color: INK, opacity: out }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 14, background: BLUE, transformOrigin: 'left', transform: `scaleX(${reduced ? 1 : move})` }} />
      <svg width={size} height={size} viewBox="0 0 64 64" style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
        <Symbol a={a} b={b} m={m} />
      </svg>
      <div style={{ position: 'absolute', left: 300, top: 140, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 52, lineHeight: 1, fontWeight: 800, opacity: word, transform: `translateX(${(1 - word) * -30 * m}px)` }}>
        <span>Diálisis</span><span style={{ color: BLUE }}>Fácil</span>
      </div>
      <div style={{ position: 'absolute', left: 140, top: 420, width: 1560, display: 'flex', flexDirection: 'column', gap: 36 }}>
        <div style={{ ...rise(t1), display: 'flex', alignItems: 'center', gap: 20, fontFamily: MONO, fontSize: 36, fontWeight: 700, color: BLUE }}>
          <span style={{ width: 48, height: 8, borderRadius: 4, background: BLUE }} />{series}
        </div>
        <div style={{ ...rise(t2), fontSize: 120, lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.01em', textWrap: 'balance' }}>{title}</div>
        <div style={{ ...rise(t3), fontSize: 52, lineHeight: 1.3, fontWeight: 500, color: SLATE, textWrap: 'pretty', maxWidth: 1300 }}>{subtitle}</div>
      </div>
      <div style={{ position: 'absolute', left: 140, bottom: 60, fontFamily: MONO, fontSize: 26, color: SLATE, opacity: t3 }}>No reemplaza las indicaciones de su médico · CC0</div>
    </div>
  );
}

function IntroVideo(props) {
  return (
    <CompositionStage width={1920} height={1080} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={BONE}>
      <Piece title={props.title} subtitle={props.subtitle} series={props.series} reduced={!!props.reduced} />
    </CompositionStage>
  );
}
window.IntroVideo = IntroVideo;
