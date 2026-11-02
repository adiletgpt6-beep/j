import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import type { SceneMap, SceneProps, Lang } from "../types";
import { colors, W } from "../theme";
import { Caption, Note, Tag } from "../components/Text";
import { Camera } from "../components/Camera";
import { LogoLockup, BrandChip } from "../components/Brand";
import { pop, prog, linear, wordFrame, floatY, sway } from "../components/anim";
import { Sky, Sun, Cloud, Mountains, Ground, Sparkles, House, Tree, Canvas, Person, Coin, Chest, Hands, Mosque, Heart, SvgText } from "../illustrations";
import { SoftBackground } from "../scenes/common";
import { Envelope, Arrow, Basket, BasketFront, Chain, Door, Folder, Clipboard, RoadHorizon, RoadIcon, FestivalIcon, School, Playground, BreadAndWater, OrnamentBook, Bubble, Necklace, Stream } from "../illustrations/extra-04-05";

const t = (lang: Lang, ky: string, ru: string) => (lang === "ky" ? ky : ru);
const capSize = (s: string) => (s.length > 44 ? 50 : s.length > 30 ? 56 : s.length > 22 ? 64 : 72);

/** Split a label into ≤ 3 lines of ≤ max chars (word-wise). */
const wrap = (s: string, max = 22): string[] => {
  const out: string[] = [];
  let cur = "";
  for (const w of s.split(" ")) {
    if ((cur + " " + w).trim().length > max && cur) {
      out.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) out.push(cur);
  return out.slice(0, 3);
};

/** Number medallion + label lines, used in cat scenes. Origin: medallion centre. */
const CatBadge: React.FC<{ x: number; y: number; n: number; label: string; at: number; frame: number; color?: string }> = ({ x, y, n, label, at, frame, color = colors.brandDeep }) => {
  const s = pop(frame, at, { damping: 12, stiffness: 150 });
  const lines = wrap(label);
  return (
    <g transform={`translate(${x} ${y})`} opacity={s}>
      <g transform={`scale(${0.6 + 0.4 * s})`}>
        <circle r={46} fill={colors.gold} opacity={0.25} />
        <circle r={38} fill={colors.gold} />
        <SvgText x={0} y={14} size={40} weight={900} color={colors.brandDeep}>
          {String(n)}
        </SvgText>
      </g>
      {lines.map((l, i) => (
        <SvgText key={i} x={0} y={78 + i * 40} size={34} weight={800} color={color} opacity={prog(frame, at + 4 + i * 3, at + 16 + i * 3)}>
          {l}
        </SvgText>
      ))}
    </g>
  );
};

/* 1. Hook: dawn crossroads, envelope, chaotic arrows become eight clear directions when the Book opens */
const Hook: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const bookAt = wordFrame(scene, t(lang, "Аллах", "Аллах"), 0.6);
  const settleAt = wordFrame(scene, t(lang, "белгилеген", "определил"), 0.65);
  const suraAt = wordFrame(scene, t(lang, "Тооба", "Тауба"), 0.8);
  const n = 14;
  const settle = prog(frame, settleAt, settleAt + 40, Easing.inOut(Easing.cubic));
  const bookOpen = pop(frame, bookAt, { damping: 14, stiffness: 80 });
  const hubX = 700;
  const hubY = 900;
  return (
    <AbsoluteFill>
      <Camera duration={durationInFrames} from={{ scale: 1.02 }} to={{ scale: 1.09, y: -14 }}>
        <Sky mode="dawn" />
        <Sun x={200} y={560} r={56} color="#F2B96B" />
        <Cloud x={520} y={470} scale={0.7} speed={0.2} opacity={0.7} />
        <Cloud x={-60} y={620} scale={0.5} speed={0.15} opacity={0.5} />
        <Mountains y={760} parallax={0.08} />
        <Ground y={1120} color="#D9C9A3" color2="#C9B88E" />
        <Canvas>
          <Tree x={100} y={1190} scale={0.75} sway={sway(frame, 1.4, 150)} />
          <House x={940} y={1190} scale={0.8} wall="#EFE3D0" roof="#8FA5B5" lit />
          {/* signpost */}
          <rect x={hubX - 10} y={hubY} width={20} height={300} rx={8} fill="#8C6A52" />
          <ellipse cx={hubX} cy={1205} rx={70} ry={14} fill="rgba(0,0,0,0.08)" />
          {/* arrows: chaotic → eight directions */}
          {Array.from({ length: n }).map((_, i) => {
            const seed = (i * 137.5 + 20) % 360;
            const wob = Math.sin(frame / 18 + i) * 7 * (1 - settle);
            const chaosAngle = seed + wob;
            const chaosLen = 90 + ((i * 53) % 70);
            const target = i < 8 ? -90 + i * 45 : chaosAngle;
            const angle = interpolate(settle, [0, 1], [chaosAngle, target]);
            const len = interpolate(settle, [0, 1], [chaosLen, 150]);
            const opacity = i < 8 ? 0.85 : 0.85 * (1 - settle);
            const colorMix = i < 8 ? (settle > 0.6 ? colors.gold : colors.brandSoft) : "#9AA6B5";
            const s = pop(frame, 6 + i * 2, { damping: 14 });
            return <Arrow key={i} x={hubX} y={hubY} angle={angle} len={len * s} color={colorMix} width={10} opacity={opacity * s} />;
          })}
          <circle cx={hubX} cy={hubY} r={26 + settle * 8} fill={settle > 0.6 ? colors.gold : colors.brandDeep} />
          {/* person with envelope */}
          <Person x={300} y={1200} scale={0.85} hat="kalpak" outfit="#3F6B8E" skin={colors.skin2} armR={-75} armL={8} bob={floatY(frame, 3, 80)} />
          <Envelope x={440} y={955 + floatY(frame, 3, 80)} scale={0.7} rotate={-12} />
          {/* ornament book above */}
          <g transform={`translate(0 ${(1 - bookOpen) * 30})`} opacity={bookOpen}>
            <OrnamentBook x={540} y={570} scale={0.78} open={bookOpen} />
          </g>
        </Canvas>
        {bookOpen > 0.5 && <Sparkles x={540} y={520} count={14} spread={200} start={bookAt + 10} size={6} />}
      </Camera>
      <Caption text={scene.caption ?? ""} delay={8} size={capSize(scene.caption ?? "")} top={230} />
      {scene.note && <Note text={scene.note} delay={suraAt - 4} />}
      <BrandChip delay={4} />
    </AbsoluteFill>
  );
};

