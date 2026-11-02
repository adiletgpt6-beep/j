import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import type { SceneMap, SceneProps } from "../types";
import { colors, W, H } from "../theme";
import { Caption, Note } from "../components/Text";
import { Camera } from "../components/Camera";
import { LogoLockup, BrandChip } from "../components/Brand";
import { pop, prog, linear, wordFrame, floatY, sway } from "../components/anim";
import { Sky, Mountains, Ground, Sparkles, House, Yurt, Tree, Sapling, Well, Book, Canvas, Person, Card, SvgText } from "../illustrations";
import { Flame, Cup, Shelf, Blackboard, Table, Brick, Tap, LightFrame, Stars, StarOrnament, Apple } from "../illustrations/extra-02-03";
import { SoftBackground, Badge } from "../scenes/common";

const t = (lang: "ky" | "ru", ky: string, ru: string) => (lang === "ky" ? ky : ru);
/** Make a list of keyframes strictly increasing (speech-derived beats may be close or out of order) */
const monoFix = (arr: number[], gap = 2) => {
  const out: number[] = [];
  for (let i = 0; i < arr.length; i++) out.push(i === 0 ? arr[i] : Math.max(arr[i], out[i - 1] + gap));
  return out;
};

/* 1. Hook: an elder plants a sapling; time-lapse of suns and moons; children rest under the grown tree */
const Hook: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const plantAt = wordFrame(scene, t(lang, "отургузат", "сажает"), 0.06);
  const yearsAt = wordFrame(scene, t(lang, "жылдар", "годы"), 0.4);
  const kidsAt = wordFrame(scene, t(lang, "балдар", "дети"), 0.62);
  const lapseEnd = Math.max(yearsAt + 40, kidsAt - 6);
  const lapse = prog(frame, yearsAt, lapseEnd, Easing.inOut(Easing.quad));
  const cycles = 3;
  const a = 0.7 + lapse * cycles * Math.PI * 2; // 0..π day, π..2π night
  const sunX = 540 - Math.cos(a) * 560;
  const sunY = 820 - Math.sin(a) * 380;
  const moonX = 540 - Math.cos(a + Math.PI) * 560;
  const moonY = 820 - Math.sin(a + Math.PI) * 380;
  const night = Math.max(0, -Math.sin(a));
  const plant = pop(frame, plantAt, { damping: 13 });
  const grow = 0.3 + 0.7 * lapse;
  const sapOpacity = 1 - prog(frame, yearsAt + 10, yearsAt + 40);
  const elder = 1 - prog(frame, yearsAt + 15, yearsAt + 55);
  const kids = pop(frame, kidsAt, { damping: 13 });
  return (
    <AbsoluteFill>
      <Camera duration={durationInFrames} from={{ scale: 1.05 }} to={{ scale: 1.12, y: -20 }}>
        <Sky mode="day" />
        <Canvas>
          {/* sun & moon on their arcs */}
          <g opacity={1 - night * 0.6}>
            <circle cx={sunX} cy={sunY} r={90} fill={colors.gold} opacity={0.18} />
            <circle cx={sunX} cy={sunY} r={58} fill={colors.gold} />
          </g>
          <g opacity={night}>
            <circle cx={moonX} cy={moonY} r={80} fill="#F6E7B8" opacity={0.15} />
            <circle cx={moonX} cy={moonY} r={46} fill="#F6E7B8" />
            <circle cx={moonX + 18} cy={moonY - 8} r={38} fill={`rgba(21,33,58,${night})`} />
          </g>
          <g opacity={night}>
            <Stars frame={frame} count={30} maxY={700} />
          </g>
        </Canvas>
        <Mountains y={720} parallax={0.06} />
        <Ground y={1080} />
        <AbsoluteFill style={{ background: "#15213A", opacity: night * 0.5, pointerEvents: "none" }} />
        <Canvas>
          <House x={190} y={1130} scale={0.6} wall="#F3E4C8" roof={colors.terracotta} lit={night > 0.3} />
          <Yurt x={930} y={1160} scale={0.5} />
          <Tree x={60} y={1200} scale={0.7} sway={sway(frame, 1.5, 150)} />
          {/* elder */}
          <g opacity={elder}>
            <Person x={420} y={1210} scale={0.85} hat="kalpak" outfit="#3F6B8E" outfit2="#2F4A6B" skin={colors.skin2} armR={-60 + plant * 15} armL={10} bob={floatY(frame, 2, 90)} />
          </g>
          {elder < 1 && (
            <g opacity={(1 - elder) * (0.6 + 0.4 * Math.sin(frame / 12))}>
              <circle cx={420} cy={1020} r={120} fill={colors.gold} opacity={0.18} />
              <Flame x={420} y={1000 + floatY(frame, 6, 60)} scale={1.1} />
            </g>
          )}
          {/* sapling → tree */}
          <g opacity={sapOpacity}>
            <Sapling x={600} y={1215} scale={1.2 * plant} />
          </g>
          <g opacity={1 - sapOpacity}>
            <Tree x={600} y={1215} scale={1.15} grow={grow} sway={sway(frame, 1.2, 160)} />
          </g>
          {/* shade */}
          <ellipse cx={600} cy={1218} rx={220 * grow * (1 - sapOpacity)} ry={18} fill="#1E3250" opacity={0.14} />
          {/* children */}
          {kidsAt > 0 && (
            <g opacity={kids}>
              <Person x={500} y={1222} scale={0.9} child outfit="#D9A24A" skin={colors.skin1} sit bob={floatY(frame, 2, 70)} />
              <Person x={720} y={1222} scale={0.9} child outfit="#C98BA4" skin={colors.skin2} sit flip bob={floatY(frame, 2, 80, 20)} />
              <Person x={610} y={1222} scale={0.85} child outfit="#6E8F6B" skin={colors.skin3} hat="cap" hatColor={colors.brandSoft} bob={floatY(frame, 3, 60, 40)} />
            </g>
          )}
        </Canvas>
        {kids > 0.5 && <Sparkles x={600} y={1000} count={12} spread={160} start={kidsAt} />}
      </Camera>
      <Caption text={scene.caption ?? ""} delay={10} size={84} top={230} />
      <BrandChip delay={4} />
    </AbsoluteFill>
  );
};

