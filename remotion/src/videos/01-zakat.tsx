import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import type { SceneMap, SceneProps } from "../types";
import { colors, W, H, zone } from "../theme";
import { Caption, Note, BigLabel, Tag } from "../components/Text";
import { Camera } from "../components/Camera";
import { LogoLockup, BrandChip } from "../components/Brand";
import { pop, prog, linear, wordFrame, floatY, speechEnd, sway } from "../components/anim";
import { Sky, Sun, Moon, Cloud, Mountains, Ground, Sparkles, House, Yurt, Tree, Canvas, Person, Coin, CoinStack, Banknote, GoldBar, Scale, Chest, Card, SvgText, Heart } from "../illustrations";
import { SoftBackground, Badge } from "../scenes/common";

const t = (lang: "ky" | "ru", ky: string, ru: string) => (lang === "ky" ? ky : ru);

/* 1. Hook: dawn village, savings chest, a year passes, a share flies to the neighbour */
const Hook: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const yearStart = wordFrame(scene, t(lang, "жылдан", "год"), 0.15);
  const shareAt = wordFrame(scene, t(lang, "үлүшү", "доля"), 0.6);
  const zakatAt = wordFrame(scene, t(lang, "зекет", "закят"), 0.9);
  const pages = 12;
  const yearP = linear(frame, yearStart, yearStart + 70);
  const fly = prog(frame, shareAt, shareAt + 40, Easing.inOut(Easing.cubic));
  const cx = 330 + fly * 430;
  const cy = 1080 - Math.sin(fly * Math.PI) * 260;
  return (
    <AbsoluteFill>
      <Camera duration={durationInFrames} from={{ scale: 1.04 }} to={{ scale: 1.1, y: -20 }}>
        <Sky mode="dawn" />
        <Sun x={760} y={520} r={60} color="#F2B96B" />
        <Cloud x={120} y={380} scale={0.9} speed={0.25} opacity={0.8} />
        <Cloud x={600} y={300} scale={0.7} speed={0.18} opacity={0.6} />
        <Mountains y={700} parallax={0.1} />
        <Ground y={1080} />
        <Canvas>
          <Tree x={960} y={1140} scale={0.9} sway={sway(frame, 1.5, 140)} />
          <Tree x={120} y={1170} scale={0.7} sway={sway(frame, 1.5, 160, 40)} />
          <House x={330} y={1150} scale={1.05} lit />
          <House x={820} y={1180} scale={0.95} wall="#EFE3D0" roof="#8FA5B5" />
          <Yurt x={590} y={1230} scale={0.6} />
          {/* chest in front of the first house */}
          <Chest x={330} y={1240} scale={0.7} open={prog(frame, shareAt - 10, shareAt + 10)} />
          {/* calendar pages */}
          {yearP > 0 && yearP < 1 && (
            <g transform={`translate(330 ${990 + floatY(frame, 4, 60)})`}>
              <rect x={-60} y={-70} width={120} height={120} rx={14} fill="#fff" stroke={colors.mint} strokeWidth={4} />
              <rect x={-60} y={-70} width={120} height={28} rx={14} fill={colors.terracotta} />
              <SvgText x={0} y={28} size={54} weight={900} color={colors.brandDeep}>
                {String(Math.min(pages, 1 + Math.floor(yearP * pages)))}
              </SvgText>
              <SvgText x={0} y={-50} size={18} weight={800} color="#fff">
                {t(lang, "АЙ", "МЕСЯЦ")}
              </SvgText>
            </g>
          )}
          {yearP >= 1 && (
            <g transform={`translate(330 ${990 + floatY(frame, 4, 60)})`} opacity={1 - prog(frame, shareAt, shareAt + 15)}>
              <rect x={-60} y={-70} width={120} height={120} rx={14} fill="#fff" stroke={colors.mint} strokeWidth={4} />
              <rect x={-60} y={-70} width={120} height={28} rx={14} fill={colors.brand} />
              <SvgText x={0} y={28} size={44} weight={900} color={colors.brandDeep}>
                1 {t(lang, "жыл", "год")}
              </SvgText>
            </g>
          )}
          {/* flying share */}
          {fly > 0 && fly < 1 && <Coin x={cx} y={cy} r={28} glow />}
          {fly >= 1 && <Coin x={760} y={1080} r={28 + pop(frame, shareAt + 40) * 6} glow />}
        </Canvas>
        {fly >= 1 && <Sparkles x={790} y={1060} count={12} spread={90} start={shareAt + 40} />}
      </Camera>
      <Caption text={scene.caption ?? ""} delay={10} size={92} top={230} />
      <BrandChip delay={4} />
    </AbsoluteFill>
  );
};