/* 2. Categories 1–2: family in a modest room, elderly woman with an empty basket */
const Cat12: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const labels = scene.labels ?? ["", ""];
  const a1 = wordFrame(scene, t(lang, "жакырлар", "бедные"), 0.2);
  const a2 = wordFrame(scene, t(lang, "мискиндер", "неимущие"), 0.35);
  const roomS = pop(frame, 4, { damping: 16, stiffness: 90 });
  return (
    <SoftBackground tint="#F8EFE2" glow="#F3DEC6">
      <Caption text={scene.caption ?? ""} delay={4} size={capSize(scene.caption ?? "")} />
      <Camera duration={durationInFrames} from={{ scale: 1 }} to={{ scale: 1.05, y: -10 }}>
        <Canvas>
          {/* room */}
          <g transform={`translate(300 900) scale(${0.9 + 0.1 * roomS})`} opacity={roomS}>
            <rect x={-230} y={-180} width={460} height={380} rx={26} fill="#F1E2CC" />
            <rect x={-230} y={120} width={460} height={80} rx={26} fill="#C9A77A" />
            <rect x={-230} y={120} width={460} height={14} fill="#B38E60" />
            {/* window */}
            <rect x={-180} y={-140} width={110} height={110} rx={10} fill="#CFE3EE" stroke="#fff" strokeWidth={6} />
            <line x1={-125} y1={-140} x2={-125} y2={-30} stroke="#fff" strokeWidth={5} />
            <line x1={-180} y1={-85} x2={-70} y2={-85} stroke="#fff" strokeWidth={5} />
            {/* table with little food */}
            <rect x={-60} y={20} width={210} height={16} rx={6} fill="#8C6A52" />
            <rect x={-40} y={36} width={12} height={90} fill="#8C6A52" />
            <rect x={120} y={36} width={12} height={90} fill="#8C6A52" />
            <ellipse cx={45} cy={18} rx={48} ry={12} fill="#fff" />
            <ellipse cx={45} cy={12} rx={24} ry={10} fill="#D9A24A" />
          </g>
          <Person x={190} y={1020} scale={0.6} hat="scarf" hatColor="#C98BA4" outfit="#6E8F6B" skin={colors.skin1} bob={floatY(frame, 2.5, 80)} />
          <Person x={270} y={1020} scale={0.6} child outfit="#D9A24A" skin={colors.skin2} bob={floatY(frame, 2, 60, 15)} />
          <Person x={420} y={1020} scale={0.6} hat="kalpak" outfit="#3F6B8E" skin={colors.skin2} armL={-20} bob={floatY(frame, 2.5, 80, 30)} flip />
          {/* outside: elderly woman with empty basket under a tree */}
          <ellipse cx={810} cy={1030} rx={230} ry={40} fill="#D7E6CF" opacity={roomS} />
          <Tree x={960} y={1030} scale={0.65} sway={sway(frame, 1.5, 140)} />
          <Person x={780} y={1020} scale={0.68} hat="elechek" outfit="#7A5C8A" skin={colors.skin1} armR={-20} bob={floatY(frame, 2.5, 90, 40)} />
          <Basket x={900} y={1032} scale={0.45} />
          <BasketFront x={900} y={1032} scale={0.45} />
          <CatBadge x={300} y={560} n={1} label={labels[0] ?? ""} at={a1} frame={frame} />
          <CatBadge x={800} y={560} n={2} label={labels[1] ?? ""} at={a2} frame={frame} />
        </Canvas>
      </Camera>
      <Canvas>
        <Necklace filled={2} appearAt={[a1, a2]} highlight={frame > a2 ? [0, 1] : frame > a1 ? [0] : []} />
      </Canvas>
    </SoftBackground>
  );
};