/* 2. Hadith: deeds stop — except three glowing cards */
const Hadith: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const labels = scene.labels ?? [];
  const diesAt = wordFrame(scene, t(lang, "өлгөндө", "умирает"), 0.25);
  const threeAt = wordFrame(scene, t(lang, "үчөөнөн", "трёх"), 0.4);
  const c1 = wordFrame(scene, t(lang, "садака", "садаки"), 0.52);
  const c2 = wordFrame(scene, t(lang, "илим", "знания"), 0.65);
  const c3 = wordFrame(scene, t(lang, "перзент", "ребёнка"), 0.78);
  const muslimAt = wordFrame(scene, "муслим", 0.92);
  const n = 12;
  const lit = linear(frame, 8, diesAt);
  const dim = prog(frame, diesAt, diesAt + 20);
  const three = prog(frame, threeAt, threeAt + 16);
  const cardAt = [c1, c2, c3];
  const icons = [
    (s: number) => <Tap x={-10} y={70} scale={0.8 * s} flow={1} frame={frame} />,
    (s: number) => <Book x={0} y={0} scale={0.42 * s} color={colors.gold} />,
    (s: number) => <Person x={0} y={86} scale={0.39 * s} hat="cap" hatColor={colors.brandSoft} outfit={colors.terracotta} skin={colors.skin2} armL={150} armR={-150} />,
  ];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0A4A2C 0%, #0D3B26 60%, #0A2E1E 100%)" }}>
      <Canvas>
        {/* drifting ornaments */}
        {Array.from({ length: 7 }).map((_, i) => (
          <StarOrnament key={i} x={(i * 173 + 90) % W} y={520 + ((i * 251) % 800) + floatY(frame, 10, 160, i * 30)} r={26} color="#fff" opacity={0.05} rotate={frame * 0.2 * (i % 2 ? 1 : -1)} />
        ))}
        {/* deeds strip */}
        {Array.from({ length: n }).map((_, i) => {
          const on = lit * n > i + 0.5 ? 1 : 0.15;
          const keep = i === 3 || i === 6 || i === 9;
          const o = on * (1 - dim) + (keep ? (0.15 + three * 0.85) : 0.12) * dim;
          const yy = 470 + (keep ? -three * 10 : 0);
          return (
            <g key={i} transform={`translate(${150 + i * 70} ${yy})`}>
              {keep && three > 0 && <circle r={26} fill={colors.gold} opacity={0.3 * three} />}
              <circle r={12} fill={keep && dim > 0.5 ? colors.gold : "#CFE3D6"} opacity={o} />
            </g>
          );
        })}
        <line x1={120} y1={470} x2={120 + 800 * lit} y2={470} stroke="#CFE3D6" strokeWidth={3} opacity={0.25 * (1 - dim)} />
        {/* cards */}
        {cardAt.map((at, i) => {
          const pre = pop(frame, 16 + i * 8, { damping: 15 });
          const lit = pop(frame, at, { damping: 14, stiffness: 100 });
          const s = pre;
          const y = 600 + i * 205;
          const glow = (0.5 + 0.5 * Math.sin(frame / 14 + i)) * lit;
          return (
            <g key={i} transform={`translate(0 ${(1 - s) * 40})`} opacity={0.3 + 0.7 * lit}>
              <rect x={90} y={y - 90} width={900} height={180} rx={36} fill={colors.gold} opacity={0.12 * lit + glow * 0.06} />
              <Card x={540} y={y} w={900} h={180} color="rgba(255,255,255,0.08)" stroke="rgba(224,169,58,0.7)" shadow={false}>
                <g transform="translate(-320 0)">
                  <circle r={78} fill="rgba(224,169,58,0.18)" />
                  {icons[i](0.85 + 0.15 * lit)}
                </g>
                <SvgText x={-200} y={14} size={40} weight={900} color="#FFF4D6" anchor="start">
                  {labels[i] ?? ""}
                </SvgText>
                <circle cx={-410} cy={-58} r={22} fill={colors.gold} />
                <SvgText x={-410} y={-49} size={26} weight={900} color={colors.brandDeep}>
                  {String(i + 1)}
                </SvgText>
              </Card>
            </g>
          );
        })}
      </Canvas>
      {cardAt.map((at, i) => frame > at && <Sparkles key={i} x={220} y={600 + i * 205 - 40} count={8} spread={60} start={at} size={5} />)}
      <Caption text={scene.caption ?? ""} delay={6} size={80} color="#FFF4D6" />
      {scene.note && <Note text={scene.note} delay={muslimAt} />}
    </AbsoluteFill>
  );
};

