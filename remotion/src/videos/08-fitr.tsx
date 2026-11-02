import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import type { SceneMap, SceneProps } from "../types";
import { colors, W, H } from "../theme";
import { Caption, Note, Tag } from "../components/Text";
import { Camera } from "../components/Camera";
import { LogoLockup } from "../components/Brand";
import { pop, prog, linear, wordFrame, floatY, sway } from "../components/anim";
import { Sky, Sun, Cloud, Mountains, Ground, Sparkles, House, Yurt, Mosque, Tree, Canvas, Person, Coin, Scale, Card, Check, Hands, Heart, Wheat, SvgText } from "../illustrations";
import { Crescent, Stars, Lantern, Dastorkon, CalendarIcon, Barley, Raisins, DatesFruit, Megaphone } from "../illustrations/extra-08-09";
import { SoftBackground } from "../scenes/common";

const t = (lang: "ky" | "ru", ky: string, ru: string) => (lang === "ky" ? ky : ru);
const CREAM = "#FAF6EE";

/* 1. Hook: Ramadan evening — lanterns, crescent, lit windows, dastorkon, calendar of the last days */
const Hook: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const endAt = wordFrame(scene, t(lang, "аяктап", "концу"), 0.1);
  const prepAt = wordFrame(scene, t(lang, "майрамга", "празднику"), 0.35);
  const fitrAt = wordFrame(scene, t(lang, "фитир", "фитр"), 0.85);
  const dayP = linear(frame, endAt, endAt + 70);
  const day = 27 + Math.min(2, Math.floor(dayP * 3));
  const moonGlow = 0.12 + 0.08 * Math.sin(frame / 18) + 0.15 * prog(frame, fitrAt, fitrAt + 20);
  const tableP = prog(frame, 8, 70);
  return (
    <AbsoluteFill style={{ background: colors.nightDeep }}>
      <Camera duration={durationInFrames} from={{ scale: 1.03 }} to={{ scale: 1.09, y: -14 }}>
        <Sky mode="night" />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 26% at 50% 44%, rgba(233,181,145,0.45) 0%, rgba(233,181,145,0) 70%)" }} />
        <Canvas>
          <Stars frame={frame} count={46} top={30} height={640} />
          <Crescent x={880} y={500} r={46} glow={moonGlow} />
        </Canvas>
        <Mountains y={760} far="#3A4F6E" near="#2A3C58" parallax={0.08} />
        <Ground y={1060} color="#30503F" color2="#24402F" />
        <Canvas>
          {/* lantern string */}
          <path d="M-20 505 Q 400 600 760 520" fill="none" stroke={colors.goldDeep} strokeWidth={4} opacity={0.9} />
          {[150, 330, 510, 690].map((lx, i) => {
            const ly = 505 + Math.sin(((lx + 20) / 780) * Math.PI) * 78 - (lx > 400 ? (lx - 400) * 0.02 : 0);
            const lit = prog(frame, prepAt + i * 7, prepAt + i * 7 + 16);
            return <Lantern key={i} x={lx} y={ly} scale={0.78} lit={lit} swing={sway(frame, 3, 110, i * 30)} />;
          })}
          <Tree x={70} y={1120} scale={0.75} leaf="#355C47" trunk="#4B3A2F" sway={sway(frame, 1.4, 150)} />
          <Tree x={1010} y={1130} scale={0.85} leaf="#2F5240" trunk="#4B3A2F" sway={sway(frame, 1.4, 170, 60)} />
          <House x={240} y={1090} scale={0.9} wall="#D9C6A5" roof="#7A4F3F" lit />
          <House x={840} y={1100} scale={0.85} wall="#CDBDA3" roof="#5F6F82" lit />
          <Yurt x={560} y={1112} scale={0.55} />
          {/* calendar: last days of Ramadan */}
          <g transform={`translate(430 ${965 + floatY(frame, 3, 80)}) scale(${pop(frame, endAt - 6, { damping: 15 })})`}>
            <CalendarIcon x={0} y={0} scale={1.05} header={t(lang, "РАМАЗАН", "РАМАДАН")} label={String(day)} labelSize={54} />
          </g>
          {/* dastorkon in the foreground */}
          <Dastorkon x={540} y={1172} scale={1.05} items={tableP} steam={0.6 + 0.4 * Math.sin(frame / 15)} cloth="#B8463F" />
        </Canvas>
        {frame >= fitrAt && <Sparkles x={540} y={1120} count={14} spread={200} start={fitrAt} size={6} />}
      </Camera>
      <Caption text={scene.caption ?? ""} delay={10} size={84} top={230} color={CREAM} />
    </AbsoluteFill>
  );
};