/* 2. Five pillars rising; zakat pillar highlighted */
const Pillars: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const labels = scene.labels ?? [];
  const zakatAt = wordFrame(scene, t(lang, "зекет", "закят"), 0.05);
  const baseY = 1180;
  const highlight = prog(frame, zakatAt + 10, zakatAt + 30);
  const duty = wordFrame(scene, t(lang, "парз кылынган", "обязанность"), 0.6);
  return (
    <SoftBackground>
      <Caption text={scene.caption ?? ""} delay={4} />
      <Canvas>
        {/* base */}
        <rect x={60} y={baseY} width={W - 120} height={30} rx={15} fill={colors.brandDeep} opacity={prog(frame, 0, 10)} />
        <rect x={100} y={baseY - 24} width={W - 200} height={24} rx={6} fill={colors.brandSoft} opacity={prog(frame, 0, 10)} />
        {labels.map((lab, i) => {
          const s = pop(frame, 8 + i * 6, { damping: 15, stiffness: 90 });
          const x = 160 + i * 190;
          const h = 520 * s;
          const isZ = i === 3;
          const lift = isZ ? highlight * 40 : 0;
          const fill = isZ ? `rgba(224,169,58,${highlight})` : "transparent";
          return (
            <g key={i} transform={`translate(${x} ${baseY - 24 - lift})`}>
              <rect x={-60} y={-h} width={120} height={h} rx={16} fill={colors.mintLight} stroke={colors.brand} strokeWidth={6} />
              <rect x={-60} y={-h} width={120} height={h} rx={16} fill={fill} />
              <rect x={-74} y={-h - 18} width={148} height={30} rx={10} fill={isZ && highlight > 0.5 ? colors.gold : colors.brand} />
              <rect x={-74} y={-18} width={148} height={30} rx={10} fill={isZ && highlight > 0.5 ? colors.gold : colors.brand} />
              {/* label rotated vertically inside pillar */}
              <g transform={`translate(0 ${-h / 2}) rotate(-90)`} opacity={s}>
                <SvgText x={0} y={14} size={lab.length > 6 ? 36 : 44} weight={900} color={isZ && highlight > 0.5 ? colors.goldDeep : colors.brandDeep}>
                  {lab}
                </SvgText>
              </g>
              {/* number badge */}
              <g opacity={s}>
                <circle cx={0} cy={-h - 60} r={26} fill={isZ && highlight > 0.5 ? colors.gold : colors.brandSoft} />
                <SvgText x={0} y={-h - 50} size={30} weight={900} color="#fff">
                  {String(i + 1)}
                </SvgText>
              </g>
            </g>
          );
        })}
      </Canvas>
      {highlight > 0 && <Sparkles x={730} y={700} count={14} spread={80} start={zakatAt + 10} />}
      <Note text={t(lang, "Шарттар аткарылганда — парз", "При выполнении условий — обязанность")} delay={duty} />
    </SoftBackground>
  );
};