/* 3. Examples: 2×2 grid — clean water, orchard, book, schooling; sparks rise as people use them */
const Examples: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const labels = scene.labels ?? [];
  const at = [
    wordFrame(scene, t(lang, "суу", "вода"), 0.05),
    wordFrame(scene, t(lang, "бак", "сад"), 0.16),
    wordFrame(scene, t(lang, "китеп", "книга"), 0.26),
    wordFrame(scene, t(lang, "окуусуна", "обучение"), 0.36),
  ];
  const everyAt = wordFrame(scene, t(lang, "кимдир", "каждый"), 0.5);
  const rewardAt = wordFrame(scene, t(lang, "сооб", "награда"), 0.85);
  const cells = [
    [310, 640],
    [770, 640],
    [310, 1030],
    [770, 1030],
  ];
  const use = prog(frame, everyAt, everyAt + 20);
  const reward = pop(frame, rewardAt, { damping: 14 });
  const drink = 0.5 + 0.5 * Math.sin(frame / 15);
  return (
    <SoftBackground glow="#E3F0E6">
      <Caption text={scene.caption ?? ""} delay={4} size={64} />
      <Canvas>
        {cells.map(([cx, cy], i) => {
          const s = pop(frame, at[i], { damping: 14 });
          return (
            <g key={i} transform={`translate(${cx} ${cy + (1 - s) * 40}) scale(${0.9 + 0.1 * s})`} opacity={s}>
              <Card x={0} y={0} w={430} h={350} color="#fff" stroke={colors.mint}>
                {/* mini scene */}
                {i === 0 && (
                  <g>
                    <path d="M-215 90 Q-100 60 0 90 T215 90 L215 110 L-215 110 Z" fill="#9DBF8A" />
                    <House x={-120} y={70} scale={0.35} wall="#F3E4C8" roof={colors.terracotta} />
                    <House x={130} y={76} scale={0.3} wall="#EFE3D0" roof="#8FA5B5" />
                    <Tap x={-10} y={100} scale={0.75} flow={1} frame={frame} />
                    {use > 0 && <Person x={90} y={100} scale={0.6 * use} child outfit="#D9A24A" skin={colors.skin2} armR={-120 + drink * 20} />}
                  </g>
                )}
                {i === 1 && (
                  <g>
                    <path d="M-215 100 Q-100 70 0 100 T215 100 L215 110 L-215 110 Z" fill="#7FA86C" />
                    <Tree x={-120} y={100} scale={0.55} sway={sway(frame, 1.5, 140)} />
                    <Tree x={0} y={110} scale={0.65} sway={sway(frame, 1.5, 160, 30)} />
                    <Tree x={120} y={100} scale={0.55} sway={sway(frame, 1.5, 150, 60)} />
                    {[-140, -100, -20, 20, 100, 140, 0].map((ax, k) => (
                      <Apple key={k} x={ax} y={k % 2 ? -60 : -95} r={10} />
                    ))}
                    {use > 0 && <Person x={90} y={108} scale={0.5 * use} hat="scarf" hatColor="#C98BA4" outfit="#7D4E6B" skin={colors.skin1} armR={-130} />}
                  </g>
                )}
                {i === 2 && (
                  <g>
                    <Table x={0} y={70} w={300} h={22} legs={false} />
                    <Book x={0} y={10 + floatY(frame, 3, 80)} scale={0.6} />
                    <StarOrnament x={-40} y={10 + floatY(frame, 3, 80)} r={14} />
                    <StarOrnament x={40} y={10 + floatY(frame, 3, 80)} r={14} />
                    {use > 0 && <Person x={130} y={110} scale={0.75 * use} child outfit="#3F6B8E" skin={colors.skin3} sit armR={-80} />}
                  </g>
                )}
                {i === 3 && (
                  <g>
                    <Blackboard x={-70} y={-90} w={200} h={120} chalk={linear(frame, at[3] + 10, at[3] + 70)} />
                    <Table x={70} y={70} w={200} h={22} legs={false} />
                    <Person x={70} y={110} scale={0.7} child outfit="#6E8F6B" skin={colors.skin2} hat="cap" hatColor={colors.gold} sit armR={-70} />
                    {use > 0 && <Person x={170} y={120} scale={0.55 * use} hat="hijab" hatColor="#C98BA4" outfit={colors.brand} skin={colors.skin1} armR={-110} flip />}
                  </g>
                )}
                {/* label */}
                <rect x={-200} y={118} width={400} height={50} rx={25} fill={i % 2 ? colors.brandSoft : colors.brand} />
                <SvgText x={0} y={153} size={32} weight={900} color="#fff">
                  {labels[i] ?? ""}
                </SvgText>
              </Card>
            </g>
          );
        })}
        {/* reward lights */}
        {rewardAt > 0 &&
          cells.map(([cx, cy], i) => <Flame key={i} x={cx + 170} y={cy - 150 - reward * 20 + floatY(frame, 4, 60, i * 20)} scale={0.6 * reward} opacity={reward} />)}
      </Canvas>
      {everyAt > 0 && cells.map(([cx, cy], i) => <Sparkles key={i} x={cx} y={cy - 120} count={8} spread={150} start={everyAt + i * 6} size={6} />)}
    </SoftBackground>
  );
};

