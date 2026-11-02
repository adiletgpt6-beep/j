import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import type { SceneMap, SceneProps } from "../types";
import { colors, W, H } from "../theme";
import { Caption, Note, Tag } from "../components/Text";
import { Camera } from "../components/Camera";
import { LogoLockup, BrandChip } from "../components/Brand";
import { pop, prog, linear, wordFrame, floatY, sway, clamp01 } from "../components/anim";
import { Sky, Sun, Cloud, Mountains, Ground, Sparkles, House, Tree, Canvas, Person, Coin, Card, Check, Heart, SvgText, Phone } from "../illustrations";
import { StepBar, Desk, Folder, Van, Bridge, quadPoint, KgMap, KG_DOTS, WindowFrame, HandOnHeart, ClosedEyes, Pointer, BarChart, PieChart, Chair, Parcel } from "../illustrations/extra-06-07";
import { SoftBackground, Badge } from "../scenes/common";

const t = (lang: "ky" | "ru", ky: string, ru: string) => (lang === "ky" ? ky : ru);
const ease = Easing.inOut(Easing.cubic);

/* the recurring character of this video */
const HERO = { outfit: "#3F6B8E", skin: colors.skin2, hat: "kalpak" as const };

/* 1. Hook: at home by the window, zakat counted, a question, a path to the houses */
const Hook: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const countedAt = wordFrame(scene, t(lang, "эсептедиңиз", "посчитали"), 0.05);
  const reachAt = wordFrame(scene, t(lang, "жетишин", "дошёл"), 0.3);
  const howAt = wordFrame(scene, t(lang, "кантип", "как"), 0.5);
  const platformAt = wordFrame(scene, t(lang, "платформасы", "платформа"), 0.8);
  const sum = pop(frame, countedAt, { damping: 14 });
  const bubble = pop(frame, howAt, { damping: 12 });
  const bubbleOut = 1 - prog(frame, platformAt, platformAt + 12);
  const path = prog(frame, platformAt, platformAt + 50, ease);
  const housesIn = prog(frame, reachAt, reachAt + 30);
  const bob = floatY(frame, 3, 90);
  const px1 = 820, py1 = 850, pcx = 760, pcy = 560, px2 = 930, py2 = 690;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #F6EBD9 0%, #EEDFC7 100%)" }}>
      <Camera duration={durationInFrames} from={{ scale: 1.03 }} to={{ scale: 1.09, y: -14 }}>
        {/* floor */}
        <div style={{ position: "absolute", left: 0, top: 1130, width: W, height: H - 1130, background: "linear-gradient(180deg, #D9C4A0 0%, #CBB48E 100%)" }} />
        <Canvas>
          {/* window with dawn landscape */}
          <WindowFrame x={120} y={560} w={300} h={320} id="hookwin">
            <rect width={300} height={320} fill="#F6D7B8" />
            <circle cx={200} cy={110} r={40} fill="#F2B96B" />
            <path d="M-20 240 L60 170 L120 220 L190 150 L260 220 L330 180 L330 320 L-20 320Z" fill="#A9BFCD" />
            <path d="M-20 290 L80 230 L160 270 L240 230 L330 280 L330 320 L-20 320Z" fill="#7E9AAE" />
            <path d="M180 160 L190 150 L200 162 L190 168 Z" fill="#fff" />
          </WindowFrame>
          {/* faint vision of houses on the wall */}
          <g opacity={housesIn * 0.95} transform={`translate(0 ${(1 - housesIn) * 20})`}>
            <House x={860} y={720} scale={0.42} wall="#E5EFE8" roof={colors.brandSoft} windowOn={false} />
            <House x={960} y={700} scale={0.5} wall="#E5EFE8" roof={colors.brand} windowOn={false} />
            <House x={1040} y={730} scale={0.4} wall="#E5EFE8" roof={colors.brandSoft} windowOn={false} />
            <Tree x={790} y={740} scale={0.4} leaf="#BFD9C7" trunk="#C2B39A" sway={sway(frame, 1, 150)} />
          </g>
          {/* dotted path from the phone to the houses */}
          {path > 0 &&
            Array.from({ length: 14 }).map((_, i) => {
              const tt = (i + 0.5) / 14;
              if (tt > path) return null;
              const p = quadPoint(px1, py1, pcx, pcy, px2, py2, tt);
              return <circle key={i} cx={p.x} cy={p.y} r={8} fill={colors.gold} opacity={0.9} />;
            })}
          {path > 0.2 && <Coin x={quadPoint(px1, py1, pcx, pcy, px2, py2, Math.min(path, 1)).x} y={quadPoint(px1, py1, pcx, pcy, px2, py2, Math.min(path, 1)).y} r={22} glow />}
          {/* chair + hero */}
          <Chair x={290} y={1130} scale={1} />
          <Person x={330} y={1130} scale={1} sit hat={HERO.hat} outfit={HERO.outfit} skin={HERO.skin} armR={-45} armL={-10} bob={bob} />
          {/* desk with notebook and phone */}
          <Desk x={700} y={1000} w={520} />
          <g transform={`translate(590 ${930 + bob * 0.3})`}>
            <rect x={-105} y={-70} width={210} height={140} rx={14} fill="#FFFFFF" stroke={colors.mint} strokeWidth={4} />
            <rect x={-105} y={-70} width={16} height={140} rx={6} fill={colors.terracotta} />
            <line x1={-70} y1={-36} x2={60} y2={-36} stroke={colors.mint} strokeWidth={8} strokeLinecap="round" />
            <line x1={-70} y1={-6} x2={30} y2={-6} stroke={colors.mint} strokeWidth={8} strokeLinecap="round" />
            <g opacity={sum} transform={`translate(0 ${(1 - sum) * 10})`}>
              <SvgText x={-10} y={50} size={44} weight={900} color={colors.brand}>
                2,5 %
              </SvgText>
              <Check x={70} y={36} r={18} color={colors.brandSoft} />
            </g>
          </g>
          <Phone x={830} y={876} scale={0.28}>
            <rect x={30} y={90} width={360} height={60} rx={20} fill={colors.mint} />
            <rect x={30} y={190} width={360} height={110} rx={20} fill={colors.mintLight} />
            <rect x={30} y={330} width={360} height={110} rx={20} fill={colors.mintLight} />
            <rect x={30} y={470} width={360} height={110} rx={20} fill={colors.mintLight} />
            <rect x={60} y={680} width={300} height={80} rx={40} fill={colors.brand} />
          </Phone>
          {/* question bubble */}
          <g transform={`translate(430 ${640 + floatY(frame, 5, 70)}) scale(${bubble})`} opacity={bubble * bubbleOut}>
            <circle cx={-50} cy={70} r={14} fill="#fff" stroke={colors.mint} strokeWidth={4} />
            <circle cx={-30} cy={40} r={20} fill="#fff" stroke={colors.mint} strokeWidth={4} />
            <circle r={62} fill="#fff" stroke={colors.mint} strokeWidth={5} />
            <SvgText x={0} y={26} size={76} weight={900} color={colors.gold}>
              ?
            </SvgText>
          </g>
        </Canvas>
        {path >= 1 && <Sparkles x={940} y={700} count={10} spread={80} start={platformAt + 50} />}
      </Camera>
      <Caption text={scene.caption ?? ""} delay={10} size={80} top={240} />
      <BrandChip delay={4} />
    </AbsoluteFill>
  );
};