/* 3. Nisab: scale with gold ≈85 g vs savings */
const Nisab: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const nisabAt = wordFrame(scene, "нисаб", 0.1);
  const goldAt = wordFrame(scene, t(lang, "алтын", "золот"), 0.4);
  const muftiAt = wordFrame(scene, "муфтият", 0.85);
  const tilt = interpolate(frame, [10, 60, goldAt, goldAt + 40], [0, 10, 10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const coins = Math.round(interpolate(frame, [goldAt - 10, goldAt + 40], [1, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const labelS = pop(frame, goldAt, { damping: 14 });
  const lineP = prog(frame, nisabAt, nisabAt + 25);
  return (
    <SoftBackground>
      <Caption text={scene.caption ?? ""} delay={nisabAt - 4} />
      <Canvas>
        {/* threshold line */}
        <line x1={120} y1={760} x2={120 + (W - 240) * lineP} y2={760} stroke={colors.terracotta} strokeWidth={6} strokeDasharray="22 16" strokeLinecap="round" />
        <g opacity={lineP}>
          <rect x={W / 2 - 160} y={560} width={320} height={50} rx={25} fill={colors.terracotta} />
          <SvgText x={W / 2} y={595} size={30} weight={900} color="#fff">
            {t(lang, "НИСАБ — ЧЕК", "НИСАБ — ПОРОГ")}
          </SvgText>
        </g>
        <Scale
          x={W / 2}
          y={900}
          scale={1.15}
          tilt={tilt}
          left={
            <g>
              <GoldBar x={0} y={-10} scale={0.9} />
              <GoldBar x={-10} y={-50} scale={0.8} />
            </g>
          }
          right={
            <g>
              {Array.from({ length: coins }).map((_, i) => (
                <Coin key={i} x={-50 + (i % 3) * 50} y={-10 - Math.floor(i / 3) * 40} r={24} />
              ))}
              <Banknote x={10} y={-70 - coins * 2} rotate={-8} scale={0.6} />
            </g>
          }
        />
        {/* gold label */}
        <g transform={`translate(${W / 2 - 250} 1130) scale(${0.8 + 0.2 * labelS})`} opacity={labelS}>
          <rect x={-130} y={-40} width={260} height={80} rx={40} fill={colors.gold} />
          <SvgText x={0} y={14} size={40} weight={900} color={colors.brandDeep}>
            ≈ 85 {t(lang, "г алтын", "г золота")}
          </SvgText>
        </g>
        <g transform={`translate(${W / 2 + 250} 1130) scale(${0.8 + 0.2 * labelS})`} opacity={labelS}>
          <rect x={-130} y={-40} width={260} height={80} rx={40} fill={colors.brandSoft} />
          <SvgText x={0} y={14} size={38} weight={900} color="#fff">
            {t(lang, "Сиздин мүлк", "Ваше имущество")}
          </SvgText>
        </g>
      </Canvas>
      {scene.note && <Note text={scene.note} delay={muftiAt - 5} />}
    </SoftBackground>
  );
};

/* 4. Hawl: night sky, moon phases arc over a year, chest stays */
const Hawl: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const yearAt = wordFrame(scene, t(lang, "жыл", "год"), 0.4);
  const hawlAt = wordFrame(scene, "хауль", 0.85);
  const n = 12;
  const progress = linear(frame, 12, yearAt + 50);
  const end = speechEnd(scene);
  return (
    <AbsoluteFill>
      <Sky mode="night" />
      <Canvas>
        {Array.from({ length: 40 }).map((_, i) => {
          const sx = (i * 263) % W;
          const sy = (i * 157) % 900;
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / 25 + i));
          return <circle key={i} cx={sx} cy={sy + 60} r={2.5} fill="#fff" opacity={tw * 0.8} />;
        })}
      </Canvas>
      <Mountains y={820} far="#2C4466" near="#1E3250" />
      <Ground y={1180} color="#24405A" color2="#1B3148" />
      <Canvas>
        {/* moon arc */}
        {Array.from({ length: n }).map((_, i) => {
          const a = Math.PI + (i / (n - 1)) * Math.PI;
          const mx = W / 2 + Math.cos(a) * 400;
          const my = 840 + Math.sin(a) * 300;
          const lit = progress * n > i + 0.3 ? 1 : 0.18;
          const phase = i / n;
          const k = Math.cos(phase * Math.PI * 2);
          return (
            <g key={i} transform={`translate(${mx} ${my})`} opacity={lit}>
              <circle r={44} fill="#F6E7B8" opacity={0.12} />
              <circle r={26} fill="#F6E7B8" />
              <ellipse cx={k > 0 ? 10 : -10} cy={0} rx={Math.abs(k) * 26} ry={26} fill={k > 0 ? "#15213A" : "#F6E7B8"} opacity={k > 0 ? 1 : 0} />
            </g>
          );
        })}
        {/* path */}
        <path d={`M${W / 2 - 400} 840 A400 300 0 0 1 ${W / 2 + 400} 840`} fill="none" stroke="#F6E7B8" strokeWidth={3} strokeDasharray="6 14" opacity={0.35} />
        <House x={W / 2} y={1200} scale={1.1} wall="#C9BCA3" roof="#6B4B3E" lit />
        <Chest x={W / 2 + 230} y={1230} scale={0.75} />
        <Tree x={180} y={1230} scale={0.9} leaf="#2F5D4A" trunk="#4B3A2F" sway={sway(frame, 1.2, 150)} />
      </Canvas>
      <Caption text={scene.caption ?? ""} delay={hawlAt - 10} color="#F6E7B8" />
      <div style={{ position: "absolute", top: 430, left: 0, width: W, textAlign: "center", opacity: prog(frame, 10, 24), fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 48, color: "#C9D6EA" }}>
        {t(lang, "12 ай = 1 хижра жылы", "12 месяцев = 1 лунный год")}
      </div>
    </AbsoluteFill>
  );
};

/* 5. Rate: ring of 40 coins, one leaves → 2.5 % */
const Rate: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const items = t(lang, ["акча", "алтын", "күмүш", "товар"], ["денег", "золот", "серебр", "товар"]);
  const labels = t(lang, ["Акча", "Алтын", "Күмүш", "Товарлар"], ["Деньги", "Золото", "Серебро", "Товары"]);
  const rateAt = wordFrame(scene, t(lang, "жарым", "половиной"), 0.5);
  const fortyAt = wordFrame(scene, t(lang, "кырктан", "сороковая"), 0.7);
  const thousandAt = wordFrame(scene, t(lang, "миң", "тысячи"), 0.85);
  const n = 40;
  const ringP = prog(frame, 6, 50);
  const leave = prog(frame, rateAt, rateAt + 30, Easing.out(Easing.back(1.4)));
  return (
    <SoftBackground>
      <Caption text={t(lang, "Зекеттин өлчөмү", "Ставка закята")} delay={2} size={56} />
      {items.map((w, i) => (
        <Tag key={i} text={labels[i]} delay={wordFrame(scene, w, 0.1 + i * 0.05) - 2} x={160 + i * 253} y={430} bg={i % 2 ? colors.brandSoft : colors.brand} size={34} />
      ))}
      <Canvas>
        {Array.from({ length: n }).map((_, i) => {
          if (i >= Math.floor(ringP * n)) return null;
          const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
          const r = 330;
          const special = i === 0;
          const x = W / 2 + Math.cos(a) * r * (special ? 1 - leave : 1);
          const y = 880 + Math.sin(a) * r * (special ? 1 - leave : 1);
          return <Coin key={i} x={x} y={y} r={special ? 26 + leave * 60 : 26} glow={special && leave > 0.5} color={special ? colors.gold : "#EBC66B"} />;
        })}
      </Canvas>
      <BigLabel text={scene.caption ?? "2,5 %"} delay={rateAt + 14} size={130} y={880} color={colors.brandDeep} />
      {fortyAt > 0 && <Tag text="1 / 40" delay={fortyAt} x={W / 2} y={1150} bg={colors.terracotta} size={40} />}
      {scene.note && <Note text={scene.note} delay={thousandAt - 4} />}
    </SoftBackground>
  );
};