/* 2. Why: two cards — fasting person cleansed of dust specks vs. a family's table filled with food */
const Why: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const hadithAt = wordFrame(scene, t(lang, "хадисте", "хадисе"), 0.1);
  const cleanAt = wordFrame(scene, t(lang, "тазалайт", "очищает"), 0.5);
  const dustAt = wordFrame(scene, t(lang, "жаңылыш", "пустых"), 0.4);
  const liftAt = Math.max(cleanAt, dustAt + 18);
  const feedAt = wordFrame(scene, t(lang, "тамак", "пищу"), 0.75);
  const holidayAt = wordFrame(scene, t(lang, "майрамы", "праздник"), 0.95);
  const dustIn = prog(frame, dustAt, dustAt + 30);
  const lift = prog(frame, liftAt, liftAt + 45, Easing.in(Easing.quad));
  const leftIn = pop(frame, 4, { damping: 16, stiffness: 90 });
  const rightIn = pop(frame, 12, { damping: 16, stiffness: 90 });
  const foodP = prog(frame, feedAt, feedAt + 70);
  const specks = Array.from({ length: 16 }).map((_, i) => {
    const seed = (i * 7919) % 1000;
    const ang = (i / 16) * Math.PI * 2 + frame / 60;
    const rad = 70 + (seed % 60);
    return { x: 280 + Math.cos(ang) * rad, y: 900 + Math.sin(ang) * rad * 0.9 - lift * (240 + (seed % 200)), r: 6 + (seed % 7), o: dustIn * (1 - lift) };
  });
  return (
    <SoftBackground>
      <Caption text={scene.caption ?? ""} delay={6} size={70} />
      <Camera duration={durationInFrames} from={{ scale: 1 }} to={{ scale: 1.05 }}>
        <Canvas>
          {/* left card: night, fasting person */}
          <g transform={`translate(280 780) scale(${0.9 + 0.1 * leftIn}) translate(-280 -780)`} opacity={leftIn}>
            <defs>
              <clipPath id="whyCardClip">
                <rect x={40} y={440} width={480} height={680} rx={44} />
              </clipPath>
            </defs>
            <rect x={40} y={440} width={480} height={680} rx={44} fill="#243655" />
            <g clipPath="url(#whyCardClip)">
              <Stars frame={frame} count={14} top={470} height={260} seed={3} />
            </g>
            <Crescent x={120} y={530} r={30} glow={0.2} />
            <Person x={280} y={1060} scale={0.82} skin="#4C6088" outfit="#3A4D75" outfit2="#2F4066" hat="kalpak" hatColor="#4C6088" smile={false} bob={floatY(frame, 2, 100)} />
            {specks.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#B9BDC3" opacity={s.o * 0.9} />
            ))}
            {lift > 0.6 && (
              <g opacity={prog(frame, liftAt + 30, liftAt + 50)}>
                <circle cx={280} cy={900} r={150} fill="#F6E7B8" opacity={0.08 + 0.04 * Math.sin(frame / 10)} />
              </g>
            )}
          </g>
          {/* right card: warm, family table */}
          <g transform={`translate(800 780) scale(${0.9 + 0.1 * rightIn}) translate(-800 -780)`} opacity={rightIn}>
            <rect x={560} y={440} width={480} height={680} rx={44} fill="#F3E4C8" />
            <Heart x={940} y={520} scale={0.5} color={colors.terracotta} />
            <House x={800} y={880} scale={0.72} wall="#EFE3D0" roof={colors.terracotta} lit={foodP > 0.3} />
            <Person x={690} y={1030} scale={0.62} hat="hijab" hatColor="#B9897F" outfit="#6E8F6B" skin={colors.skin1} bob={floatY(frame, 2, 90, 10)} />
            <Person x={860} y={1030} scale={0.66} child outfit="#D9A24A" skin={colors.skin2} bob={floatY(frame, 2, 70, 30)} flip />
            <Person x={930} y={1030} scale={0.6} child outfit="#5C8FB8" skin={colors.skin1} bob={floatY(frame, 2, 80, 50)} flip />
            <Dastorkon x={800} y={1040} scale={0.95} items={foodP} steam={foodP > 0.2 ? 0.5 + 0.5 * Math.sin(frame / 12) : 0} cloth="#8A4B2A" />
          </g>
        </Canvas>
        {lift > 0.5 && <Sparkles x={280} y={960} count={12} spread={120} start={liftAt + 20} size={6} color="#F6E7B8" />}
        {foodP > 0.6 && <Sparkles x={800} y={1000} count={10} spread={160} start={feedAt + 40} size={5} />}
        {holidayAt > 0 && (
          <Canvas>
            {[0, 1, 2].map((i) => {
              const s = pop(frame, holidayAt + i * 6, { damping: 12 });
              return <Heart key={i} x={700 + i * 100} y={600 - (1 - s) * 30} scale={0.4 * s} color={i % 2 ? colors.gold : colors.terracotta} />;
            })}
          </Canvas>
        )}
      </Camera>
      {scene.note && <Note text={scene.note} delay={hadithAt} />}
    </SoftBackground>
  );
};

