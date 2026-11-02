import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import type { SceneMap, SceneProps } from "../types";
import { colors, W, H } from "../theme";
import { Caption, Note, Tag } from "../components/Text";
import { Camera } from "../components/Camera";
import { LogoLockup, BrandChip } from "../components/Brand";
import { pop, prog, linear, wordFrame, floatY, sway } from "../components/anim";
import { Sky, Sun, Moon, Cloud, Mountains, Ground, Sparkles, House, Tree, Canvas, Person, Coin, Scale, Book, Wheat, Hands, SvgText, Heart } from "../illustrations";
import { Flame, Bread, Fence, Minibus, Road, Bag, Ladder, Bulb, Bubble, Jug, Cup, Stream, Table, Basket, HalfDate, Stars, Leaves, CalendarIcon, ClockIcon, StarOrnament } from "../illustrations/extra-02-03";
import { SoftBackground } from "../scenes/common";

const t = (lang: "ky" | "ru", ky: string, ru: string) => (lang === "ky" ? ky : ru);
const ease = Easing.inOut(Easing.cubic);
/** Make a list of keyframes strictly increasing (speech-derived beats may be close or out of order) */
const monoFix = (arr: number[], gap = 2) => {
  const out: number[] = [];
  for (let i = 0; i < arr.length; i++) out.push(i === 0 ? arr[i] : Math.max(arr[i], out[i - 1] + gap));
  return out;
};

/* 1. Hook: three warm vignettes — bread shared, grandmother smiles over the fence, driver gives way */
const Hook: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const shareAt = wordFrame(scene, t(lang, "бөлүшөт", "делится"), 0.12);
  const b2 = wordFrame(scene, t(lang, "чоң", "бабушка"), 0.33);
  const smileAt = wordFrame(scene, t(lang, "жылмаят", "улыбается"), 0.45);
  const b3 = wordFrame(scene, t(lang, "айдоочу", "водитель"), 0.62);
  const giveAt = wordFrame(scene, t(lang, "берет", "уступает"), 0.72);
  const allAt = wordFrame(scene, t(lang, "баары", "всё"), 0.88);
  const v1 = 1 - prog(frame, b2 - 6, b2 + 8);
  const v2 = prog(frame, b2 - 6, b2 + 8) - prog(frame, b3 - 6, b3 + 8);
  const v3 = prog(frame, b3 - 6, b3 + 8);
  const split = prog(frame, shareAt, shareAt + 25);
  const bus = prog(frame, b3, b3 + 40, Easing.out(Easing.cubic));
  const vign = (o: number) => ({ opacity: o, transform: `translate(${(1 - o) * 60}px, 0px)` });
  const final = pop(frame, allAt, { damping: 12 });
  return (
    <AbsoluteFill>
      <Camera duration={durationInFrames} from={{ scale: 1.04 }} to={{ scale: 1.1, y: -16 }}>
        <Sky mode="day" />
        <Sun x={840} y={500} r={56} />
        <Cloud x={100} y={420} scale={0.8} speed={0.25} opacity={0.8} />
        <Cloud x={560} y={330} scale={0.6} speed={0.18} opacity={0.6} />
        <Mountains y={720} parallax={0.08} />
        <Ground y={1080} />
        {/* vignette A: courtyard, boy shares bread */}
        <div style={{ position: "absolute", inset: 0, ...vign(v1) }}>
          <Canvas>
            <House x={540} y={1040} scale={0.9} wall="#F3E4C8" roof={colors.terracotta} lit />
            <Tree x={160} y={1140} scale={0.8} sway={sway(frame, 1.5, 150)} />
            <Tree x={940} y={1160} scale={0.7} sway={sway(frame, 1.5, 170, 30)} />
            <Person x={430} y={1200} scale={0.9} child outfit="#3F6B8E" skin={colors.skin2} hat="cap" hatColor={colors.brandSoft} armR={-90 + split * 10} bob={floatY(frame, 3, 70)} />
            <Person x={660} y={1200} scale={0.9} child outfit="#D9A24A" skin={colors.skin1} armR={-80} flip bob={floatY(frame, 3, 80, 20)} />
            <Bread x={545} y={1040 + floatY(frame, 2, 60)} scale={0.9} split={split} />
            {split >= 1 && <Flame x={545} y={930 + floatY(frame, 5, 50)} scale={pop(frame, shareAt + 25, { damping: 12 })} />}
          </Canvas>
          {split >= 1 && <Sparkles x={545} y={960} count={10} spread={60} start={shareAt + 25} />}
        </div>
        {/* vignette B: grandmother in elechek smiles at the neighbour over the fence */}
        <div style={{ position: "absolute", inset: 0, ...vign(v2) }}>
          <Canvas>
            <House x={860} y={1020} scale={0.8} wall="#EFE3D0" roof="#8FA5B5" lit />
            <Tree x={140} y={1120} scale={0.75} leaf="#6FA87A" sway={sway(frame, 1.5, 140)} />
            <Person x={380} y={1200} scale={0.78} hat="elechek" outfit="#7D4E6B" skin={colors.skin1} armR={-30} bob={floatY(frame, 3, 80)} />
            <Fence x={470} y={1200} width={200} height={120} />
            <Person x={740} y={1200} scale={0.74} hat="hijab" hatColor="#C98BA4" outfit="#6E8F6B" skin={colors.skin2} flip armR={-30} bob={floatY(frame, 3, 90, 25)} />
            {/* smile heart between them */}
            {smileAt > 0 && <Heart x={560} y={880 - pop(frame, smileAt, { damping: 12 }) * 40} scale={0.55 * pop(frame, smileAt, { damping: 12 })} color={colors.terracotta} />}
            {smileAt > 0 && <Flame x={560} y={1010 + floatY(frame, 4, 50)} scale={0.8 * pop(frame, smileAt + 10, { damping: 12 })} />}
          </Canvas>
          {smileAt > 0 && <Sparkles x={560} y={1000} count={10} spread={60} start={smileAt + 10} />}
        </div>
        {/* vignette C: minibus stops for a pedestrian */}
        <div style={{ position: "absolute", inset: 0, ...vign(v3) }}>
          <Canvas>
            <House x={200} y={1000} scale={0.7} wall="#E7E9DC" roof="#8FA5B5" />
            <House x={900} y={1010} scale={0.7} wall="#F3E4C8" roof={colors.terracotta} />
            <Road y={1090} height={130} crossingX={700} />
            <Minibus x={-200 + bus * 560} y={1190} scale={0.95} />
            <Person x={700} y={1225} scale={0.72} hat="kalpak" outfit="#3F6B8E" skin={colors.skin2} armL={10} armR={-10} bob={floatY(frame, 3, 60)} />
            {giveAt > 0 && <Flame x={700} y={780 + floatY(frame, 5, 50)} scale={pop(frame, giveAt, { damping: 12 })} />}
          </Canvas>
          {giveAt > 0 && <Sparkles x={700} y={800} count={10} spread={60} start={giveAt} />}
        </div>
        {/* finale: three lights gather */}
        {allAt > 0 && (
          <Canvas>
            {[0, 1, 2].map((i) => (
              <Flame key={i} x={400 + i * 140} y={560 + floatY(frame, 6, 60, i * 20)} scale={final * 0.9} opacity={final} />
            ))}
          </Canvas>
        )}
      </Camera>
      <Caption text={scene.caption ?? ""} delay={10} size={92} top={230} />
      <BrandChip delay={4} />
    </AbsoluteFill>
  );
};