/* 3. Categories 3–4: collector with clipboard distributing; a heart with an opening door at the mosque */
const Cat34: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const labels = scene.labels ?? ["", ""];
  const a3 = wordFrame(scene, t(lang, "чогултуп", "собирает"), 0.15);
  const distAt = wordFrame(scene, t(lang, "бөлүштүргөндөр", "распределяет"), 0.3);
  const a4 = wordFrame(scene, t(lang, "жүрөгүн", "сердца"), 0.65);
  const openAt = wordFrame(scene, t(lang, "исламга", "исламу"), 0.8);
  const checks = Math.floor(linear(frame, a3, a3 + 60) * 4);
  const doorOpen = prog(frame, openAt, openAt + 30, Easing.inOut(Easing.cubic));
  const heartS = pop(frame, a4, { damping: 12, stiffness: 110 });
  const walk = prog(frame, openAt - 10, openAt + 40, Easing.inOut(Easing.quad));
  return (
    <SoftBackground tint={colors.mintLight} glow="#CDE6D5">
      <Caption text={scene.caption ?? ""} delay={4} size={capSize(scene.caption ?? "")} />
      <Camera duration={durationInFrames} from={{ scale: 1.03, x: 10 }} to={{ scale: 1.06, x: -10 }}>
        <Canvas>
          <Mosque x={820} y={1040} scale={1.0} color="#D9E9DE" />
          <ellipse cx={540} cy={1045} rx={520} ry={34} fill="#CFE0D3" />
          {/* collector */}
          <Chest x={150} y={1050} scale={0.5} open={0.4} />
          <Person x={270} y={1040} scale={0.7} hat="cap" hatColor="#3F6B8E" outfit={colors.brand} skin={colors.skin1} armR={-80} armL={-10} bob={floatY(frame, 2.5, 80)} />
          <Clipboard x={395} y={820 + floatY(frame, 2.5, 80)} scale={0.62} checks={checks} />
          {/* coins distributed from the chest towards the right */}
          {[0, 1, 2].map((i) => {
            const p = prog(frame, distAt + i * 10, distAt + 40 + i * 10, Easing.inOut(Easing.quad));
            if (p <= 0) return null;
            const x = 150 + p * 380;
            const y = 990 - Math.sin(p * Math.PI) * 170 + i * 6;
            return <Coin key={i} x={x} y={y} r={20} glow={p > 0.9} />;
          })}
          {/* house targets receiving the coins */}
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${480 + i * 60} ${1012 + i * 8}) scale(${0.34})`} opacity={prog(frame, distAt + 25 + i * 10, distAt + 40 + i * 10)}>
              <House x={0} y={0} scale={1} wall="#F3E4C8" roof={i % 2 ? colors.terracotta : "#8FA5B5"} lit />
            </g>
          ))}
          {/* newcomer walking toward the mosque, welcomed by a heart whose door opens */}
          <Person x={680 + walk * 60} y={1040} scale={0.7} outfit="#B86B4B" skin={colors.skin3} armR={-30 * walk} bob={floatY(frame, 2.5, 70, 20)} />
          <g transform={`translate(885 ${815 + floatY(frame, 4, 100)}) scale(${heartS})`}>
            <Heart x={0} y={0} scale={1.9} color={colors.terracotta} />
            <Door x={0} y={54} scale={0.26} open={doorOpen} wall="#A85A3C" light="#FFE7A8" />
          </g>
          <CatBadge x={290} y={560} n={3} label={labels[0] ?? ""} at={a3} frame={frame} />
          <CatBadge x={800} y={560} n={4} label={labels[1] ?? ""} at={a4} frame={frame} />
        </Canvas>
        {doorOpen > 0.5 && <Sparkles x={885} y={790} count={12} spread={90} start={openAt + 10} size={6} />}
      </Camera>
      <Canvas>
        <Necklace filled={4} appearAt={[0, 0, a3, a4]} highlight={frame > a4 ? [2, 3] : frame > a3 ? [2] : []} />
      </Canvas>
    </SoftBackground>
  );
};

/* 4. Categories 5–6: broken chain + opening door; debtor's heavy folder lightened */
const Cat56: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const labels = scene.labels ?? ["", ""];
  const a5 = wordFrame(scene, t(lang, "Бешинчиси", "Пятая"), 0.02);
  const breakAt = wordFrame(scene, t(lang, "кулчулуктан", "рабства"), 0.2);
  const doorAt = wordFrame(scene, t(lang, "туткундан", "плена"), 0.3);
  const a6 = wordFrame(scene, t(lang, "Алтынчысы", "Шестая"), 0.55);
  const debtAt = wordFrame(scene, t(lang, "карызын", "должники"), 0.65);
  const reliefAt = wordFrame(scene, t(lang, "карыздарлар", "долг"), 0.85);
  const gap = prog(frame, breakAt, breakAt + 28, Easing.out(Easing.back(1.2)));
  const open = prog(frame, doorAt, doorAt + 40, Easing.inOut(Easing.cubic));
  const step = prog(frame, doorAt + 10, doorAt + 60, Easing.inOut(Easing.quad));
  const relief = prog(frame, reliefAt, reliefAt + 40, Easing.inOut(Easing.cubic));
  const papers = 7 - Math.round(relief * 5);
  const helperS = pop(frame, debtAt + 8, { damping: 14 });
  return (
    <AbsoluteFill>
      <Sky mode="dusk" />
      <Mountains y={720} far="#A48E9E" near="#7E6E84" parallax={0.05} />
      <Ground y={1090} color="#C5B29A" color2="#B09C84" />
      <Camera duration={durationInFrames} from={{ scale: 1.0 }} to={{ scale: 1.06, y: -12 }}>
        <Canvas>
          {/* 5: chain breaks above, door opens, person steps out */}
          <Chain x={280} y={765} scale={0.7} gap={gap} />
          <Door x={280} y={1150} scale={0.78} open={open} wall="#8E7F93" />
          <Person x={280 + step * 70} y={1150} scale={0.62} outfit="#5A6E8C" skin={colors.skin2} armR={-20 - step * 40} armL={10} bob={floatY(frame, 2, 70)} smile={open > 0.4} />
          {open > 0.6 && <Sparkles x={320} y={1000} count={10} spread={80} start={doorAt + 25} size={6} />}
          {/* 6: debtor with heavy folder; a helper takes part of the papers */}
          <ellipse cx={820} cy={1152} rx={220} ry={26} fill="rgba(0,0,0,0.07)" />
          <Person x={760} y={1150} scale={0.68} hat="kalpak" outfit="#3F6B8E" skin={colors.skin2} armR={-62} armL={-62} bob={floatY(frame, 2.5, 80, 20)} smile={relief > 0.6} />
          <Folder x={830} y={905 + floatY(frame, 2.5, 80, 20) + relief * 20} scale={0.62} papers={papers} rotate={-6 + relief * 6} />
          <g opacity={helperS}>
            <Person x={960} y={1150} scale={0.62} hat="hijab" hatColor="#C98BA4" outfit="#6E8F6B" skin={colors.skin1} armL={-70 * helperS} armR={-20} bob={floatY(frame, 2.5, 80, 50)} flip />
          </g>
          {/* papers flying from the folder to the helper */}
          {[0, 1, 2].map((i) => {
            const p = prog(frame, reliefAt + i * 6, reliefAt + 30 + i * 6, Easing.inOut(Easing.quad));
            if (p <= 0 || p >= 1) return null;
            return <rect key={i} x={830 + p * 100 - 30} y={840 - Math.sin(p * Math.PI) * 60 - 20} width={60} height={42} rx={6} fill="#FFF9EC" stroke="#E6DCC4" strokeWidth={3} transform={`rotate(${p * 40} ${830 + p * 100} ${840})`} opacity={1 - p * 0.6} />;
          })}
          <CatBadge x={280} y={560} n={5} label={labels[0] ?? ""} at={a5} frame={frame} />
          <CatBadge x={810} y={560} n={6} label={labels[1] ?? ""} at={a6} frame={frame} />
        </Canvas>
      </Camera>
      <Caption text={scene.caption ?? ""} delay={4} size={capSize(scene.caption ?? "")} />
      <Canvas>
        <Necklace filled={6} appearAt={[0, 0, 0, 0, a5, a6]} highlight={frame > a6 ? [4, 5] : frame > a5 ? [4] : []} />
      </Canvas>
    </AbsoluteFill>
  );
};

/* 5. Categories 7–8: road to the light; traveller on a mountain road offered bread and water */
const Cat78: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const labels = scene.labels ?? ["", ""];
  const a7 = wordFrame(scene, t(lang, "Жетинчиси", "Седьмая"), 0.02);
  const roadAt = wordFrame(scene, t(lang, "жолунда", "пути"), 0.2);
  const a8 = wordFrame(scene, t(lang, "Сегизинчиси", "Восьмая"), 0.45);
  const giveAt = wordFrame(scene, t(lang, "каражатсыз", "средств"), 0.75);
  const roadP = prog(frame, roadAt - 10, roadAt + 30);
  const give = prog(frame, giveAt, giveAt + 35, Easing.inOut(Easing.cubic));
  const travS = pop(frame, a8, { damping: 14 });
  const walletS = pop(frame, a8 + 10, { damping: 12 });
  return (
    <AbsoluteFill>
      <Sky mode="day" />
      <Sun x={300} y={775} r={64 + roadP * 20} color="#F6CF7A" />
      <Cloud x={700} y={500} scale={0.8} speed={0.22} opacity={0.8} />
      <Mountains y={640} parallax={0.06} />
      <Ground y={1080} />
      <Camera duration={durationInFrames} from={{ scale: 1.02, y: 8 }} to={{ scale: 1.08, y: -10 }}>
        <Canvas>
          {/* road to the horizon light */}
          <g opacity={roadP}>
            <RoadHorizon x={300} y={790} bottom={1230} halfWidth={290} dashOffset={frame * 0.04} />
            <circle cx={300} cy={790} r={30 + roadP * 20} fill="#FFF3C9" opacity={0.9} />
          </g>
          <Tree x={80} y={1120} scale={0.6} sway={sway(frame, 1.5, 150)} />
          {/* traveller on the right, mountain path */}
          <path d="M620 1180 Q760 1090 1080 1120" fill="none" stroke="#B79A6E" strokeWidth={26} strokeLinecap="round" />
          <g opacity={travS}>
            <rect x={815} y={865 + floatY(frame, 2.5, 80)} width={70} height={110} rx={22} fill="#8C6A52" />
            <Person x={790} y={1120} scale={0.7} hat="cap" hatColor="#C9774B" outfit="#5E7A5B" skin={colors.skin2} armR={-30 - give * 40} armL={14} bob={floatY(frame, 2.5, 80)} />
          </g>
          {/* empty wallet */}
          <g transform={`translate(650 ${930 + floatY(frame, 3, 70)}) scale(${walletS})`}>
            <rect x={-50} y={-30} width={100} height={64} rx={12} fill="#8C6A52" />
            <rect x={-50} y={-30} width={100} height={20} rx={8} fill="#A67B5B" />
            <circle cx={30} cy={10} r={8} fill={colors.gold} />
            <SvgText x={0} y={-44} size={32} weight={900} color={colors.inkSoft}>
              —
            </SvgText>
          </g>
          {/* hands offering bread & water */}
          <g transform={`translate(${1080 - give * 200} ${1010 + (1 - give) * 40})`} opacity={give}>
            <Hands x={0} y={0} scale={0.5} skin={colors.skin1} open={0.6} />
            <BreadAndWater x={0} y={-40} scale={0.8} />
          </g>
          {give >= 1 && <Sparkles x={880} y={960} count={10} spread={70} start={giveAt + 35} size={6} />}
          <CatBadge x={290} y={560} n={7} label={labels[0] ?? ""} at={a7} frame={frame} />
          <CatBadge x={800} y={560} n={8} label={labels[1] ?? ""} at={a8} frame={frame} />
        </Canvas>
      </Camera>
      <Caption text={scene.caption ?? ""} delay={4} size={capSize(scene.caption ?? "")} />
      <Canvas>
        <Necklace filled={8} appearAt={[0, 0, 0, 0, 0, 0, a7, a8]} highlight={frame > a8 ? [6, 7] : frame > a7 ? [6] : []} />
      </Canvas>
    </AbsoluteFill>
  );
};

/* 6. Nuance: ring of eight cards; road & festival icons are pushed out of the ring */
const SHORT_KY = ["Жакырлар", "Мискиндер", "Чогултуучу", "Жүрөгү жакындатуу", "Бошотуу", "Карыздарлар", "Аллах жолунда", "Мусапыр"];
const SHORT_RU = ["Бедные", "Неимущие", "Сборщики", "Сердца к исламу", "Освобождение", "Должники", "На пути Аллаха", "Путник"];

const Nuance: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const labels = lang === "ky" ? SHORT_KY : SHORT_RU;
  const lockAt = wordFrame(scene, t(lang, "так", "конкретный"), 0.1);
  const roadAt = wordFrame(scene, t(lang, "жол", "дорог"), 0.7);
  const festAt = wordFrame(scene, t(lang, "майрамдар", "праздники"), 0.8);
  const pushAt = wordFrame(scene, t(lang, "зекеттен", "закята"), 0.9);
  const cx = 540;
  const cy = 800;
  const swing = Math.sin(frame / 90) * 8;
  const lock = pop(frame, lockAt, { damping: 12, stiffness: 120 });
  const push = prog(frame, pushAt, pushAt + 36, Easing.inOut(Easing.cubic));
  const roadS = pop(frame, roadAt, { damping: 13 });
  const festS = pop(frame, festAt, { damping: 13 });
  const roadX = interpolate(push, [0, 1], [450, 124]);
  const roadY = interpolate(push, [0, 1], [965, 560]);
  const festX = interpolate(push, [0, 1], [630, 956]);
  const festY = interpolate(push, [0, 1], [965, 560]);
  return (
    <SoftBackground tint="#FBF4E6" glow="#F3E3C2">
      <Caption text={scene.caption ?? ""} delay={4} size={capSize(scene.caption ?? "")} />
      <Canvas>
        {/* excluded icons (drawn behind the ring so they pass under the cards) */}
        <g transform={`translate(${roadX} ${roadY}) scale(${roadS * 0.8})`} opacity={roadS}>
          <RoadIcon x={0} y={0} scale={1} />
          <g opacity={push}>
            <circle cx={50} cy={-50} r={24} fill={colors.red} />
            <line x1={38} y1={-38} x2={62} y2={-62} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
            <line x1={38} y1={-62} x2={62} y2={-38} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
          </g>
        </g>
        <g transform={`translate(${festX} ${festY}) scale(${festS * 0.8})`} opacity={festS}>
          <FestivalIcon x={0} y={0} scale={1} t={frame} />
          <g opacity={push}>
            <circle cx={50} cy={-50} r={24} fill={colors.red} />
            <line x1={38} y1={-38} x2={62} y2={-62} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
            <line x1={38} y1={-62} x2={62} y2={-38} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
          </g>
        </g>
        {/* ring */}
        <circle cx={cx} cy={cy} r={200} fill={colors.gold} opacity={0.12 + 0.06 * Math.sin(frame / 20)} />
        <circle cx={cx} cy={cy} r={315} fill="none" stroke={colors.goldDeep} strokeWidth={4} strokeDasharray="10 16" opacity={0.35 * lock} transform={`rotate(${frame * 0.2} ${cx} ${cy})`} />
        {labels.map((lab, i) => {
          const s = pop(frame, 6 + i * 5, { damping: 13, stiffness: 120 });
          const a = ((-90 + i * 45 + swing) * Math.PI) / 180;
          const r = i % 2 ? 340 : 290;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          const lines = wrap(lab, 12);
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${0.7 + 0.3 * s})`} opacity={s}>
              <rect x={-104} y={-54} width={220} height={120} rx={22} fill="rgba(0,0,0,0.06)" />
              <rect x={-110} y={-60} width={220} height={120} rx={22} fill="#fff" stroke={colors.gold} strokeWidth={4} />
              <circle cx={-72} cy={-22} r={22} fill={colors.gold} />
              <SvgText x={-72} y={-13} size={28} weight={900} color={colors.brandDeep}>
                {String(i + 1)}
              </SvgText>
              {lines.map((l, k) => (
                <SvgText key={k} x={lines.length > 1 ? 0 : 12} y={lines.length > 1 ? 14 + k * 34 : 26} size={32} weight={800} color={colors.brandDeep}>
                  {l}
                </SvgText>
              ))}
            </g>
          );
        })}
        {/* centre medallion */}
        <g transform={`translate(${cx} ${cy}) scale(${0.6 + 0.4 * lock})`} opacity={lock}>
          <circle r={96} fill={colors.brand} />
          <circle r={82} fill="none" stroke={colors.gold} strokeWidth={5} />
          <SvgText x={0} y={22} size={96} weight={900} color="#fff">
            8
          </SvgText>
        </g>
      </Canvas>
      {lock > 0.5 && <Sparkles x={cx} y={cy} count={12} spread={120} start={lockAt} size={6} />}
      <Note text={t(lang, "Жол, майрам — зекеттен эмес", "Дороги, праздники — не из закята")} delay={pushAt} bottom={690} bg="rgba(255,255,255,0.9)" color={colors.red} />
    </SoftBackground>
  );
};