/* 4. Story: a village library — the teacher arranges books; years later, children still read there */
const Story: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const openAt = wordFrame(scene, t(lang, "китепкана", "библиотеку"), 0.4);
  const goneAt = wordFrame(scene, t(lang, "жок", "нет"), 0.52);
  const kidsAt = wordFrame(scene, t(lang, "балдар", "дети"), 0.58);
  const exampleAt = wordFrame(scene, t(lang, "чыныгы", "поучительный"), 0.82);
  const fill = linear(frame, 10, openAt + 20);
  const teacher = 1 - prog(frame, goneAt, goneAt + 30);
  const frameS = pop(frame, goneAt + 20, { damping: 13 });
  const kids = pop(frame, kidsAt + 6, { damping: 14 });
  const placing = Math.sin(frame / 10);
  const dayShift = prog(frame, goneAt - 10, goneAt + 40);
  return (
    <AbsoluteFill style={{ background: "#F4E9D6" }}>
      <Camera duration={durationInFrames} from={{ scale: 1.03 }} to={{ scale: 1.09, x: 10 }}>
        {/* window with view */}
        <Canvas>
          <defs>
            <clipPath id="lib-window">
              <rect x={660} y={520} width={300} height={260} rx={20} />
            </clipPath>
          </defs>
          <g clipPath="url(#lib-window)">
            <rect x={660} y={520} width={300} height={260} fill={`rgb(${220 - dayShift * 20}, ${238 - dayShift * 40}, ${246 - dayShift * 50})`} />
            <circle cx={720 + dayShift * 180} cy={590 - Math.sin(dayShift * Math.PI) * 40} r={30} fill={colors.gold} />
            <path d="M640 760 L720 640 L790 700 L860 610 L940 690 L980 660 L980 790 L640 790Z" fill="#A9BFCD" />
            <path d="M640 790 L760 720 L880 760 L980 720 L980 800 L640 800Z" fill="#7E9AAE" />
          </g>
          <rect x={660} y={520} width={300} height={260} rx={20} fill="none" stroke="#B97A48" strokeWidth={14} />
          <line x1={810} y1={520} x2={810} y2={780} stroke="#B97A48" strokeWidth={10} />
          <line x1={660} y1={650} x2={960} y2={650} stroke="#B97A48" strokeWidth={10} />
          {/* floor */}
          <rect x={0} y={1130} width={W} height={H - 1130} fill="#C9A882" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1={0} y1={1150 + i * 40} x2={W} y2={1150 + i * 40} stroke="#B98F66" strokeWidth={3} opacity={0.6} />
          ))}
          {/* rug */}
          <rect x={300} y={1150} width={480} height={60} rx={10} fill={colors.terracotta} opacity={0.9} />
          <rect x={320} y={1162} width={440} height={36} rx={8} fill="none" stroke={colors.gold} strokeWidth={4} opacity={0.8} />
          {/* shelves */}
          <rect x={100} y={500} width={440} height={640} rx={12} fill="#A66E3F" />
          <Shelf x={120} y={640} width={400} count={Math.round(fill * 9)} seed={0} />
          <Shelf x={120} y={790} width={400} count={Math.round(Math.max(0, fill * 9 - 3))} seed={3} />
          <Shelf x={120} y={960} width={400} count={Math.round(Math.max(0, fill * 9 - 5))} seed={5} />
          <Shelf x={120} y={1130} width={400} count={Math.round(Math.max(0, fill * 9 - 2))} seed={7} />
          {/* light frame on the top shelf (after) */}
          <g opacity={frameS}>
            <LightFrame x={330} y={572 + (1 - frameS) * 30} scale={0.9 * frameS} glow={0.7 + 0.3 * Math.sin(frame / 12)} />
          </g>
          {/* teacher */}
          <g opacity={teacher}>
            <Person x={660} y={1130} scale={0.86} hat="kalpak" outfit="#6E8F6B" outfit2="#4A5A60" skin={colors.skin2} armR={-120 + placing * 10} armL={10} flip bob={floatY(frame, 2, 100)} />
            <g transform={`translate(514 ${857 + placing * 6}) rotate(-20)`}>
              <Book x={0} y={0} scale={0.3} open={false} color={colors.terracotta} />
            </g>
          </g>
          {/* children later */}
          {kidsAt > 0 && (
            <g opacity={kids}>
              <Person x={640} y={1130} scale={1} child outfit="#D9A24A" skin={colors.skin1} sit armR={-80} bob={floatY(frame, 2, 80)} />
              <Person x={820} y={1130} scale={1} child outfit="#3F6B8E" skin={colors.skin3} hat="scarf" hatColor="#C98BA4" sit flip armR={-80} bob={floatY(frame, 2, 90, 30)} />
              <Table x={720} y={1000} w={280} h={24} />
              <Book x={720} y={980} scale={0.38} />
              <Book x={880} y={1070 + floatY(frame, 2, 70)} scale={0.3} open={false} color={colors.brandSoft} />
            </g>
          )}
          {/* dust motes */}
          {Array.from({ length: 16 }).map((_, i) => {
            const seed = (i * 5471 + 7) % 1000;
            const x = 560 + ((seed * 0.5 + frame * (0.2 + (seed % 3) * 0.1)) % 480);
            const y = 560 + ((seed * 0.8 + frame * 0.3) % 560);
            return <circle key={i} cx={x} cy={y} r={3} fill={colors.gold} opacity={0.25 + 0.2 * Math.sin(frame / 10 + i)} />;
          })}
        </Canvas>
        {frameS > 0.5 && <Sparkles x={330} y={540} count={8} spread={50} start={goneAt + 20} size={5} />}
      </Camera>
      <Badge text={scene.caption ?? ""} delay={2} />
      <Caption text={t(lang, "Айыл китепканасы", "Сельская библиотека")} delay={6} size={60} top={230} />
      {exampleAt > 0 && <Note text={t(lang, "Сабак берүүчү мисал, тарыхый окуя эмес", "Поучительный пример, не историческое событие")} delay={exampleAt - 10} />}
    </AbsoluteFill>
  );
};