/* 2. Who: logo, givers on the left, families on the right, a bridge grows between them */
const Who: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const fundAt = wordFrame(scene, t(lang, "фонду", "фонд"), 0.15);
  const helpAt = wordFrame(scene, t(lang, "көмөктөшүү", "помочь"), 0.5);
  const supportAt = wordFrame(scene, t(lang, "колдоо", "поддержать"), 0.75);
  const bridgeP = prog(frame, helpAt, helpAt + 45, ease);
  const travel = ((frame - helpAt - 45) % 90) / 90;
  const coinT = bridgeP >= 1 ? clamp01(travel) : -1;
  const coin = coinT >= 0 ? quadPoint(330, 1070, 545, 850, 760, 1070, coinT) : null;
  return (
    <SoftBackground glow="#DDEFE2">
      <Caption text={scene.caption ?? ""} delay={fundAt - 6} size={64} />
      <LogoLockup delay={4} y={430} scale={0.6} showUrl={false} />
      <Canvas>
        {/* ground line */}
        <rect x={60} y={1150} width={W - 120} height={14} rx={7} fill={colors.mint} opacity={prog(frame, 0, 10)} />
        <Bridge x1={330} x2={760} y={1120} rise={135} progress={bridgeP} />
        {/* givers */}
        {[0, 1].map((i) => {
          const s = pop(frame, 6 + i * 5, { damping: 14 });
          return (
            <g key={i} transform={`translate(${170 + i * 115} 1150) scale(${s})`}>
              <Person x={0} y={0} scale={i === 0 ? 0.78 : 0.72} hat={i === 0 ? "kalpak" : "hijab"} hatColor={i === 0 ? "#F7F3EA" : "#C98BA4"} outfit={i === 0 ? colors.brand : "#6E8F6B"} skin={i === 0 ? colors.skin2 : colors.skin1} bob={floatY(frame, 3, 80, i * 20)} armR={bridgeP >= 1 ? -50 : 0} />
            </g>
          );
        })}
        {/* families */}
        {[0, 1, 2].map((i) => {
          const s = pop(frame, 14 + i * 5, { damping: 14 });
          const cfg = [
            { x: 820, sc: 0.72, hat: "elechek" as const, outfit: "#8E5D6E", skin: colors.skin1 },
            { x: 905, sc: 0.72, hat: "none" as const, outfit: "#D9A24A", skin: colors.skin2 },
            { x: 985, sc: 0.78, hat: "cap" as const, outfit: "#4F6F8F", skin: colors.skin3 },
          ][i];
          return (
            <g key={i} transform={`translate(${cfg.x} 1150) scale(${s})`}>
              <Person x={0} y={0} scale={cfg.sc} child={i === 1} hat={cfg.hat} hatColor="#DCE6EE" outfit={cfg.outfit} skin={cfg.skin} bob={floatY(frame, 3, 80, 30 + i * 15)} armL={bridgeP >= 1 ? 50 : 0} />
            </g>
          );
        })}
        {coin && <Coin x={coin.x} y={coin.y - 60} r={24} glow />}
      </Canvas>
      <Tag text={t(lang, "Бергендер", "Те, кто делится")} delay={8} x={220} y={690} bg={colors.brand} size={32} />
      <Tag text={t(lang, "Колдоого муктаждар", "Кому нужна поддержка")} delay={16} x={870} y={690} bg={colors.terracotta} size={32} />
      <Canvas>
        {supportAt > 0 &&
          [0, 1, 2].map((i) => {
            const s = pop(frame, supportAt + i * 7, { damping: 12 });
            return <Heart key={i} x={830 + i * 70} y={760 - i * 25 - (1 - s) * 30} scale={0.45 * s} color={i % 2 ? colors.gold : colors.terracotta} />;
          })}
      </Canvas>
      {bridgeP >= 1 && <Sparkles x={545} y={900} count={10} spread={120} start={helpAt + 45} size={6} />}
    </SoftBackground>
  );
};