/* 3. Who: a provider's family (check over the father, coins over the children) and a family that receives (open palm) */
const Who: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const muftiAt = wordFrame(scene, "муфтият", 0.1);
  const nisabAt = wordFrame(scene, "нисаб", 0.4);
  const selfAt = wordFrame(scene, t(lang, "өзү", "себя"), 0.6);
  const kidsAt = wordFrame(scene, t(lang, "балдары", "детей"), 0.8);
  const needyAt = wordFrame(scene, t(lang, "муктаж", "нуждается"), 0.87, lang === "ky" ? 1 : 0);
  const notAt = wordFrame(scene, t(lang, "эмес", "является"), 0.96);
  const pan = -interpolate(frame, [needyAt - 30, needyAt + 30], [0, 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const checkS = pop(frame, nisabAt, { damping: 13 });
  const selfS = pop(frame, selfAt, { damping: 12 });
  const palmS = pop(frame, needyAt, { damping: 14, stiffness: 100 });
  return (
    <AbsoluteFill>
      <Sky mode="day" />
      <Sun x={960} y={470} r={40} />
      <Cloud x={80} y={470} scale={0.7} speed={0.2} opacity={0.75} />
      <Cloud x={520} y={420} scale={0.55} speed={0.15} opacity={0.6} />
      <Camera duration={durationInFrames} from={{ scale: 1.04 }} to={{ scale: 1.09 }}>
        <Mountains y={700} parallax={0.06} />
        <Ground y={1000} />
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${pan}px)` }}>
          <Canvas>
            {/* divider */}
            <line x1={560} y1={640} x2={560} y2={1000} stroke={colors.brandSoft} strokeWidth={5} strokeDasharray="14 18" opacity={0.6 * prog(frame, 10, 30)} />
            <Tree x={560} y={1020} scale={0.7} sway={sway(frame, 1.5, 140)} />
            {/* giver family */}
            <House x={300} y={930} scale={0.78} lit />
            <Person x={200} y={1130} scale={0.8} hat="kalpak" outfit="#3F6B8E" skin={colors.skin2} bob={floatY(frame, 2, 90)} armR={-15} />
            <Person x={310} y={1130} scale={0.78} hat="elechek" outfit="#8E4A5B" skin={colors.skin1} bob={floatY(frame, 2, 100, 20)} />
            <Person x={400} y={1130} scale={0.8} child outfit="#D9A24A" skin={colors.skin1} bob={floatY(frame, 2, 70, 40)} />
            <Person x={470} y={1130} scale={0.72} child outfit="#5C8FB8" skin={colors.skin2} bob={floatY(frame, 2, 80, 60)} />
            {/* nisab card over the father */}
            <g transform={`translate(200 ${655 + floatY(frame, 3, 80)}) scale(${checkS})`} opacity={checkS}>
              <Card x={0} y={0} w={230} h={100} radius={30}>
                <Coin x={-70} y={0} r={26} />
                <SvgText x={20} y={14} size={34} weight={900} color={colors.brandDeep}>
                  {t(lang, "нисаб", "нисаб")}
                </SvgText>
                <Check x={90} y={-10} r={22} progress={prog(frame, nisabAt + 10, nisabAt + 30)} />
              </Card>
            </g>
            {/* coin for himself */}
            <g transform={`translate(200 ${750 + floatY(frame, 3, 70, 15)}) scale(${selfS})`}>
              <Coin x={0} y={0} r={22} glow />
            </g>
            {/* coins over the children */}
            {[400, 470].map((cx, i) => {
              const s = pop(frame, kidsAt + i * 7, { damping: 12 });
              return (
                <g key={i} transform={`translate(${cx} ${852 + i * 14 + floatY(frame, 3, 70, i * 20)}) scale(${s})`}>
                  <Coin x={0} y={0} r={18} glow />
                </g>
              );
            })}
            {/* receiving family */}
            <House x={830} y={945} scale={0.66} wall="#E7E9DC" roof="#8FA5B5" />
            <Person x={760} y={1130} scale={0.78} hat="scarf" hatColor="#C98BA4" outfit="#6E8F6B" skin={colors.skin1} bob={floatY(frame, 2, 95, 30)} flip />
            <Person x={850} y={1130} scale={0.76} child outfit="#C9774B" skin={colors.skin2} bob={floatY(frame, 2, 75, 50)} flip />
            <Person x={930} y={1130} scale={0.76} hat="cap" hatColor="#5F6F82" outfit="#4A5A60" skin={colors.skin3} bob={floatY(frame, 2, 105, 70)} flip />
            {/* open palm: no obligation */}
            <g transform={`translate(845 ${665 + floatY(frame, 3, 90, 40)}) scale(${palmS})`} opacity={palmS}>
              <circle r={72} fill="#fff" stroke={colors.mint} strokeWidth={5} />
              <circle r={72} fill={colors.gold} opacity={0.12} />
              <Hands x={0} y={-6} scale={0.36} skin={colors.skin2} open={1} />
            </g>
          </Canvas>
          <Tag text={t(lang, "Милдет эмес", "Не обязана")} delay={notAt} x={845 + 0} y={560} bg={colors.terracotta} size={34} />
          <Tag text={t(lang, "Берет", "Даёт")} delay={selfAt} x={200} y={560} bg={colors.brand} size={34} />
        </div>
      </Camera>
      <Caption text={scene.caption ?? ""} delay={4} size={76} />
      {scene.note && <Note text={scene.note} delay={muftiAt} />}
    </AbsoluteFill>
  );
};

/* 4. When: Ramadan timeline; marker "before the Eid prayer"; sunrise over a mosque */
const When: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const prayerAt = wordFrame(scene, t(lang, "намазына", "молитвы"), 0.25);
  const earlierAt = wordFrame(scene, t(lang, "эртерээк", "раньше"), 0.7);
  const ramadanAt = wordFrame(scene, t(lang, "рамазан", "рамадан"), 0.8);
  const trackP = prog(frame, 8, 50);
  const sunY = interpolate(frame, [0, prayerAt + 50], [900, 720], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const markerS = pop(frame, prayerAt, { damping: 11, stiffness: 120 });
  const greenP = prog(frame, earlierAt, earlierAt + 50);
  const x0 = 110;
  const x1 = 880;
  const ty = 540;
  const days = 30;
  return (
    <AbsoluteFill>
      <Sky mode="dawn" />
      <Camera duration={durationInFrames} from={{ scale: 1 }} to={{ scale: 1.06, y: -10 }}>
        <Sun x={830} y={sunY} r={60} color="#F2B96B" />
        <Mountains y={760} far="#B8A9A5" near="#8F8A95" parallax={0.05} />
        <Ground y={1080} color="#D9C9A3" color2="#C9B88E" />
        <Canvas>
          <Mosque x={790} y={1120} scale={1.1} color="#2E4A3E" />
          <Tree x={120} y={1120} scale={0.85} leaf="#6F9C6B" sway={sway(frame, 1.5, 140)} />
          <Tree x={1000} y={1140} scale={0.7} leaf="#6F9C6B" sway={sway(frame, 1.5, 150, 50)} />
          {/* timeline track */}
          <rect x={x0 - 20} y={ty - 16} width={(x1 - x0 + 40) * trackP} height={32} rx={16} fill="#fff" opacity={0.9} />
          <rect x={x0 - 20} y={ty - 16} width={(x1 - x0 + 40) * greenP} height={32} rx={16} fill={colors.brandSoft} />
          {Array.from({ length: days }).map((_, i) => {
            const x = x0 + (i / (days - 1)) * (x1 - x0);
            const vis = trackP * days > i ? 1 : 0;
            const green = greenP * days > i;
            return <rect key={i} x={x - 2} y={ty - 8} width={4} height={16} rx={2} fill={green ? "#fff" : colors.brandSoft} opacity={vis * 0.9} />;
          })}
          <SvgText x={x0 - 20} y={ty + 58} size={32} weight={800} color={colors.brandDeep} anchor="start" opacity={trackP}>
            1 {t(lang, "Рамазан", "Рамадан")}
          </SvgText>
          <SvgText x={x1 + 20} y={ty + 58} size={32} weight={800} color={colors.brandDeep} anchor="end" opacity={trackP}>
            30
          </SvgText>
          {/* marker: Eid prayer */}
          <g transform={`translate(950 ${ty}) scale(${markerS})`}>
            <circle r={60} fill={colors.gold} opacity={0.25 + 0.1 * Math.sin(frame / 10)} />
            <g transform={`rotate(${frame * 0.6})`} opacity={0.8}>
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={i} x1={0} y1={-34} x2={0} y2={-48} stroke={colors.goldDeep} strokeWidth={5} strokeLinecap="round" transform={`rotate(${i * 45})`} />
              ))}
            </g>
            <circle r={28} fill={colors.gold} stroke="#fff" strokeWidth={5} />
            <Mosque x={0} y={16} scale={0.1} color={colors.brandDeep} />
          </g>
          {/* link from marker to the mosque sunrise */}
          <path d={`M950 ${ty + 70} Q 990 800 880 ${sunY - 60}`} fill="none" stroke={colors.goldDeep} strokeWidth={4} strokeDasharray="10 16" opacity={0.5 * markerS} />
        </Canvas>
      </Camera>
      <Caption text={scene.caption ?? ""} delay={prayerAt - 20} size={70} top={230} />
      <Tag text={t(lang, "Орозо айт", "Орозо айт")} delay={prayerAt + 6} x={870} y={450} bg={colors.goldDeep} size={34} />
      <Tag text={t(lang, "Рамазан ичинде да болот", "Можно и в течение Рамадана")} delay={ramadanAt} x={400} y={650} bg={colors.brand} size={34} />
    </AbsoluteFill>
  );
};

/* 5. Amount: four products on a scale, "som ?" tag, arrow to the Muftiyat announcement; old figures crossed out */
const Amount: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const needles = lang === "ky" ? ["буудай", "арпа", "мейиз", "курма"] : ["пшениц", "ячмен", "изюм", "финик"];
  const labels = scene.labels ?? (lang === "ky" ? ["Буудай", "Арпа", "Мейиз", "Курма"] : ["Пшеница", "Ячмень", "Изюм", "Финики"]);
  const prodAt = needles.map((n, i) => wordFrame(scene, n, 0.15 + i * 0.07));
  const muftiAt = wordFrame(scene, "муфтият", 0.5);
  const somAt = wordFrame(scene, "сом", 0.6);
  const lastYearAt = wordFrame(scene, t(lang, "былтыркы", "прошлогодние"), 0.78);
  const checkAt = wordFrame(scene, t(lang, "текшериңиз", "проверьте"), 0.92);
  const loaded = prodAt.reduce((a, f) => a + pop(frame, f, { damping: 14 }), 0);
  const somS = pop(frame, somAt, { damping: 12 });
  const tilt = loaded * 2.2 - somS * 4 + Math.sin(frame / 40) * 1.2;
  const arrowP = prog(frame, muftiAt - 6, muftiAt + 24);
  const boardS = pop(frame, muftiAt, { damping: 14, stiffness: 100 });
  const oldS = pop(frame, lastYearAt, { damping: 13 });
  const crossP = prog(frame, lastYearAt + 14, lastYearAt + 34);
  const shake = lastYearAt > 0 && frame > lastYearAt + 14 && frame < lastYearAt + 40 ? Math.sin(frame * 1.6) * 3 : 0;
  return (
    <SoftBackground glow="#F6E7C9">
      <Caption text={scene.caption ?? ""} delay={4} size={64} />
      {labels.map((lab, i) => (
        <Tag key={i} text={lab} delay={prodAt[i] - 2} x={[165, 400, 625, 860][i]} y={450} bg={i % 2 ? colors.goldDeep : colors.brand} size={34} />
      ))}
      <Camera duration={durationInFrames} from={{ scale: 1 }} to={{ scale: 1.05, y: -8 }}>
        <Canvas>
          <Scale
            x={360}
            y={930}
            scale={1}
            tilt={tilt}
            left={
              <g>
                <g transform={`scale(${pop(frame, prodAt[0], { damping: 14 })})`}>
                  <Wheat x={-55} y={0} scale={0.5} bend={-8} />
                </g>
                <g transform={`scale(${pop(frame, prodAt[1], { damping: 14 })})`}>
                  <Barley x={-20} y={0} scale={0.5} bend={6} />
                </g>
                <g transform={`translate(28 -30) scale(${pop(frame, prodAt[2], { damping: 14 })})`}>
                  <Raisins x={0} y={0} scale={0.75} />
                </g>
                <g transform={`translate(52 -6) scale(${pop(frame, prodAt[3], { damping: 14 })})`}>
                  <DatesFruit x={0} y={0} scale={0.6} />
                </g>
              </g>
            }
            right={
              <g transform={`translate(0 -52) scale(${somS})`}>
                <Card x={0} y={0} w={150} h={84} radius={24}>
                  <SvgText x={0} y={14} size={40} weight={900} color={colors.brandDeep}>
                    {t(lang, "сом ?", "сом ?")}
                  </SvgText>
                </Card>
              </g>
            }
          />
          {/* arrow from the som tag to the announcement board */}
          <path d="M660 800 Q 700 720 760 740" fill="none" stroke={colors.goldDeep} strokeWidth={6} strokeLinecap="round" strokeDasharray={200} strokeDashoffset={200 * (1 - arrowP)} />
          {arrowP > 0.9 && <path d="M740 716 L766 742 L732 752" fill="none" stroke={colors.goldDeep} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
          {/* Muftiyat announcement board */}
          <g transform={`translate(850 ${720 + floatY(frame, 3, 90)}) scale(${0.85 + 0.15 * boardS})`} opacity={boardS}>
            <Card x={0} y={0} w={330} h={200} radius={34} stroke={colors.gold}>
              <Megaphone x={-100} y={-10} scale={0.85} waves={0.6 + 0.4 * Math.sin(frame / 8)} />
              <SvgText x={40} y={-26} size={38} weight={900} color={colors.brandDeep}>
                {t(lang, "Муфтият", "Муфтият")}
              </SvgText>
              <SvgText x={40} y={20} size={32} weight={700} color={colors.inkSoft}>
                {t(lang, "жыл сайын", "каждый год")}
              </SvgText>
              <SvgText x={40} y={62} size={32} weight={700} color={colors.inkSoft}>
                {t(lang, "жарыялайт", "объявляет")}
              </SvgText>
            </Card>
          </g>
          {/* last year's figures — crossed out */}
          <g transform={`translate(${850 + shake} 1010) rotate(${-6 + shake}) scale(${oldS})`} opacity={oldS}>
            <Card x={0} y={0} w={300} h={120} radius={24} color="#F4EFE6" stroke="#D8CFC0">
              <SvgText x={0} y={-10} size={32} weight={800} color={colors.inkSoft}>
                {t(lang, "былтыркы", "прошлогодняя")}
              </SvgText>
              <SvgText x={0} y={34} size={32} weight={800} color={colors.inkSoft}>
                {t(lang, "сумма", "сумма")}
              </SvgText>
              <line x1={-120} y1={-40} x2={-120 + 240 * crossP} y2={-40 + 80 * crossP} stroke={colors.red} strokeWidth={8} strokeLinecap="round" />
              <line x1={120} y1={-40} x2={120 - 240 * crossP} y2={-40 + 80 * crossP} stroke={colors.red} strokeWidth={8} strokeLinecap="round" />
            </Card>
          </g>
        </Canvas>
        {boardS > 0.5 && <Sparkles x={850} y={700} count={8} spread={150} start={muftiAt} size={5} />}
      </Camera>
      <Note text={t(lang, "Сумманы Муфтияттын жаңы жарыялоосунан текшериңиз", "Проверьте свежее объявление Муфтията")} delay={checkAt - 10} />
    </SoftBackground>
  );
};

/* 6. To whom: festive morning, tables in modest and well-off homes all get food; people walk to the mosque */
const ToWhom: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const holidayAt = wordFrame(scene, t(lang, "майрам", "праздника"), 0.55);
  const tableAt = wordFrame(scene, t(lang, "дасторкондо", "столе"), 0.72);
  const foodAt = wordFrame(scene, t(lang, "тамак", "еда"), 0.85);
  const startFood = Math.min(tableAt, foodAt) - 10;
  const walkers = [
    { x0: 40, speed: 1.15, hat: "kalpak" as const, outfit: "#3F6B8E", skin: colors.skin2, s: 0.5, ph: 0 },
    { x0: 150, speed: 1.05, hat: "hijab" as const, outfit: "#8E4A5B", skin: colors.skin1, s: 0.48, ph: 7 },
    { x0: 230, speed: 1.1, hat: "none" as const, outfit: "#D9A24A", skin: colors.skin1, s: 0.46, ph: 3, child: true },
    { x0: 330, speed: 1.0, hat: "cap" as const, outfit: "#4A5A60", skin: colors.skin3, s: 0.5, ph: 11 },
  ];
  return (
    <AbsoluteFill>
      <Sky mode="dawn" />
      <Sun x={150} y={520} r={56} color="#F2B96B" />
      <Cloud x={420} y={470} scale={0.6} speed={0.2} opacity={0.7} />
      <Camera duration={durationInFrames} from={{ scale: 1.08, x: 30 }} to={{ scale: 1.08, x: -30 }}>
        <Mountains y={680} parallax={0.05} />
        <Ground y={960} />
        <Canvas>
          {/* street */}
          <path d="M-80 1180 Q 540 1110 1160 1170" fill="none" stroke="#D9C9A3" strokeWidth={90} strokeLinecap="round" />
          <path d="M-80 1180 Q 540 1110 1160 1170" fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="20 30" opacity={0.5} />
          <Mosque x={900} y={1000} scale={0.95} color="#F2EEE4" />
          <Tree x={1040} y={1010} scale={0.7} leaf="#6F9C6B" sway={sway(frame, 1.5, 140)} />
          <House x={170} y={900} scale={0.95} lit wall="#F3E4C8" roof={colors.terracotta} />
          <House x={470} y={915} scale={0.6} wall="#E7E9DC" roof="#8FA5B5" lit />
          <Yurt x={680} y={940} scale={0.5} />
          {[
            { x: 170, s: 0.62, i: 0, cloth: "#B8463F" },
            { x: 470, s: 0.5, i: 1, cloth: "#5C8FB8" },
            { x: 680, s: 0.5, i: 2, cloth: "#8A4B2A" },
          ].map((tb) => (
            <g key={tb.i} transform={`translate(0 ${floatY(frame, 1.5, 90, tb.i * 20)})`}>
              <Dastorkon x={tb.x} y={1010} scale={tb.s} items={prog(frame, startFood + tb.i * 14, startFood + tb.i * 14 + 50)} cloth={tb.cloth} steam={0.5 + 0.5 * Math.sin(frame / 13 + tb.i)} />
            </g>
          ))}
          {/* people walking to the mosque */}
          {walkers.map((wk, i) => {
            const x = wk.x0 + frame * wk.speed;
            const bob = Math.abs(Math.sin((frame + wk.ph) / 5)) * 4;
            const swing = Math.sin((frame + wk.ph) / 5) * 18;
            return <Person key={i} x={x} y={1205} scale={wk.s} hat={wk.hat} outfit={wk.outfit} skin={wk.skin} child={wk.child} bob={-bob} armL={swing} armR={-swing} hatColor={wk.hat === "hijab" ? "#C98BA4" : wk.hat === "cap" ? "#5F6F82" : "#F7F3EA"} />;
          })}
        </Canvas>
        {frame >= foodAt && <Sparkles x={420} y={990} count={14} spread={330} start={foodAt} size={5} />}
      </Camera>
      <Caption text={scene.caption ?? ""} delay={holidayAt - 30} size={64} top={230} />
    </AbsoluteFill>
  );
};

/* 7. Outro: the crescent over the mountains becomes the logo */
const Outro: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const morph = 44;
  const reveal = prog(frame, morph, morph + 34, Easing.inOut(Easing.cubic));
  const moonS = pop(frame, 4, { damping: 14, stiffness: 80 });
  const radius = 60 + reveal * 1500;
  return (
    <AbsoluteFill style={{ background: colors.nightDeep }}>
      <Sky mode="night" />
      <Canvas>
        <Stars frame={frame} count={50} top={30} height={900} />
      </Canvas>
      <Mountains y={1150} far="#2C4466" near="#1E3250" />
      <Canvas>
        <g opacity={1 - prog(frame, morph, morph + 16)}>
          <Crescent x={540} y={740} r={95 * moonS} glow={0.2 + 0.08 * Math.sin(frame / 12)} rotate={-35 + frame * 0.1} />
        </g>
      </Canvas>
      {/* dawn circle expanding from the moon */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
        <circle cx={540} cy={740} r={radius} fill={CREAM} opacity={reveal > 0 ? 1 : 0} />
      </svg>
      <div style={{ position: "absolute", inset: 0, opacity: reveal }}>
        <Mountains y={1300} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: prog(frame, morph + 16, morph + 30) }}>
        <LogoLockup delay={morph + 14} y={540} />
        <Sparkles x={W / 2} y={880} count={16} spread={280} start={morph + 20} size={6} />
      </div>
      <Caption text={scene.caption ?? ""} delay={morph + 24} size={70} top={240} />
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = { hook: Hook, why: Why, who: Who, when: When, amount: Amount, towhom: ToWhom, outro: Outro };