/* 6. Story: honest merchant at the bazaar shares 2.5% with a family */
const Story: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const countAt = wordFrame(scene, t(lang, "эсептеп", "посчитал"), 0.35);
  const giveAt = wordFrame(scene, t(lang, "берди", "передал"), 0.55);
  const warmAt = wordFrame(scene, t(lang, "жылуулук", "тепла"), 0.8);
  const exampleAt = wordFrame(scene, t(lang, "мисал", "пример"), 0.95, 1);
  const seasonP = linear(frame, 20, countAt);
  const leafColor = `hsl(${110 - seasonP * 80}, 45%, ${55 - seasonP * 10}%)`;
  const give = prog(frame, giveAt, giveAt + 45, Easing.inOut(Easing.cubic));
  const pan = -interpolate(frame, [giveAt - 20, giveAt + 40], [0, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const coinX = 300 + give * 480;
  const coinY = 980 - Math.sin(give * Math.PI) * 180;
  const notebook = pop(frame, countAt, { damping: 14 });
  const notebookOut = 1 - prog(frame, giveAt, giveAt + 10);
  return (
    <AbsoluteFill>
      <Sky mode="day" />
      <Sun x={880} y={360} r={50} />
      <Mountains y={760} />
      <Ground y={1120} color="#D9C9A3" color2="#C9B88E" />
      <Camera duration={durationInFrames} from={{ scale: 1.08 }} to={{ scale: 1.14 }}>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${pan}px)` }}>
          <Canvas>
            {/* bazaar canopy */}
            <g transform="translate(300 700)">
              <rect x={-230} y={0} width={460} height={60} fill={colors.terracotta} />
              {Array.from({ length: 6 }).map((_, i) => (
                <rect key={i} x={-230 + i * 77} y={0} width={38} height={60} fill="#F3E4C8" />
              ))}
              <rect x={-220} y={60} width={14} height={300} fill="#8C6A52" />
              <rect x={206} y={60} width={14} height={300} fill="#8C6A52" />
            </g>
            <Person x={300} y={990} scale={0.72} hat="kalpak" outfit="#3F6B8E" skin={colors.skin2} armR={give > 0 && give < 1 ? -70 : -20} armL={10} bob={floatY(frame, 3, 70)} />
            <g transform="translate(300 700)">
              {/* counter */}
              <rect x={-230} y={290} width={460} height={120} rx={10} fill="#B97A48" />
              <rect x={-230} y={290} width={460} height={20} fill="#8C5A32" />
              {Array.from({ length: 7 }).map((_, i) => (
                <circle key={i} cx={-180 + i * 45} cy={275} r={22} fill={i % 2 ? "#D94F4F" : "#E8A33D"} />
              ))}
              <rect x={30} y={250} width={180} height={40} rx={8} fill={colors.brandSoft} />
              <rect x={40} y={230} width={160} height={30} rx={8} fill="#7FB3D5" />
            </g>
            <Tree x={120} y={1120} scale={0.8} leaf={leafColor} sway={sway(frame, 1.5, 130)} />
            {/* family on the right */}
            <House x={960} y={1050} scale={0.8} wall="#EFE3D0" roof="#8FA5B5" />
            <Person x={820} y={1120} scale={0.7} hat="hijab" hatColor="#C98BA4" outfit="#6E8F6B" skin={colors.skin1} armR={give > 0.6 ? -60 : 0} bob={floatY(frame, 3, 80, 20)} flip />
            <Person x={900} y={1120} scale={0.7} child outfit="#D9A24A" skin={colors.skin2} bob={floatY(frame, 2, 60, 10)} flip />
            {/* notebook */}
            <g transform={`translate(430 ${640 + (1 - notebook) * 30}) scale(${notebook})`} opacity={notebook * notebookOut}>
              <rect x={-90} y={-70} width={180} height={140} rx={14} fill="#fff" stroke={colors.mint} strokeWidth={4} />
              <line x1={-60} y1={-30} x2={60} y2={-30} stroke={colors.mint} strokeWidth={8} strokeLinecap="round" />
              <line x1={-60} y1={0} x2={30} y2={0} stroke={colors.mint} strokeWidth={8} strokeLinecap="round" />
              <SvgText x={0} y={50} size={38} weight={900} color={colors.brand}>
                2,5 %
              </SvgText>
            </g>
            {give > 0 && give < 1 && <CoinStack x={coinX} y={coinY} count={3} width={60} />}
            {give >= 1 && <CoinStack x={780} y={990} count={3} width={60} />}
          </Canvas>
          {give >= 1 && <Sparkles x={840} y={960} count={10} spread={70} start={giveAt + 45} />}
          {warmAt > 0 && <Heart x={0} y={0} scale={0} />}
        </div>
      </Camera>
      <Canvas>
        {warmAt > 0 &&
          [0, 1, 2].map((i) => {
            const s = pop(frame, warmAt + i * 8, { damping: 12 });
            return <Heart key={i} x={560 + i * 120 + pan} y={560 - i * 30 - (1 - s) * 30} scale={0.5 * s} color={i % 2 ? colors.terracotta : colors.gold} />;
          })}
      </Canvas>
      <Badge text={scene.caption ?? ""} delay={2} />
      <Caption text={t(lang, "Адал соодагер", "Честный торговец")} delay={6} size={60} top={230} />
      {exampleAt > 0 && <Note text={t(lang, "Сабак берүүчү мисал, тарыхый окуя эмес", "Поучительный пример, не историческое событие")} delay={exampleAt - 30} />}
    </AbsoluteFill>
  );
};

/* 7. Society: village houses connected by threads of trust */
const Society: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const cleanAt = wordFrame(scene, t(lang, "тазалап", "очищает"), 0.3);
  const connectAt = wordFrame(scene, t(lang, "ишеним", "доверия"), 0.85);
  const quranAt = wordFrame(scene, t(lang, "куранда", "коране"), 0.2);
  const houses = [
    [200, 640], [540, 560], [880, 640], [300, 900], [780, 900], [540, 1120], [160, 1150], [920, 1150],
  ];
  const links: [number, number][] = [[0, 1], [1, 2], [0, 3], [2, 4], [3, 5], [4, 5], [3, 6], [4, 7], [1, 3], [1, 4]];
  const linkP = linear(frame, 20, connectAt + 30);
  const shine = prog(frame, cleanAt, cleanAt + 30);
  return (
    <SoftBackground glow="#E3F0E6">
      <Caption text={scene.caption ?? ""} delay={cleanAt - 4} size={60} />
      <Canvas>
        {links.map(([a, b], i) => {
          const p = Math.min(1, Math.max(0, linkP * links.length - i));
          const [x1, y1] = houses[a];
          const [x2, y2] = houses[b];
          return <line key={i} x1={x1} y1={y1 - 60} x2={x1 + (x2 - x1) * p} y2={y1 - 60 + (y2 - y1) * p} stroke={colors.gold} strokeWidth={6} strokeLinecap="round" opacity={0.85} />;
        })}
        {houses.map(([x, y], i) => {
          const s = pop(frame, 4 + i * 4, { damping: 14 });
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
              <House x={0} y={0} scale={0.55} wall={i % 3 === 0 ? "#F3E4C8" : i % 3 === 1 ? "#EFE3D0" : "#E7E9DC"} roof={i % 2 ? colors.terracotta : "#8FA5B5"} lit={linkP > i / houses.length} />
            </g>
          );
        })}
        {/* heart-coin center */}
        <g transform={`translate(${W / 2} 830) scale(${0.9 + shine * 0.2})`}>
          <circle r={90} fill={colors.gold} opacity={0.15 + shine * 0.2} />
          <circle r={62} fill={colors.gold} />
          <Heart x={0} y={8} scale={0.75} color={colors.brand} />
          {/* dust that gets cleaned */}
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={-40 + i * 20} cy={-20 + (i % 2) * 30} r={10} fill="#9A9A90" opacity={(1 - shine) * 0.9} transform={`translate(0 ${-shine * 60})`} />
          ))}
        </g>
      </Canvas>
      {shine > 0 && <Sparkles x={W / 2} y={820} count={16} spread={110} start={cleanAt} />}
      {scene.note && <Note text={scene.note} delay={quranAt} />}
    </SoftBackground>
  );
};

/* 8. Outro */
const Outro: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  return (
    <SoftBackground>
      <Caption text={scene.caption ?? ""} delay={6} size={72} top={300} />
      <LogoLockup delay={10} y={640} />
      <Sparkles x={W / 2} y={900} count={18} spread={300} start={20} size={6} />
    </SoftBackground>
  );
};

export const scenes: SceneMap = { hook: Hook, pillars: Pillars, nisab: Nisab, hawl: Hawl, rate: Rate, story: Story, society: Society, outro: Outro };