/* 3. Step 1: calculator on a phone */
const Step1: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const calcAt = wordFrame(scene, t(lang, "калькулятору", "калькулятор"), 0.3);
  const infoAt = wordFrame(scene, t(lang, "маалыматтык", "информационный"), 0.6);
  const nisabAt = wordFrame(scene, "нисаб", 0.85);
  const fields = [
    { label: t(lang, "Накталай", "Наличные"), value: 120000 },
    { label: t(lang, "Алтын", "Золото"), value: 50000 },
    { label: t(lang, "Товар", "Товары"), value: 80000 },
  ];
  const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/ /g, " ");
  const sumAt = calcAt + 90;
  const sumS = pop(frame, sumAt, { damping: 13 });
  const nisabS = pop(frame, nisabAt, { damping: 14 });
  const phoneS = pop(frame, 6, { damping: 15, stiffness: 90 });
  return (
    <SoftBackground tint="#EEF6F0" glow="#FFFFFF">
      <Caption text={scene.caption ?? ""} delay={4} size={64} />
      <Camera duration={durationInFrames} from={{ scale: 1 }} to={{ scale: 1.05, y: -10 }}>
        <Canvas>
          <StepBar current={1} frame={frame} />
          <g transform={`translate(540 ${840 + floatY(frame, 4, 110)}) scale(${0.66 * (0.9 + 0.1 * phoneS)}) translate(-540 -840)`} opacity={phoneS}>
            <Phone x={540} y={840} scale={1}>
              <rect x={0} y={0} width={420} height={120} rx={44} fill={colors.brand} />
              <rect x={0} y={80} width={420} height={40} fill={colors.brand} />
              <SvgText x={210} y={92} size={46} weight={900} color="#fff">
                {t(lang, "Калькулятор", "Калькулятор")}
              </SvgText>
              {fields.map((f, i) => {
                const at = calcAt + i * 26;
                const p = prog(frame, at, at + 24);
                const s = pop(frame, at - 10, { damping: 15 });
                return (
                  <g key={i} transform={`translate(0 ${160 + i * 136})`} opacity={s}>
                    <SvgText x={30} y={0} size={34} weight={700} color={colors.inkSoft} anchor="start">
                      {f.label}
                    </SvgText>
                    <rect x={30} y={16} width={360} height={80} rx={20} fill={colors.mintLight} stroke={p >= 1 ? colors.brandSoft : colors.mint} strokeWidth={4} />
                    <SvgText x={54} y={70} size={48} weight={800} color={colors.brandDeep} anchor="start">
                      {p > 0 ? fmt(Math.round(f.value * p)) : ""}
                    </SvgText>
                    {p > 0 && p < 1 && <rect x={54 + fmt(Math.round(f.value * p)).length * 27} y={34} width={4} height={44} fill={colors.brand} opacity={Math.sin(frame / 3) > 0 ? 1 : 0} />}
                  </g>
                );
              })}
              {/* result */}
              <g transform={`translate(0 ${600 + (1 - sumS) * 20})`} opacity={sumS}>
                <rect x={30} y={0} width={360} height={130} rx={24} fill={colors.brand} />
                <SvgText x={54} y={46} size={32} weight={700} color="rgba(255,255,255,0.8)" anchor="start">
                  {t(lang, "Зекет 2,5 %", "Закят 2,5 %")}
                </SvgText>
                <SvgText x={54} y={106} size={56} weight={900} color="#fff" anchor="start">
                  6 250 {t(lang, "сом", "сом")}
                </SvgText>
              </g>
              <g transform={`translate(0 ${760 + (1 - nisabS) * 20})`} opacity={nisabS}>
                <rect x={30} y={0} width={360} height={70} rx={35} fill={colors.gold} />
                <Check x={70} y={35} r={22} color={colors.brandDeep} />
                <SvgText x={106} y={48} size={36} weight={900} color={colors.brandDeep} anchor="start">
                  {t(lang, "Нисабга жетти", "Нисаб достигнут")}
                </SvgText>
              </g>
            </Phone>
          </g>
          {/* floating coins around the phone */}
          {[0, 1, 2].map((i) => {
            const s = pop(frame, sumAt + 8 + i * 6, { damping: 12 });
            const px = [250, 830, 800][i];
            const py = [900, 760, 1000][i];
            return <Coin key={i} x={px} y={py + floatY(frame, 8, 80, i * 30)} r={30 * s} glow />;
          })}
        </Canvas>
        {sumS > 0.5 && <Sparkles x={540} y={1000} count={10} spread={200} start={sumAt} size={6} />}
      </Camera>
      <Badge text="Иллюстрация" delay={2} />
      <Note text={t(lang, "Калькулятор маалыматтык мүнөздө", "Калькулятор носит информационный характер")} delay={infoAt - 4} size={32} />
    </SoftBackground>
  );
};