/* 5. Chain: a glowing thread passes from person to person */
const bez = (p0: number[], p1: number[], p2: number[], p3: number[], u: number) => {
  const m = 1 - u;
  return [m * m * m * p0[0] + 3 * m * m * u * p1[0] + 3 * m * u * u * p2[0] + u * u * u * p3[0], m * m * m * p0[1] + 3 * m * m * u * p1[1] + 3 * m * u * u * p2[1] + u * u * u * p3[1]];
};
const Chain: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const raw = [
    wordFrame(scene, t(lang, "кыз", "девочка"), 0.3),
    wordFrame(scene, t(lang, "мугалим", "учителем"), 0.5),
    wordFrame(scene, t(lang, "окуучу", "ученик"), 0.66),
    wordFrame(scene, t(lang, "кудук", "колодец"), 0.86),
  ].sort((a, b) => a - b);
  const [girlAt, teacherAt, studentAt, wellAt] = raw;
  const P = [
    [210, 660],
    [800, 660],
    [250, 1080],
    [830, 1080],
  ];
  const segs = [
    [P[0], [400, 560], [600, 760], P[1]],
    [P[1], [1000, 760], [60, 900], P[2]],
    [P[2], [400, 1200], [700, 1200], P[3]],
  ];
  const progress = interpolate(frame, monoFix([8, girlAt, teacherAt, studentAt, wellAt, wellAt + 24]), [0, 0.05, 1, 2, 2.7, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pts: number[][] = [];
  for (let s = 0; s < 3; s++) {
    const local = Math.min(1, Math.max(0, progress - s));
    const steps = Math.floor(local * 40);
    for (let k = 0; k <= steps; k++) pts.push(bez(segs[s][0], segs[s][1], segs[s][2], segs[s][3], k / 40));
    if (local < 1) break;
  }
  const head = pts[pts.length - 1] ?? P[0];
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const s1 = pop(frame, Math.min(girlAt, 16), { damping: 13 });
  const s2 = pop(frame, teacherAt, { damping: 13 });
  const s3 = pop(frame, studentAt, { damping: 13 });
  const s4 = pop(frame, wellAt + 20, { damping: 13 });
  const well = pop(frame, wellAt, { damping: 13, stiffness: 90 });
  const drink = 0.5 + 0.5 * Math.sin(frame / 12);
  return (
    <SoftBackground tint="#F7EFE3" glow="#FBE3C8">
      <Caption text={scene.caption ?? ""} delay={4} size={64} />
      <Canvas>
        {/* station platforms */}
        {P.map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y + 130} rx={150} ry={22} fill={colors.brandDeep} opacity={0.08 * [s1, s2, s3, s4][i]} />
        ))}
        {/* thread */}
        {pts.length > 1 && (
          <g>
            <path d={d} fill="none" stroke={colors.gold} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" opacity={0.2} />
            <path d={d} fill="none" stroke={colors.gold} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
            <path d={d} fill="none" stroke="#FFF3CF" strokeWidth={3} strokeLinecap="round" strokeDasharray="10 26" strokeDashoffset={-frame * 3} />
          </g>
        )}
        {progress < 3 && (
          <g>
            <circle cx={head[0]} cy={head[1]} r={26} fill={colors.gold} opacity={0.35} />
            <circle cx={head[0]} cy={head[1]} r={12} fill="#FFF3CF" />
          </g>
        )}
        {/* 1: girl with a book */}
        <g transform={`translate(${P[0][0]} ${P[0][1] + 120}) scale(${s1})`} opacity={s1}>
          <Person x={0} y={0} scale={1.05} child outfit="#C98BA4" skin={colors.skin1} hat="scarf" hatColor="#E0A93A" armR={-110} armL={-110} bob={floatY(frame, 2, 80)} />
          <Book x={30} y={-150 + floatY(frame, 2, 80)} scale={0.22} open={false} color={colors.brand} />
        </g>
        {/* 2: she teaches at the blackboard */}
        <g transform={`translate(${P[1][0]} ${P[1][1] + 120}) scale(${s2})`} opacity={s2}>
          <Blackboard x={40} y={-230} w={240} h={140} chalk={linear(frame, teacherAt + 10, teacherAt + 60)} />
          <Person x={-120} y={0} scale={0.62} hat="hijab" hatColor="#E0A93A" outfit="#C98BA4" skin={colors.skin1} armR={-120} bob={floatY(frame, 2, 90)} />
          <Person x={60} y={0} scale={0.8} child outfit="#3F6B8E" skin={colors.skin2} sit bob={floatY(frame, 2, 70, 20)} />
          <Person x={150} y={0} scale={0.8} child outfit="#6E8F6B" skin={colors.skin3} sit bob={floatY(frame, 2, 80, 40)} />
        </g>
        {/* 3: the student digs a well */}
        <g transform={`translate(${P[2][0]} ${P[2][1] + 120}) scale(${s3})`} opacity={s3}>
          <Person x={-110} y={0} scale={0.64} hat="cap" hatColor={colors.brandSoft} outfit="#3F6B8E" skin={colors.skin2} armR={-70 + Math.sin(frame / 6) * 10} bob={floatY(frame, 2, 70)} />
          <g transform={`translate(${-110 + 52 * 0.64} ${-250 * 0.64}) rotate(${-70 + Math.sin(frame / 6) * 10}) translate(0 ${136 * 0.64})`}>
            <rect x={-4} y={-10} width={8} height={120} fill="#8C6A52" />
            <path d="M-18 110 L18 110 L10 140 L-10 140 Z" fill="#6E6E66" />
          </g>
          <g transform={`translate(0 0) scale(${0.3 + 0.7 * well})`} opacity={well}>
            <Well x={60} y={0} scale={0.75} />
          </g>
        </g>
        {/* 4: children of another village drink */}
        <g transform={`translate(${P[3][0]} ${P[3][1] + 120}) scale(${s4})`} opacity={s4}>
          <House x={120} y={-20} scale={0.5} wall="#EFE3D0" roof="#8FA5B5" />
          <Person x={-90} y={0} scale={0.9} child outfit="#D9A24A" skin={colors.skin1} armR={-120 + drink * 15} bob={floatY(frame, 2, 70)} />
          <Person x={20} y={0} scale={0.9} child outfit="#6E8F6B" skin={colors.skin3} hat="cap" hatColor={colors.gold} armR={-120 + drink * 15} bob={floatY(frame, 2, 80, 20)} flip />
          <Cup x={-60} y={-150} scale={0.35} fill={1} id="c1" />
          <Cup x={-10} y={-150} scale={0.35} fill={1} id="c2" />
        </g>
      </Canvas>
      {[s1, s2, s3, s4].map((s, i) => s > 0.5 && <Sparkles key={i} x={P[i][0]} y={P[i][1] - 60} count={8} spread={80} start={[girlAt, teacherAt, studentAt, wellAt + 20][i]} size={6} />)}
    </SoftBackground>
  );
};