/* 2. Difference: strict frame (zakat) vs soft wave (sadaqa) */
const Difference: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const labels = scene.labels ?? [];
  const zekAt = wordFrame(scene, t(lang, "зекет", "закят"), 0.15, 1);
  const sadAt = wordFrame(scene, "садака", 0.6, 1);
  const needles = lang === "ky" ? ["нисаб", "мөөнөт", "жарым", "белгилүү", "убакта", "өлчөмдө", "муктаж"] : ["нисаб", "срок", "половиной", "определённые", "любое", "любом", "любому"];
  const fallback = [0.33, 0.37, 0.42, 0.52, 0.72, 0.78, 0.86];
  const at = needles.map((n, i) => wordFrame(scene, n, fallback[i]));
  const leftS = pop(frame, 6, { damping: 15 });
  const rightS = pop(frame, 12, { damping: 15 });
  const zHi = prog(frame, zekAt, zekAt + 20);
  const sHi = prog(frame, sadAt, sadAt + 20);
  const lx = 290;
  const rx = 790;
  const leftIcons = [
    (s: number) => <Scale x={0} y={-10} scale={0.26 * s} tilt={0} />,
    (s: number) => <CalendarIcon x={0} y={0} scale={0.9 * s} label="12" />,
    (s: number) => <Coin x={0} y={0} r={40 * s} label="%" />,
    (s: number) => (
      <g transform={`scale(${s})`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} cx={Math.cos((i / 8) * Math.PI * 2) * 30} cy={Math.sin((i / 8) * Math.PI * 2) * 30} r={10} fill={i % 2 ? colors.brand : colors.brandSoft} />
        ))}
      </g>
    ),
  ];
  const rightIcons = [
    (s: number) => <g transform={`scale(${s})`}><ClockIcon x={0} y={0} r={40} frame={frame} /></g>,
    (s: number) => (
      <g transform={`scale(${s})`}>
        <Coin x={-34} y={8} r={16} />
        <Coin x={0} y={0} r={26} />
        <Coin x={40} y={6} r={20} />
      </g>
    ),
    (s: number) => (
      <g transform={`scale(${s})`}>
        <circle cx={-26} cy={-10} r={16} fill={colors.skin2} />
        <circle cx={26} cy={-10} r={16} fill={colors.skin1} />
        <path d="M-50 40 Q-26 6 -2 40 Z" fill={colors.terracotta} />
        <path d="M2 40 Q26 6 50 40 Z" fill={colors.brandSoft} />
      </g>
    ),
  ];
  return (
    <SoftBackground>
      <Caption text={scene.caption ?? ""} delay={4} size={56} top={240} />
      <Canvas>
        {/* left strict frame */}
        <g transform={`translate(${lx} 830) scale(${0.9 + 0.1 * leftS})`} opacity={leftS}>
          <rect x={-220} y={-400} width={440} height={800} rx={14} fill={colors.mintLight} stroke={colors.brandDeep} strokeWidth={6 + zHi * 4} />
          <rect x={-220} y={-400} width={440} height={800} rx={14} fill={colors.brandDeep} opacity={0.06 * zHi} />
          {[1, 2, 3].map((i) => (
            <line key={i} x1={-180} y1={-400 + i * 190 + 40} x2={180} y2={-400 + i * 190 + 40} stroke={colors.mint} strokeWidth={4} />
          ))}
        </g>
        {/* right soft shape with moving waves */}
        <g transform={`translate(${rx} 830) scale(${0.9 + 0.1 * rightS})`} opacity={rightS}>
          <rect x={-220} y={-400} width={440} height={800} rx={90} fill={colors.gold} opacity={0.12 + sHi * 0.08} />
          <defs>
            <clipPath id="sad-clip">
              <rect x={-220} y={-400} width={440} height={800} rx={90} />
            </clipPath>
          </defs>
          <g clipPath="url(#sad-clip)">
            {[0, 1, 2, 3].map((k) => {
              const yy = -300 + k * 190;
              const d = Array.from({ length: 12 })
                .map((_, i) => {
                  const x = -240 + i * 44;
                  const y = yy + Math.sin(frame / 22 + i * 0.8 + k) * 14;
                  return `${i === 0 ? "M" : "L"}${x} ${y}`;
                })
                .join(" ");
              return <path key={k} d={d} fill="none" stroke={colors.gold} strokeWidth={5} opacity={0.35} strokeLinecap="round" />;
            })}
          </g>
        </g>
        {/* headers */}
        <g opacity={leftS}>
          <rect x={lx - 130} y={450} width={260} height={64} rx={8} fill={zHi > 0.5 ? colors.brandDeep : colors.brand} />
          <SvgText x={lx} y={495} size={38} weight={900} color="#fff">
            {t(lang, "ЗЕКЕТ", "ЗАКЯТ")}
          </SvgText>
        </g>
        <g opacity={rightS}>
          <rect x={rx - 130} y={450} width={260} height={64} rx={32} fill={sHi > 0.5 ? colors.goldDeep : colors.gold} />
          <SvgText x={rx} y={495} size={38} weight={900} color={sHi > 0.5 ? "#fff" : colors.brandDeep}>
            САДАКА
          </SvgText>
        </g>
        {/* left items */}
        {leftIcons.map((Icon, i) => {
          const s = pop(frame, at[i], { damping: 14 });
          const y = 620 + i * 160;
          return (
            <g key={i} opacity={s}>
              <g transform={`translate(${lx} ${y - 30})`}>{Icon(s)}</g>
              <SvgText x={lx} y={y + 72} size={36} weight={900} color={colors.brandDeep}>
                {labels[i] ?? ""}
              </SvgText>
            </g>
          );
        })}
        {/* right items (floating) */}
        {rightIcons.map((Icon, i) => {
          const s = pop(frame, at[4 + i], { damping: 14 });
          const y = 650 + i * 210 + floatY(frame, 6, 100, i * 30);
          return (
            <g key={i} opacity={s}>
              <g transform={`translate(${rx} ${y - 40})`}>{Icon(s)}</g>
              <SvgText x={rx} y={y + 68} size={36} weight={900} color={colors.goldDeep}>
                {labels[4 + i] ?? ""}
              </SvgText>
            </g>
          );
        })}
      </Canvas>
      {sHi > 0 && <Sparkles x={rx} y={560} count={10} spread={120} start={sadAt} />}
    </SoftBackground>
  );
};