/* 4. Step 2: intention — quiet dusk, hand on heart */
const Step2: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const niyatAt = wordFrame(scene, t(lang, "ниет", "намерение"), 0.1);
  const heartAt = wordFrame(scene, t(lang, "жүрөктөн", "искренне"), 0.6);
  const hand = prog(frame, niyatAt + 6, niyatAt + 30, ease);
  const eyes = prog(frame, niyatAt + 20, niyatAt + 40);
  const glow = 0.6 + 0.4 * Math.sin(frame / 14);
  const heartGlow = prog(frame, heartAt, heartAt + 30) * glow;
  const bob = floatY(frame, 3, 120);
  const P = { x: 540, y: 1190, scale: 1.22 };
  return (
    <AbsoluteFill>
      <Sky mode="dusk" />
      {/* soft light from above */}
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: `radial-gradient(ellipse at 50% 30%, rgba(255,236,190,${0.55 + 0.15 * glow}) 0%, rgba(255,236,190,0) 55%)` }} />
      <Camera duration={durationInFrames} from={{ scale: 1.02 }} to={{ scale: 1.08, y: -16 }}>
        <Canvas>
          {/* light rays */}
          <g transform={`translate(540 380) rotate(${Math.sin(frame / 90) * 3})`} opacity={0.22}>
            {[-40, -20, 0, 20, 40].map((a) => (
              <path key={a} d="M0 0 L-70 900 L70 900 Z" fill="#FFE49A" transform={`rotate(${a})`} />
            ))}
          </g>
        </Canvas>
        <Mountains y={900} far="#E2C5B3" near="#D4AE9A" />
        <Ground y={1190} color="#E3CDA6" color2="#D4BA8E" />
        <Canvas>
          <Tree x={150} y={1230} scale={0.75} leaf="#C9A88A" trunk="#A07A60" sway={sway(frame, 1.2, 150)} />
          <Tree x={940} y={1240} scale={0.6} leaf="#D4B295" trunk="#A07A60" sway={sway(frame, 1.2, 170, 40)} />
          <Person x={P.x} y={P.y} scale={P.scale} hat="kalpak" outfit={HERO.outfit} skin={HERO.skin} armL={8} armR={0} bob={bob} smile />
          <g opacity={hand}>
            <HandOnHeart x={P.x} y={P.y} scale={P.scale} outfit={HERO.outfit} skin={HERO.skin} bob={bob} glow={heartGlow} />
          </g>
          <ClosedEyes x={P.x} y={P.y} scale={P.scale} skin={HERO.skin} bob={bob} amount={eyes} />
          <StepBar current={2} frame={frame} />
        </Canvas>
        <Sparkles x={540} y={1000} count={12} spread={260} start={heartAt} color="#FFE49A" size={5} />
      </Camera>
      <Caption text={scene.caption ?? ""} delay={niyatAt - 8} size={72} color={colors.brandDeep} />
    </AbsoluteFill>
  );
};