/* 6. Small: many hands each add a brick — together a school rises */
const Small: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const saplingAt = wordFrame(scene, t(lang, "көчөткө", "саженец"), 0.38);
  const bookAt = wordFrame(scene, t(lang, "китепке", "книгу"), 0.5);
  const projectAt = wordFrame(scene, t(lang, "долбоор", "проекта"), 0.76);
  const cols = 6;
  const rows = 4;
  const bw = 120;
  const bh = 56;
  const total = cols * rows;
  const t0 = 8;
  const t1 = Math.max(t0 + total * 6, projectAt - 20);
  const step = (t1 - t0) / total;
  const skins = [colors.skin1, colors.skin2, colors.skin3];
  const sleeves = ["#3F6B8E", colors.terracotta, "#6E8F6B", "#7D4E6B", colors.brandSoft, "#C98BA4"];
  const roof = pop(frame, projectAt, { damping: 13, stiffness: 90 });
  const sign = pop(frame, projectAt + 14, { damping: 14 });
  const sap = pop(frame, saplingAt, { damping: 13 });
  const book = pop(frame, bookAt, { damping: 13 });
  const sapArm = prog(frame, saplingAt - 16, saplingAt) - prog(frame, saplingAt + 10, saplingAt + 26);
  const bookArm = prog(frame, bookAt - 16, bookAt) - prog(frame, bookAt + 10, bookAt + 26);
  const wallBottom = 1150;
  const wallLeft = 540 - (cols * bw) / 2;
  const arm = (fromLeft: boolean, tx: number, ty: number, p: number, i: number) => {
    if (p <= 0) return null;
    const edge = fromLeft ? -60 : W + 60;
    const hx = edge + (tx - edge) * p;
    return (
      <g key={`arm-${i}`}>
        <rect x={fromLeft ? hx - 260 : hx} y={ty - 22} width={260} height={44} rx={22} fill={sleeves[i % sleeves.length]} />
        <circle cx={hx} cy={ty} r={28} fill={skins[i % skins.length]} />
      </g>
    );
  };
  return (
    <SoftBackground glow="#F7E6C4">
      <Caption text={scene.caption ?? ""} delay={4} size={64} />
      <Ground y={1150} color="#9DBF8A" color2="#7FA86C" />
      <Canvas>
        {/* bricks with hands */}
        {Array.from({ length: total }).map((_, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          const start = t0 + i * step;
          const fromLeft = i % 2 === 0;
          const offset = row % 2 ? bw / 2 : 0;
          const bx = wallLeft + offset + col * bw + bw / 2;
          const by = wallBottom - row * bh - bh / 2;
          if (row % 2 && col === cols - 1) return null;
          if (frame < start) return null;
          const travel = prog(frame, start, start + 14, Easing.out(Easing.cubic));
          const retreat = prog(frame, start + 16, start + 30, Easing.in(Easing.quad));
          const edge = fromLeft ? -60 : W + 60;
          const x = travel < 1 ? edge + (bx - edge) * travel : bx;
          const armP = travel < 1 ? travel : 1 - retreat;
          const visibleCol = bx > wallLeft && bx < wallLeft + cols * bw; // keep offset bricks inside the wall
          return (
            <g key={i}>
              {armP > 0 && arm(fromLeft, x, by, armP, i)}
              {visibleCol && <Brick x={x} y={by} w={bw - 6} h={bh - 6} color={row % 2 ? "#D08A5E" : "#C97A4E"} />}
            </g>
          );
        })}
        {/* school roof, door, windows, sign */}
        <g transform={`translate(540 ${wallBottom - rows * bh}) scale(${roof})`} opacity={roof}>
          <path d={`M${-cols * bw / 2 - 40} 0 L0 -170 L${cols * bw / 2 + 40} 0 Z`} fill={colors.terracotta} />
          <rect x={-60} y={-60} width={120} height={50} rx={6} fill={colors.brandDeep} opacity={0} />
        </g>
        <g opacity={roof}>
          <rect x={540 - 44} y={wallBottom - 130} width={88} height={130} rx={8} fill={colors.brandDeep} />
          <rect x={540 - 250} y={wallBottom - 170} width={80} height={80} rx={8} fill="#BFDDEB" stroke="#fff" strokeWidth={5} />
          <rect x={540 + 170} y={wallBottom - 170} width={80} height={80} rx={8} fill="#BFDDEB" stroke="#fff" strokeWidth={5} />
        </g>
        <g transform={`translate(540 ${wallBottom - rows * bh - 70}) scale(${sign})`} opacity={sign}>
          <rect x={-150} y={-32} width={300} height={64} rx={14} fill={colors.gold} />
          <SvgText x={0} y={14} size={36} weight={900} color={colors.brandDeep}>
            {t(lang, "МЕКТЕП", "ШКОЛА")}
          </SvgText>
        </g>
        {/* sapling and book contributions */}
        {arm(true, 110, 1040, sapArm, 7)}
        <g transform={`translate(110 1150) scale(${sap})`} opacity={sap}>
          <Sapling x={0} y={0} scale={1.3} />
        </g>
        {arm(false, 960, 1040, bookArm, 4)}
        <g transform={`translate(960 1110) scale(${book})`} opacity={book}>
          <rect x={-70} y={0} width={140} height={40} rx={8} fill="#B97A48" />
          <Book x={0} y={-60 + floatY(frame, 2, 80)} scale={0.3} open={false} color={colors.brand} />
        </g>
        {roof > 0.5 && [0, 1, 2].map((i) => <Flame key={i} x={400 + i * 140} y={720 + floatY(frame, 5, 60, i * 20)} scale={0.7 * sign} opacity={sign} />)}
      </Canvas>
      {roof > 0.5 && <Sparkles x={540} y={900} count={16} spread={300} start={projectAt} />}
    </SoftBackground>
  );
};