/* 3. Not only money: coin → smile → kind word → helping hands at a bus stop */
const NotMoney: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const coinAt = wordFrame(scene, t(lang, "акча", "деньги"), 0.06);
  const taughtAt = wordFrame(scene, t(lang, "үйрөткөн", "учил"), 0.45);
  const smileAt = wordFrame(scene, t(lang, "жылмаюу", "улыбка"), 0.58);
  const wordAt = wordFrame(scene, t(lang, "сөз", "слово"), 0.72);
  const bagAt = wordFrame(scene, t(lang, "жүгүн", "сумку"), 0.86);
  const disc = pop(frame, 6, { damping: 13 });
  const smile = prog(frame, smileAt, smileAt + 20);
  const word = prog(frame, wordAt, wordAt + 16);
  const help = prog(frame, bagAt, bagAt + 16);
  const lift = prog(frame, bagAt + 20, bagAt + 60, ease);
  const cx = 540;
  const cy = 700;
  const discOpacity = disc * (1 - word) ;
  const bubbleS = pop(frame, wordAt, { damping: 13 }) * (1 - help);
  const sceneS = pop(frame, bagAt, { damping: 14 });
  return (
    <SoftBackground glow="#FBEBD2">
      <Caption text={scene.caption ?? ""} delay={6} size={64} />
      <Canvas>
        {/* disc: coin that becomes a smile */}
        <g transform={`translate(${cx} ${cy + floatY(frame, 6, 80)}) scale(${0.8 + 0.2 * disc})`} opacity={discOpacity}>
          <circle r={190} fill={colors.gold} opacity={0.2} />
          <circle r={150} fill={colors.gold} />
          <circle r={110} fill="none" stroke={colors.goldDeep} strokeWidth={10} opacity={1 - smile} />
          <circle r={30} fill={colors.goldDeep} opacity={(1 - smile) * 0.8} />
          {/* face */}
          <g opacity={smile}>
            <circle cx={-48} cy={-30} r={14} fill={colors.goldDeep} />
            <circle cx={48} cy={-30} r={14} fill={colors.goldDeep} />
            <path d="M-70 30 Q0 110 70 30" fill="none" stroke={colors.goldDeep} strokeWidth={16} strokeLinecap="round" strokeDasharray={240} strokeDashoffset={240 * (1 - smile)} />
          </g>
        </g>
        {/* speech bubble */}
        {wordAt > 0 && (
          <g transform={`translate(${cx} ${cy + floatY(frame, 6, 80)}) scale(${bubbleS})`} opacity={bubbleS}>
            <Bubble x={0} y={0} w={620} h={220} tail="bottom">
              <SvgText x={0} y={-10} size={54} weight={900} color={colors.brandDeep}>
                {t(lang, "Жакшы сөз", "Доброе слово")}
              </SvgText>
              <Heart x={0} y={62} scale={0.45} color={colors.terracotta} />
            </Bubble>
          </g>
        )}
        {/* bus stop scene */}
        {bagAt > 0 && (
          <g transform={`translate(0 ${(1 - sceneS) * 80})`} opacity={sceneS}>
            {/* shelter */}
            <rect x={270} y={690} width={18} height={420} fill="#8FA5B5" />
            <rect x={792} y={690} width={18} height={420} fill="#8FA5B5" />
            <rect x={240} y={640} width={600} height={56} rx={16} fill={colors.brandSoft} />
            <rect x={290} y={710} width={500} height={220} rx={10} fill="#DCEEF6" opacity={0.6} />
            <rect x={240} y={1110} width={600} height={24} rx={8} fill="#9A9A90" />
            {/* elderly person and helper */}
            <Person x={410} y={1110} scale={0.7} hat="scarf" hatColor="#C98BA4" outfit="#7D4E6B" skin={colors.skin1} armR={-40 - lift * 30} bob={floatY(frame, 2, 80)} />
            <Person x={670} y={1110} scale={0.7} hat="cap" hatColor={colors.brandSoft} outfit="#3F6B8E" skin={colors.skin2} flip armR={-60 - lift * 50} bob={floatY(frame, 2, 70, 15)} />
            <Bag x={540} y={1110 - lift * 120} scale={1.05} />
            {lift >= 1 && <Flame x={540} y={860 + floatY(frame, 5, 50)} scale={pop(frame, bagAt + 60, { damping: 12 })} />}
          </g>
        )}
      </Canvas>
      {smile > 0 && <Sparkles x={cx} y={cy - 40} count={12} spread={160} start={smileAt} />}
      {lift >= 1 && <Sparkles x={545} y={900} count={10} spread={80} start={bagAt + 60} />}
      {scene.note && <Note text={scene.note} delay={taughtAt} />}
    </SoftBackground>
  );
};