/* 5. Step 3: map with projects, choose, send */
const Step3: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const regionsAt = wordFrame(scene, t(lang, "аймактары", "регионам"), 0.3);
  const projectAt = wordFrame(scene, t(lang, "долбоор", "проект"), 0.45);
  const fundAt = wordFrame(scene, t(lang, "жалпы", "общий"), 0.62);
  const sendAt = wordFrame(scene, t(lang, "багыттоого", "направить"), 0.55);
  const illuAt = wordFrame(scene, t(lang, "иллюстрация", "иллюстрации"), 0.9);
  const phoneS = pop(frame, 6, { damping: 15, stiffness: 90 });
  const mapScale = 0.82;
  const phonePos = { x: 330, y: 860, s: 0.62 };
  // screen -> world conversion
  const toWorld = (sx: number, sy: number) => ({ x: phonePos.x + (sx - 210) * phonePos.s, y: phonePos.y + (sy - 430) * phonePos.s });
  const osh = toWorld(30 + KG_DOTS[5][0] * mapScale, 230 + KG_DOTS[5][1] * mapScale);
  const pressAt = regionsAt + 40;
  const sendPress = sendAt + 30;
  // pointer keyframes
  const ptrX = interpolate(frame, [regionsAt, pressAt, sendAt + 6, sendPress], [1150, osh.x, osh.x, 790], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const ptrY = interpolate(frame, [regionsAt, pressAt, sendAt + 6, sendPress], [1300, osh.y, osh.y, 1070], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const press1 = frame > pressAt && frame < pressAt + 12 ? 1 : 0;
  const press2 = frame > sendPress && frame < sendPress + 12 ? 1 : 0;
  const ptrOpacity = prog(frame, regionsAt, regionsAt + 10) * (1 - prog(frame, sendPress + 30, sendPress + 42));
  const activeDot = frame >= pressAt ? 5 : -1;
  const cardS = pop(frame, projectAt, { damping: 14 });
  const fundS = pop(frame, fundAt, { damping: 14 });
  const sendS = pop(frame, sendAt, { damping: 14 });
  const sent = pop(frame, sendPress + 8, { damping: 12 });
  const fly = prog(frame, sendPress + 10, sendPress + 50, ease);
  return (
    <SoftBackground tint="#EEF4F8" glow="#DCE9F1">
      <Caption text={scene.caption ?? ""} delay={4} size={64} />
      <Camera duration={durationInFrames} from={{ scale: 1 }} to={{ scale: 1.04, x: 10 }}>
        <Canvas>
          <StepBar current={3} frame={frame} />
          <g transform={`translate(${phonePos.x} ${phonePos.y}) scale(${phonePos.s * (0.9 + 0.1 * phoneS)}) translate(${-phonePos.x} ${-phonePos.y})`} opacity={phoneS}>
            <Phone x={phonePos.x} y={phonePos.y} scale={1}>
              <rect x={0} y={0} width={420} height={120} rx={44} fill={colors.brand} />
              <rect x={0} y={80} width={420} height={40} fill={colors.brand} />
              <SvgText x={210} y={92} size={46} weight={900} color="#fff">
                {t(lang, "Долбоорлор", "Проекты")}
              </SvgText>
              <rect x={20} y={150} width={380} height={300} rx={30} fill="#F4F8FB" />
              <KgMap x={30} y={230} scale={mapScale} dots dotOpacity={(i) => pop(frame, regionsAt + i * 4, { damping: 14 })} activeDot={activeDot} frame={frame} />
              {/* list lines below the map */}
              {[0, 1, 2].map((i) => (
                <g key={i} transform={`translate(0 ${500 + i * 100})`} opacity={pop(frame, regionsAt + 10 + i * 5, { damping: 14 })}>
                  <rect x={20} y={0} width={380} height={80} rx={20} fill={i === 1 && activeDot >= 0 ? colors.gold : colors.mintLight} />
                  <circle cx={60} cy={40} r={16} fill={colors.brand} />
                  <rect x={96} y={26} width={i === 1 ? 200 : 150} height={12} rx={6} fill={colors.mint} />
                  <rect x={96} y={48} width={100} height={10} rx={5} fill={colors.mint} />
                </g>
              ))}
            </Phone>
          </g>
          {/* project card */}
          <g transform={`translate(790 ${780 + floatY(frame, 3, 100)}) scale(${0.85 + 0.15 * cardS})`} opacity={cardS}>
            <Card x={0} y={0} w={400} h={300} radius={32}>
              <SvgText x={-160} y={-98} size={38} weight={900} color={colors.brandDeep} anchor="start">
                {t(lang, "Долбоор", "Проект")}
              </SvgText>
              <rect x={60} y={-128} width={100} height={46} rx={23} fill={colors.gold} />
              <SvgText x={110} y={-96} size={30} weight={900} color={colors.brandDeep}>
                Ош
              </SvgText>
              <rect x={-160} y={-60} width={320} height={16} rx={8} fill={colors.mint} />
              <rect x={-160} y={-30} width={220} height={16} rx={8} fill={colors.mint} />
              <rect x={-160} y={10} width={320} height={28} rx={14} fill={colors.mintLight} />
              <rect x={-160} y={10} width={320 * 0.62 * prog(frame, projectAt + 10, projectAt + 40)} height={28} rx={14} fill={colors.brandSoft} />
              <Heart x={130} y={90} scale={0.5} color={colors.terracotta} />
              <SvgText x={-160} y={104} size={34} weight={800} color={colors.inkSoft} anchor="start">
                {t(lang, "Колдоо", "Поддержка")}
              </SvgText>
            </Card>
          </g>
          {/* option chips */}
          <g transform={`translate(680 960) scale(${cardS})`} opacity={cardS}>
            <rect x={-100} y={-34} width={200} height={68} rx={34} fill={colors.brand} />
            <SvgText x={0} y={12} size={32} weight={800} color="#fff">
              {t(lang, "Долбоор", "Проект")}
            </SvgText>
          </g>
          <g transform={`translate(905 960) scale(${fundS})`} opacity={fundS}>
            <rect x={-110} y={-34} width={220} height={68} rx={34} fill="#fff" stroke={colors.brand} strokeWidth={4} />
            <SvgText x={0} y={12} size={32} weight={800} color={colors.brandDeep}>
              {t(lang, "Жалпы фонд", "Общий фонд")}
            </SvgText>
          </g>
          {/* send button */}
          <g transform={`translate(790 1070) scale(${sendS * (press2 ? 0.94 : 1)})`} opacity={sendS}>
            <rect x={-160} y={-42} width={320} height={84} rx={42} fill={sent > 0.5 ? colors.brandSoft : colors.gold} />
            {sent > 0.5 ? (
              <g>
                <circle cx={-118} cy={0} r={24} fill="#fff" />
                <Check x={-118} y={0} r={19} color={colors.brandSoft} />
                <SvgText x={-82} y={13} size={34} weight={900} color="#fff" anchor="start">
                  {t(lang, "Жөнөтүлдү", "Отправлено")}
                </SvgText>
              </g>
            ) : (
              <SvgText x={0} y={14} size={40} weight={900} color={colors.brandDeep}>
                {t(lang, "Жөнөтүү", "Отправить")} →
              </SvgText>
            )}
          </g>
          {/* coin flies from the button to the map */}
          {fly > 0 && fly < 1 && <Coin x={790 + (osh.x - 790) * fly} y={1070 + (osh.y - 1070) * fly - Math.sin(fly * Math.PI) * 200} r={24} glow />}
          <g opacity={ptrOpacity}>
            <Pointer x={ptrX} y={ptrY} scale={1} press={press1 || press2} />
          </g>
        </Canvas>
        {fly >= 1 && <Sparkles x={osh.x} y={osh.y} count={10} spread={60} start={sendPress + 50} size={6} />}
      </Camera>
      <Badge text="Иллюстрация" delay={2} />
      <Note text={t(lang, "Интерфейс — иллюстрация", "Интерфейс показан для иллюстрации")} delay={illuAt - 10} size={32} />
    </SoftBackground>
  );
};

/* 6. Step 4: fund staff review the appeals, then help travels to a village */
const Step4: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const appealsAt = wordFrame(scene, t(lang, "кайрылууларды", "обращения"), 0.2);
  const checkAt = wordFrame(scene, t(lang, "текшерип", "проверяет"), 0.38);
  const panAt = wordFrame(scene, t(lang, "бөлүштүрөт", "распределяет"), 0.55);
  const sectionAt = wordFrame(scene, t(lang, "бөлүм", "раздел"), 0.9);
  const pan = prog(frame, panAt, panAt + 50, ease) * -W;
  const vanAt = panAt + 35;
  const vanDur = Math.max(70, durationInFrames - vanAt - 25);
  const vt = prog(frame, vanAt, vanAt + vanDur, Easing.inOut(Easing.quad));
  const road = { x1: -80, y1: 800, cx: 420, cy: 760, x2: 560, y2: 1090 };
  const vp = quadPoint(road.x1, road.y1, road.cx, road.cy, road.x2, road.y2, vt);
  const arrived = vt >= 1;
  const greet = pop(frame, vanAt + vanDur, { damping: 12 });
  return (
    <AbsoluteFill style={{ background: "#F3E7D3" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${pan}px)` }}>
        {/* panel A: office */}
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: "linear-gradient(180deg, #F3E7D3 0%, #EADCC4 100%)" }}>
          <div style={{ position: "absolute", left: 0, top: 1110, width: W, height: H - 1110, background: "#D9C4A0" }} />
          <Canvas>
            {/* wall frame with the logo-like plant */}
            <rect x={120} y={600} width={220} height={160} rx={16} fill="#FFFFFF" />
            <KgMap x={140} y={635} scale={0.42} fill={colors.mint} stroke={colors.brandSoft} dots={false} />
            {/* appeals: envelopes sliding to the desk */}
            {[0, 1, 2].map((i) => {
              const p = prog(frame, appealsAt + i * 8, appealsAt + 30 + i * 8, ease);
              const x = 1150 - p * (760 - i * 40);
              const y = 700 + p * 220 + Math.sin(p * Math.PI) * -60;
              return (
                <g key={i} transform={`translate(${x} ${y}) rotate(${(1 - p) * 20})`} opacity={prog(frame, appealsAt + i * 8, appealsAt + i * 8 + 6)}>
                  <rect x={-50} y={-34} width={100} height={68} rx={8} fill="#fff" stroke={colors.mint} strokeWidth={4} />
                  <path d="M-50 -34 L0 6 L50 -34" fill="none" stroke={colors.brandSoft} strokeWidth={5} strokeLinejoin="round" />
                </g>
              );
            })}
            {/* staff behind the desk */}
            <Person x={400} y={1150} scale={0.85} hat="hijab" hatColor="#C98BA4" outfit="#6E8F6B" skin={colors.skin1} armR={-60} bob={floatY(frame, 3, 90)} />
            <Person x={660} y={1150} scale={0.85} hat="cap" hatColor="#4F6F8F" outfit={colors.brand} skin={colors.skin3} armL={60} bob={floatY(frame, 3, 90, 30)} />
            <Desk x={540} y={990} w={640} />
            {[0, 1, 2].map((i) => {
              const s = pop(frame, 10 + i * 6, { damping: 14 });
              const chk = prog(frame, checkAt + i * 14, checkAt + 20 + i * 14);
              return (
                <g key={i} transform={`translate(${380 + i * 160} 940) scale(${s})`}>
                  <Folder x={0} y={0} scale={0.85} color={["#F0C96A", "#9FC3D6", "#E8B4A0"][i]} check={chk} rotate={(i - 1) * 4} />
                </g>
              );
            })}
            <Chair x={330} y={1150} scale={0.8} color="#8E5D6E" />
          </Canvas>
        </div>
        {/* panel B: mountain road to the village */}
        <div style={{ position: "absolute", left: W, top: 0, width: W, height: H, overflow: "hidden" }}>
          <Sky mode="day" />
          <Sun x={940} y={620} r={46} />
          <Cloud x={100} y={560} scale={0.8} speed={0.2} opacity={0.85} />
          <Mountains y={600} />
          <Ground y={980} color="#A7BD7A" color2="#8FAA66" />
          <Canvas>
            {/* road */}
            <path d={`M${road.x1} ${road.y1} Q ${road.cx} ${road.cy} ${road.x2} ${road.y2}`} stroke="#B9A98C" strokeWidth={70} fill="none" strokeLinecap="round" />
            <path d={`M${road.x1} ${road.y1} Q ${road.cx} ${road.cy} ${road.x2} ${road.y2}`} stroke="#F3E4C8" strokeWidth={6} fill="none" strokeDasharray="30 30" />
            <Tree x={160} y={980} scale={0.7} sway={sway(frame, 1.5, 140)} />
            <Tree x={1010} y={1000} scale={0.7} sway={sway(frame, 1.5, 160, 50)} />
            <House x={930} y={1090} scale={0.85} lit />
            {/* family greeting */}
            <Person x={720} y={1130} scale={0.72} hat="elechek" outfit="#8E5D6E" skin={colors.skin1} armR={arrived ? -70 * greet : 0} bob={floatY(frame, 3, 80)} />
            <Person x={800} y={1130} scale={0.72} child outfit="#D9A24A" skin={colors.skin2} armR={arrived ? -90 * greet : 0} bob={floatY(frame, 2, 60, 20)} />
            <Person x={860} y={1130} scale={0.74} hat="cap" hatColor="#4F6F8F" outfit="#4F6F8F" skin={colors.skin3} armR={arrived ? -60 * greet : 0} bob={floatY(frame, 3, 80, 40)} />
            {/* van */}
            <Van x={vp.x} y={vp.y} scale={0.52 + vt * 0.1} wheel={frame * 8} />
            {arrived && (
              <g opacity={greet}>
                <Parcel x={650} y={1130} scale={0.8} />
              </g>
            )}
          </Canvas>
          {arrived && <Sparkles x={760} y={1000} count={10} spread={120} start={vanAt + vanDur} size={6} />}
          <Canvas>
            {arrived &&
              [0, 1, 2].map((i) => {
                const s = pop(frame, vanAt + vanDur + 6 + i * 7, { damping: 12 });
                return <Heart key={i} x={700 + i * 70} y={880 - i * 25 - (1 - s) * 30} scale={0.45 * s} color={i % 2 ? colors.gold : colors.terracotta} />;
              })}
          </Canvas>
        </div>
      </div>
      <Canvas>
        <StepBar current={4} frame={frame} />
      </Canvas>
      <Caption text={scene.caption ?? ""} delay={4} size={64} />
      <Note text={t(lang, "Сайтта колдоо сурагандар үчүн бөлүм бар", "На сайте есть раздел для тех, кому нужна поддержка")} delay={sectionAt - 12} size={32} />
    </AbsoluteFill>
  );
};

/* 7. Step 5: report with charts; the hero reads it with relief */
const Step5: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const reportAt = wordFrame(scene, t(lang, "отчет", "отчёт"), 0.1);
  const publishAt = wordFrame(scene, t(lang, "жарыялайт", "публикует"), 0.4);
  const siteAt = wordFrame(scene, t(lang, "сайттын", "сайте"), 0.85);
  const cardS = pop(frame, reportAt, { damping: 14, stiffness: 90 });
  const grow = prog(frame, publishAt, publishAt + 50);
  const rows = prog(frame, publishAt + 20, publishAt + 70);
  const heroS = pop(frame, 8, { damping: 14 });
  const relief = pop(frame, publishAt + 40, { damping: 12 });
  const rowColors = [colors.brand, colors.gold, colors.brandSoft, colors.terracotta];
  return (
    <SoftBackground tint="#FBF4E4" glow="#F3E2BD">
      <Caption text={scene.caption ?? ""} delay={4} size={64} />
      <Camera duration={durationInFrames} from={{ scale: 1 }} to={{ scale: 1.05, x: -8 }}>
        <Canvas>
          <StepBar current={5} frame={frame} />
          <g transform={`translate(430 ${860 + floatY(frame, 3, 110)}) scale(${0.85 + 0.15 * cardS})`} opacity={cardS}>
            <Card x={0} y={0} w={560} h={560} radius={36}>
              <rect x={-280} y={-280} width={560} height={90} rx={36} fill={colors.brand} />
              <rect x={-280} y={-230} width={560} height={40} fill={colors.brand} />
              <SvgText x={-240} y={-222} size={40} weight={900} color="#fff" anchor="start">
                {t(lang, "Отчет", "Отчёт")}
              </SvgText>
              <circle cx={230} cy={-235} r={18} fill={colors.gold} />
              <BarChart x={-250} y={-150} w={280} h={200} values={[0.55, 0.9, 0.7, 0.4]} grow={grow} />
              <PieChart x={160} y={-50} r={90} values={[0.4, 0.3, 0.2, 0.1]} reveal={grow} />
              {/* rows */}
              {[0, 1, 2, 3].map((i) => {
                const p = clamp01(rows * 4 - i);
                return (
                  <g key={i} transform={`translate(0 ${100 + i * 46})`} opacity={p}>
                    <circle cx={-240} cy={0} r={12} fill={rowColors[i]} />
                    <rect x={-210} y={-8} width={(200 + (i % 2) * 60) * p} height={16} rx={8} fill={colors.mint} />
                    <rect x={120} y={-8} width={120 * p} height={16} rx={8} fill={rowColors[i]} opacity={0.6} />
                  </g>
                );
              })}
            </Card>
          </g>
          {/* hero reading */}
          <g transform={`translate(880 1200) scale(${heroS})`}>
            <Person x={0} y={0} scale={0.92} hat={HERO.hat} outfit={HERO.outfit} skin={HERO.skin} armR={-100} armL={10} bob={floatY(frame, 3, 90)} flip />
          </g>
          {relief > 0 && (
            <g transform={`translate(820 ${720 - (1 - relief) * 20}) scale(${relief})`}>
              <Heart x={0} y={0} scale={0.6} color={colors.terracotta} />
            </g>
          )}
        </Canvas>
        {grow >= 1 && <Sparkles x={430} y={700} count={10} spread={220} start={publishAt + 50} size={6} />}
      </Camera>
      <Badge text="Иллюстрация" delay={2} />
      <Note text={t(lang, "Так маалымат — сайттын өзүндө", "Подробности — на самом сайте")} delay={siteAt - 6} size={32} />
    </SoftBackground>
  );
};

/* 8. Outro: the five steps complete, logo */
const Outro: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  return (
    <SoftBackground>
      <Caption text={scene.caption ?? ""} delay={6} size={76} top={270} />
      <Canvas>
        <StepBar current={6} frame={frame} y={520} />
      </Canvas>
      <LogoLockup delay={14} y={600} scale={0.9} showUrl={false} />
      <Sparkles x={W / 2} y={1000} count={18} spread={320} start={24} size={6} />
    </SoftBackground>
  );
};

export const scenes: SceneMap = { hook: Hook, who: Who, step1: Step1, step2: Step2, step3: Step3, step4: Step4, step5: Step5, outro: Outro };