/* 7. Sadaqa: strict green stream into the ring of 8 vs. free golden stream to school, road, trees, playground */
const Sadaqa: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const sadaqaAt = wordFrame(scene, "садака", 0.1);
  const schoolAt = wordFrame(scene, t(lang, "мектепти", "школу"), 0.25);
  const roadAt = wordFrame(scene, t(lang, "жолду", "дорогу"), 0.32);
  const treesAt = wordFrame(scene, t(lang, "көрктөндүрүүнү", "озеленение"), 0.4);
  const playAt = wordFrame(scene, t(lang, "башка", "любое"), 0.48);
  const zakatAt = wordFrame(scene, t(lang, "зекетпи", "закят"), 0.8);
  const sadaqa2At = wordFrame(scene, t(lang, "садакабы", "садаку"), 0.88);
  const flow = frame / 60;
  const zakatStream = prog(frame, 8, 40);
  const zHL = 1 + 0.08 * Math.sin(frame / 6) * prog(frame, zakatAt, zakatAt + 8) * (1 - prog(frame, sadaqa2At, sadaqa2At + 8));
  const sHL = 1 + 0.08 * Math.sin(frame / 6) * prog(frame, sadaqa2At, sadaqa2At + 8);
  const targets = [
    { d: "M760 590 C760 700 620 760 600 930", at: schoolAt },
    { d: "M760 590 C760 760 820 900 790 1120", at: roadAt },
    { d: "M760 590 C780 720 900 760 920 960", at: treesAt },
    { d: "M760 590 C740 820 660 980 650 1120", at: playAt },
  ];
  return (
    <AbsoluteFill>
      <Sky mode="day" />
      <Sun x={990} y={170} r={36} rays={false} />
      <Cloud x={100} y={480} scale={0.6} speed={0.2} opacity={0.75} />
      <Mountains y={760} parallax={0.05} />
      <Ground y={1080} />
      <Camera duration={durationInFrames} from={{ scale: 1.0, x: 10 }} to={{ scale: 1.05, x: -10 }}>
        <Canvas>
          {/* left: zakat source and ring */}
          <g transform={`translate(250 560) scale(${zHL})`}>
            <rect x={-120} y={-34} width={240} height={68} rx={34} fill={colors.brand} opacity={pop(frame, 2)} />
            <SvgText x={0} y={14} size={36} weight={900} color="#fff" opacity={pop(frame, 2)}>
              {t(lang, "ЗЕКЕТ", "ЗАКЯТ")}
            </SvgText>
          </g>
          <Stream d="M250 596 L250 700" color={colors.brand} width={18} p={zakatStream} flow={flow} />
          <g transform={`translate(250 850) scale(${zHL})`}>
            <circle r={150} fill={colors.mint} opacity={0.7 * prog(frame, 20, 40)} />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = -Math.PI / 2 + (i / 8) * Math.PI * 2;
              const s = pop(frame, 30 + i * 4, { damping: 13 });
              return (
                <g key={i} transform={`translate(${Math.cos(a) * 110} ${Math.sin(a) * 110}) scale(${s})`}>
                  <circle r={30} fill={colors.gold} stroke={colors.goldDeep} strokeWidth={3} />
                  <SvgText x={0} y={11} size={32} weight={900} color={colors.brandDeep}>
                    {String(i + 1)}
                  </SvgText>
                </g>
              );
            })}
            <SvgText x={0} y={12} size={36} weight={900} color={colors.brandDeep} opacity={prog(frame, 50, 70)}>
              {t(lang, "8 кат.", "8 кат.")}
            </SvgText>
          </g>
          {/* right: sadaqa source and free streams */}
          <g transform={`translate(760 556) scale(${sHL * pop(frame, sadaqaAt, { damping: 12 })})`}>
            <rect x={-130} y={-34} width={260} height={68} rx={34} fill={colors.gold} />
            <SvgText x={0} y={14} size={36} weight={900} color={colors.brandDeep}>
              САДАКА
            </SvgText>
          </g>
          {targets.map((tg, i) => (
            <Stream key={i} d={tg.d} color={colors.gold} width={14} p={prog(frame, tg.at - 6, tg.at + 30)} flow={flow + i * 0.3} />
          ))}
          {/* targets */}
          <g transform={`translate(600 1120) scale(${pop(frame, schoolAt + 20, { damping: 13 })})`}>
            <School x={0} y={0} scale={0.6} />
          </g>
          <g opacity={prog(frame, roadAt + 20, roadAt + 40)}>
            <path d="M560 1175 Q800 1150 1040 1180" fill="none" stroke="#8A8F9A" strokeWidth={34} strokeLinecap="round" />
            <path d="M560 1175 Q800 1150 1040 1180" fill="none" stroke="#FFF3C9" strokeWidth={4} strokeDasharray="22 26" strokeDashoffset={-frame * 0.6} />
          </g>
          <g transform={`translate(920 1120) scale(${pop(frame, treesAt + 20, { damping: 13 })})`}>
            <Tree x={0} y={0} scale={0.55} sway={sway(frame, 2, 120)} />
            <Tree x={70} y={30} scale={0.42} sway={sway(frame, 2, 130, 30)} />
          </g>
          <g transform={`translate(660 1120) scale(${pop(frame, playAt + 20, { damping: 13 })})`}>
            <Playground x={0} y={0} scale={0.62} swing={Math.sin(frame / 14) * 14} />
          </g>
        </Canvas>
      </Camera>
      <Caption text={scene.caption ?? ""} delay={4} size={capSize(scene.caption ?? "")} />
    </AbsoluteFill>
  );
};