/* 4. Life: autumn village pan — roof repair, apples over the fence, tutoring */
const Life: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const roofAt = wordFrame(scene, t(lang, "чатыр", "крышу"), 0.1);
  const appleAt = wordFrame(scene, t(lang, "алмасын", "яблоками"), 0.33);
  const studentAt = wordFrame(scene, t(lang, "студент", "студентка"), 0.5);
  const bulbAt = wordFrame(scene, t(lang, "сабак", "математика"), 0.74);
  const pan = -interpolate(frame, monoFix([appleAt - 24, appleAt + 12, studentAt - 24, studentAt + 12]), [0, 760, 760, 1520], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const hammer = Math.sin(frame / 4) * 18;
  const pass = prog(frame, appleAt + 6, appleAt + 46, ease);
  const bx = 1250 + pass * 310;
  const by = 1010 - Math.sin(pass * Math.PI) * 150;
  const bulbOn = prog(frame, bulbAt, bulbAt + 14);
  return (
    <AbsoluteFill>
      <Sky mode="dawn" />
      <Sun x={240} y={430} r={46} color="#F2B96B" />
      <Mountains y={760} far="#B9A98F" near="#8E8A74" />
      <Ground y={1130} color="#D4B48C" color2="#BFA074" />
      <Camera duration={durationInFrames} from={{ scale: 1.06 }} to={{ scale: 1.12 }}>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${pan}px)` }}>
          <Canvas>
            {/* A: roof repair */}
            <Tree x={140} y={1150} scale={0.9} leaf="#D9A24A" sway={sway(frame, 1.5, 150)} />
            <House x={560} y={1150} scale={1.15} wall="#F3E4C8" roof={colors.terracotta} lit />
            <Ladder x={760} y={1170} height={240} angle={-14} />
            <Person x={705} y={1045} scale={0.5} hat="cap" hatColor="#3F6B8E" outfit="#6E8F6B" skin={colors.skin2} armL={20} armR={-105 + hammer} />
            <g transform={`translate(${705 + 52 * 0.5} ${1045 - 250 * 0.5}) rotate(${-105 + hammer}) translate(0 ${136 * 0.5})`}>
              <rect x={-4} y={-50} width={8} height={56} fill="#8C6A52" />
              <rect x={-18} y={-62} width={36} height={18} rx={4} fill="#6E6E66" />
            </g>
            {roofAt > 0 && <Flame x={720} y={760 + floatY(frame, 5, 50)} scale={0.8 * pop(frame, roofAt + 30, { damping: 12 })} />}
            {/* B: apples over the fence */}
            <House x={1700} y={1080} scale={0.75} wall="#EFE3D0" roof="#8FA5B5" />
            <Tree x={1060} y={1140} scale={0.85} leaf="#C9774B" sway={sway(frame, 1.5, 160, 40)} />
            <Tree x={1140} y={1170} scale={0.65} leaf="#E8A33D" sway={sway(frame, 1.5, 140, 60)} />
            <Person x={1220} y={1200} scale={0.78} hat="hijab" hatColor="#C98BA4" outfit="#7D4E6B" skin={colors.skin1} armR={-70 - pass * 30} bob={floatY(frame, 3, 80)} />
            <Fence x={1300} y={1200} width={230} height={120} />
            <Person x={1600} y={1200} scale={0.78} hat="kalpak" outfit="#3F6B8E" skin={colors.skin2} flip armR={-70 - pass * 20} bob={floatY(frame, 3, 90, 20)} />
            <Person x={1690} y={1200} scale={0.8} child outfit="#D9A24A" skin={colors.skin1} flip bob={floatY(frame, 2, 60, 10)} />
            <Basket x={bx} y={by} scale={0.75} />
            {pass >= 1 && <Flame x={1420} y={860 + floatY(frame, 5, 50)} scale={0.8 * pop(frame, appleAt + 46, { damping: 12 })} />}
            {/* C: tutoring at a table */}
            <House x={2460} y={1120} scale={0.8} wall="#E7E9DC" roof={colors.terracotta} lit />
            <Tree x={2560} y={1170} scale={0.7} leaf="#D9A24A" sway={sway(frame, 1.5, 150, 80)} />
            <Person x={1960} y={1190} scale={0.8} hat="scarf" hatColor="#E0A93A" outfit="#3F6B8E" skin={colors.skin1} sit armR={-80} bob={floatY(frame, 2, 90)} />
            <Person x={2200} y={1190} scale={0.95} child outfit="#6E8F6B" skin={colors.skin2} sit flip armR={-60} bob={floatY(frame, 2, 70, 30)} />
            <Table x={2080} y={1090} w={300} />
            <Book x={2080} y={1070} scale={0.42} />
            {studentAt > 0 && <Bulb x={2250} y={850 + floatY(frame, 4, 60)} scale={pop(frame, studentAt + 20, { damping: 12 })} on={bulbOn} />}
          </Canvas>
          {bulbOn >= 1 && <Sparkles x={2250 + 0} y={860} count={10} spread={70} start={bulbAt + 14} />}
        </div>
      </Camera>
      <Canvas>
        <Leaves frame={frame} count={14} />
      </Canvas>
      <Caption text={scene.caption ?? ""} delay={6} size={72} top={230} />
    </AbsoluteFill>
  );
};

/* 5. Ayah: ornamented book, rising light, a seed grows into wheat */
const Ayah: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const quranAt = wordFrame(scene, t(lang, "куран", "коран"), 0.02);
  const spendAt = wordFrame(scene, t(lang, "сарптасаңар", "израсходовали"), 0.3);
  const replaceAt = wordFrame(scene, t(lang, "толтурат", "возместит"), 0.42);
  const notAt = wordFrame(scene, t(lang, "эмес", "обещание"), 0.7);
  const lostAt = wordFrame(scene, t(lang, "жоголбойт", "пропадает"), 0.93);
  const book = pop(frame, 6, { damping: 14 });
  const fall = prog(frame, spendAt, spendAt + 30, Easing.in(Easing.quad));
  const seedY = 790 + fall * 350;
  const grow = pop(frame, replaceAt, { damping: 13, stiffness: 80 });
  const grow2 = pop(frame, replaceAt + 12, { damping: 13, stiffness: 80 });
  const grow3 = pop(frame, replaceAt + 22, { damping: 13, stiffness: 80 });
  const light = prog(frame, 10, 40);
  return (
    <SoftBackground glow="#F8E9C8">
      <Caption text={scene.caption ?? ""} delay={8} size={72} />
      <Canvas>
        {/* rays */}
        <g transform={`translate(540 690) rotate(${frame * 0.1})`} opacity={0.18 * light}>
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return <path key={i} d={`M0 0 L${Math.cos(a - 0.12) * 520} ${Math.sin(a - 0.12) * 520} L${Math.cos(a + 0.12) * 520} ${Math.sin(a + 0.12) * 520} Z`} fill={colors.gold} />;
          })}
        </g>
        {/* soil */}
        <path d={`M0 1150 Q270 1120 540 1150 T1080 1150 L1080 ${H} L0 ${H} Z`} fill="#A47A52" />
        <path d={`M0 1180 Q300 1200 540 1180 T1080 1190 L1080 ${H} L0 ${H} Z`} fill="#8C6A52" />
        {/* book with ornament */}
        <g transform={`translate(540 ${690 + floatY(frame, 5, 90)}) scale(${0.8 + 0.3 * book})`} opacity={book}>
          <circle r={230} fill={colors.gold} opacity={0.12 * light} />
          <Book x={0} y={0} scale={1.1} color={colors.brand} />
          <StarOrnament x={-82} y={0} r={34} color={colors.gold} rotate={frame * 0.3} />
          <StarOrnament x={82} y={0} r={34} color={colors.gold} rotate={-frame * 0.3} />
          <path d="M-150 -96 Q-75 -126 0 -96 Q75 -126 150 -96" fill="none" stroke={colors.gold} strokeWidth={6} />
          <path d="M-150 96 Q-75 70 0 96 Q75 70 150 96" fill="none" stroke={colors.gold} strokeWidth={6} />
        </g>
        {/* seed */}
        {fall > 0 && fall < 1 && <ellipse cx={540} cy={seedY} rx={14} ry={20} fill="#8C6A52" transform={`rotate(${fall * 180} 540 ${seedY})`} />}
        {fall >= 1 && grow < 0.1 && <ellipse cx={540} cy={1146} rx={14} ry={8} fill="#6B4F3A" />}
        {/* wheat */}
        <Wheat x={540} y={1150} scale={0.95 * grow} bend={sway(frame, 3, 110)} />
        <Wheat x={460} y={1160} scale={0.75 * grow2} bend={-6 + sway(frame, 3, 130, 20)} />
        <Wheat x={620} y={1160} scale={0.75 * grow3} bend={6 + sway(frame, 3, 120, 40)} />
      </Canvas>
      <Sparkles x={540} y={880} count={16} spread={200} start={10} size={6} />
      {grow > 0.5 && <Sparkles x={540} y={1000} count={12} spread={120} start={replaceAt + 10} />}
      {notAt > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - prog(frame, lostAt, lostAt + 10) }}>
          <Tag text={t(lang, "Байлык убадасы эмес", "Не обещание богатства")} delay={notAt} x={540} y={470} bg={colors.terracotta} size={34} />
        </div>
      )}
      {lostAt > 0 && <Tag text={t(lang, "Жакшылык калат", "Добро остаётся")} delay={lostAt} x={540} y={470} bg={colors.brandSoft} size={34} />}
      {scene.note && <Note text={scene.note} delay={quranAt + 4} />}
    </SoftBackground>
  );
};

/* 6. Hadith: the jug pours into neighbours' cups, the level never drops */
const Hadith: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const muslimAt = wordFrame(scene, "муслим", 0.05);
  const sadAt = wordFrame(scene, "садака", 0.4);
  const lessAt = wordFrame(scene, t(lang, "кемитпейт", "уменьшает"), 0.5);
  const shareAt = wordFrame(scene, t(lang, "бөлүшкөн", "делясь"), 0.62);
  const closeAt = wordFrame(scene, t(lang, "жакындайт", "ближе"), 0.9);
  const cups = [300, 540, 780];
  const starts: number[] = [];
  const cands = [40, sadAt, shareAt];
  for (let i = 0; i < 3; i++) starts.push(Math.max(cands[i], (starts[i - 1] ?? -100) + 80));
  const pourLen = 50;
  // jug travel: ease between stations
  let jx = cups[0] + 120;
  let tilt = 0;
  let fills = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    const s = starts[i];
    const move = prog(frame, s - 24, s, ease);
    const prev = i === 0 ? cups[0] + 120 : cups[i - 1] + 120;
    if (frame >= s - 24) jx = prev + (cups[i] + 120 - prev) * move;
    const p = linear(frame, s, s + pourLen);
    fills[i] = p;
    const tiltIn = prog(frame, s - 6, s + 6) - prog(frame, s + pourLen - 6, s + pourLen + 6);
    if (tiltIn > 0) tilt = 42 * tiltIn;
  }
  const pouring = tilt > 20;
  const jugY = 990;
  const th = (-tilt * Math.PI) / 180;
  const tipX = jx + -100 * Math.cos(th) - -140 * Math.sin(th);
  const tipY = jugY - 110 + -100 * Math.sin(th) + -140 * Math.cos(th);
  const cupIdx = Math.min(2, Math.max(0, Math.round((jx - 120 - 300) / 240)));
  const jugIn = prog(frame, 0, 14);
  const marker = pop(frame, lessAt, { damping: 14 });
  const warmth = pop(frame, closeAt, { damping: 12 });
  return (
    <SoftBackground tint="#F5F4EE" glow="#D8E9F1">
      <Caption text={scene.caption ?? ""} delay={6} size={60} />
      <Canvas>
        {/* neighbours behind the table */}
        {cups.map((x, i) => (
          <Person key={i} x={x} y={1200} scale={0.56} hat={(["kalpak", "elechek", "hijab"] as const)[i]} hatColor={i === 2 ? "#C98BA4" : "#F7F3EA"} outfit={["#3F6B8E", "#7D4E6B", "#6E8F6B"][i]} skin={[colors.skin2, colors.skin1, colors.skin3][i]} bob={floatY(frame, 3, 80 + i * 10, i * 20)} armL={10} armR={-10} />
        ))}
        {/* table with dastorkon */}
        <rect x={120} y={1100} width={840} height={70} rx={14} fill={colors.terracotta} />
        <rect x={120} y={1100} width={840} height={14} fill={colors.gold} opacity={0.8} />
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={i} d={`M${175 + i * 80} 1125 L${195 + i * 80} 1145 L${175 + i * 80} 1165 L${155 + i * 80} 1145 Z`} fill={colors.gold} opacity={0.5} />
        ))}
        <rect x={140} y={1170} width={800} height={40} rx={8} fill="#B97A48" />
        {/* cups */}
        {cups.map((x, i) => (
          <Cup key={i} x={x} y={1100} scale={1} fill={fills[i]} id={`h${i}`} />
        ))}
        {/* stream */}
        {pouring && <Stream x1={tipX} y1={tipY} x2={cups[cupIdx]} y2={1030} frame={frame} opacity={Math.min(1, (tilt - 20) / 15)} />}
        {/* pouring arm from the right + jug */}
        <g opacity={jugIn}>
          <g transform={`translate(${jx} ${jugY}) rotate(${-tilt} 0 -110)`}>
            <rect x={100} y={-135} width={330} height={48} rx={24} fill={colors.brandSoft} />
            <circle cx={430} cy={-111} r={40} fill="#F1E9D8" />
            <circle cx={118} cy={-110} r={30} fill={colors.skin2} />
          </g>
          <Jug x={jx} y={jugY} scale={1} level={0.72} tilt={tilt} id="main" frame={frame} />
        </g>
        {/* constant-level marker */}
        <g opacity={marker} transform={`translate(${jx} ${jugY}) rotate(${-tilt} 0 -110)`}>
          <line x1={-120} y1={-158} x2={96} y2={-158} stroke={colors.terracotta} strokeWidth={5} strokeDasharray="14 10" />
          <circle cx={-134} cy={-158} r={16} fill={colors.terracotta} />
          <path d="M-141 -158 L-136 -152 L-126 -165" fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" />
        </g>
        {/* hearts at the end */}
        {closeAt > 0 &&
          [0, 1, 2].map((i) => <Heart key={i} x={cups[i]} y={790 - warmth * 30 + floatY(frame, 4, 60, i * 20)} scale={0.4 * warmth} color={i % 2 ? colors.terracotta : colors.gold} />)}
      </Canvas>
      {lessAt > 0 && <Tag text={t(lang, "Деңгээл түшпөйт", "Уровень не падает")} delay={lessAt} x={540} y={520} bg={colors.terracotta} size={36} />}
      {closeAt > 0 && <Sparkles x={540} y={820} count={14} spread={280} start={closeAt} />}
      {scene.note && <Note text={scene.note} delay={muslimAt} />}
    </SoftBackground>
  );
};

/* 7. Sincerity: a quiet night gift at the door; half a date on the palm */
const Sincerity: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const quietAt = wordFrame(scene, t(lang, "жай", "тихо"), 0.3);
  const dateAt = wordFrame(scene, t(lang, "курма", "финика"), 0.75);
  const doorX = 560;
  const arrive = prog(frame, 6, quietAt, ease);
  const leave = prog(frame, quietAt + 24, quietAt + 100, ease);
  const px = 120 + arrive * (doorX - 70 - 120) + leave * 440;
  const walking = (arrive > 0 && arrive < 1) || (leave > 0 && leave < 1);
  const bob = walking ? Math.abs(Math.sin(frame / 4)) * 6 : 0;
  const bagDown = prog(frame, quietAt + 4, quietAt + 20);
  const inset = pop(frame, dateAt, { damping: 13 });
  const fadeOut = 1 - prog(frame, quietAt + 100, quietAt + 130);
  return (
    <AbsoluteFill>
      <Sky mode="night" />
      <Canvas>
        <Stars frame={frame} count={46} maxY={820} />
      </Canvas>
      <Moon x={860} y={430} r={54} phase={0.3} />
      <Mountains y={840} far="#2C4466" near="#1E3250" />
      <Ground y={1180} color="#24405A" color2="#1B3148" />
      <Camera duration={durationInFrames} from={{ scale: 1.04 }} to={{ scale: 1.1, x: -20 }}>
        <Canvas>
          <House x={220} y={1200} scale={0.9} wall="#C9BCA3" roof="#6B4B3E" lit={false} />
          <House x={doorX} y={1200} scale={1} wall="#D8CBB0" roof="#6B4B3E" lit />
          <House x={900} y={1200} scale={0.9} wall="#C9BCA3" roof="#7A5A4A" lit={false} />
          {/* lamp post */}
          <rect x={740} y={960} width={10} height={240} fill="#3A4A62" />
          <circle cx={745} cy={950} r={16} fill="#F6E7B8" />
          <circle cx={745} cy={950} r={60} fill="#F6E7B8" opacity={0.12 + 0.03 * Math.sin(frame / 10)} />
          {/* giver */}
          <g opacity={fadeOut}>
            <Person x={px} y={1200 + bob} scale={0.72} hat="cap" hatColor="#3F6B8E" outfit="#2F4A6B" skin={colors.skin2} armR={bagDown > 0 ? -20 : -60} armL={10} />
          </g>
          {/* bag: in hand → at the door */}
          {bagDown < 1 ? <Bag x={px + 52 * 0.72 - 10} y={1200 + bob - 60 + bagDown * 60} scale={0.8} color="#C9A26A" /> : <Bag x={doorX - 60} y={1200} scale={0.8} color="#C9A26A" />}
          {bagDown >= 1 && <Flame x={doorX - 60} y={1060 + floatY(frame, 4, 50)} scale={0.7 * pop(frame, quietAt + 20, { damping: 12 })} />}
        </Canvas>
        {bagDown >= 1 && <Sparkles x={doorX - 60} y={1080} count={8} spread={50} start={quietAt + 20} size={6} />}
      </Camera>
      {/* inset: half a date on the palm */}
      {dateAt > 0 && (
        <Canvas>
          <g transform={`translate(540 760) scale(${0.7 + 0.3 * inset})`} opacity={inset}>
            <circle r={250} fill="#15213A" stroke={colors.gold} strokeWidth={6} />
            <circle r={250} fill={colors.gold} opacity={0.06 + 0.03 * Math.sin(frame / 12)} />
            <Hands x={0} y={70} scale={0.9} skin={colors.skin2} open={1} />
            <HalfDate x={0} y={-20 + floatY(frame, 4, 70)} scale={0.9} glow={0.8 + 0.2 * Math.sin(frame / 10)} />
          </g>
        </Canvas>
      )}
      {dateAt > 0 && <Sparkles x={540} y={700} count={12} spread={180} start={dateAt} size={6} />}
      <Caption text={scene.caption ?? ""} delay={6} size={92} color="#F6E7B8" />
      {scene.note && <Note text={scene.note} delay={dateAt + 10} />}
    </AbsoluteFill>
  );
};

/* 8. Outro: logo with small lights of good deeds spreading outwards */
const Outro: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const ring = prog(frame, 20, 90, Easing.out(Easing.cubic));
  return (
    <SoftBackground>
      <Canvas>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2 + frame / 400;
          const r = 120 + ring * 300;
          return <Flame key={i} x={540 + Math.cos(a) * r} y={870 + Math.sin(a) * r * 0.75 + floatY(frame, 6, 70, i * 15)} scale={0.6 * ring} opacity={ring * 0.9} />;
        })}
      </Canvas>
      <Caption text={scene.caption ?? ""} delay={6} size={72} top={300} />
      <LogoLockup delay={10} y={640} />
      <Sparkles x={W / 2} y={900} count={18} spread={300} start={20} size={6} />
    </SoftBackground>
  );
};

export const scenes: SceneMap = { hook: Hook, difference: Difference, notmoney: NotMoney, life: Life, ayah: Ayah, hadith: Hadith, sincerity: Sincerity, outro: Outro };