/* 7. Outro: the logo grows like a tree out of the ground, crowned with lights */
const Outro: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const trunk = prog(frame, 6, 46, Easing.out(Easing.cubic));
  const crown = pop(frame, 30, { damping: 13, stiffness: 90 });
  return (
    <SoftBackground>
      <Ground y={1250} />
      <Canvas>
        {/* trunk */}
        <path d={`M510 1290 Q 540 ${1290 - 240 * trunk} 540 ${1290 - 330 * trunk} Q 540 ${1290 - 240 * trunk} 570 1290 Z`} fill="#8C6A52" />
        {trunk > 0.6 && (
          <g opacity={prog(frame, 30, 44)}>
            <path d={`M540 1080 Q 470 1040 420 1000`} fill="none" stroke="#8C6A52" strokeWidth={14} strokeLinecap="round" />
            <path d={`M540 1100 Q 610 1060 660 1020`} fill="none" stroke="#8C6A52" strokeWidth={14} strokeLinecap="round" />
          </g>
        )}
        {/* crown lights */}
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2 + frame / 300;
          const r = 250 * crown;
          return <Flame key={i} x={540 + Math.cos(a) * r} y={780 + Math.sin(a) * r * 0.85 + floatY(frame, 5, 70, i * 12)} scale={0.55 * crown} opacity={crown * 0.9} />;
        })}
      </Canvas>
      <Caption text={scene.caption ?? ""} delay={6} size={64} top={250} />
      <LogoLockup delay={30} y={570} />
      <Sparkles x={W / 2} y={1000} count={16} spread={260} start={40} size={6} />
    </SoftBackground>
  );
};

export const scenes: SceneMap = { hook: Hook, hadith: Hadith, examples: Examples, story: Story, chain: Chain, small: Small, outro: Outro };