/* 8. Outro: question → knowledgeable person, then logo lockup */
const Outro: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const askAt = wordFrame(scene, t(lang, "билимдүү", "знающего"), 0.2);
  const logoAt = wordFrame(scene, t(lang, "эми", "направлениях"), 0.5);
  const out = 1 - prog(frame, logoAt - 6, logoAt + 8);
  const bubbleS = pop(frame, 10, { damping: 13 });
  const answerS = pop(frame, askAt, { damping: 13 });
  return (
    <SoftBackground>
      <Caption text={scene.caption ?? ""} delay={6} size={capSize(scene.caption ?? "")} top={280} />
      <Canvas>
        <g opacity={out} transform={`translate(0 ${(1 - out) * -40})`}>
          <ellipse cx={540} cy={1060} rx={320} ry={30} fill={colors.mint} />
          <Person x={380} y={1050} scale={0.75} outfit="#3F6B8E" skin={colors.skin2} armR={-40} bob={floatY(frame, 2.5, 80)} />
          <g transform={`translate(430 740) scale(${bubbleS})`}>
            <Bubble x={0} y={0} text="?" />
          </g>
          <Person x={720} y={1050} scale={0.78} hat="kalpak" outfit={colors.brand} skin={colors.skin1} armL={-30} bob={floatY(frame, 2.5, 90, 30)} flip />
          <g transform={`translate(680 740) scale(${answerS})`}>
            <Bubble x={0} y={0} text="✓" flip color={colors.mintLight} textColor={colors.brand} />
          </g>
          <Arrow x={470} y={640} angle={0} len={140} color={colors.gold} width={8} opacity={answerS} />
        </g>
      </Canvas>
      {frame >= logoAt - 6 && <LogoLockup delay={logoAt} y={640} />}
      {frame >= logoAt && <Sparkles x={W / 2} y={900} count={18} spread={300} start={logoAt + 10} size={6} />}
    </SoftBackground>
  );
};

export const scenes: SceneMap = { hook: Hook, cat12: Cat12, cat34: Cat34, cat56: Cat56, cat78: Cat78, nuance: Nuance, sadaqa: Sadaqa, outro: Outro };
