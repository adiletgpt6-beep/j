import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import type { SceneMap, SceneProps } from "../types";
import { colors, W, H } from "../theme";
import { Caption, Note, BigLabel, Tag } from "../components/Text";
import { Camera } from "../components/Camera";
import { LogoLockup, BrandChip } from "../components/Brand";
import { pop, prog, linear, wordFrame, floatY, sway, clamp01 } from "../components/anim";
import { Sky, Sun, Cloud, Mountains, Ground, Rain, Sparkles, House, Tree, Wheat, Book, Canvas, Person, Heart, SvgText, Check } from "../illustrations";
import { Sack, Apple, Basket, Pump, Aryk, BarrelCart, Stream, Spring, Snowflake, Receipt, Calendar, ThoughtBubble, AskCard, Sickle, Potato } from "../illustrations/extra-06-07";
import { SoftBackground } from "../scenes/common";

const t = <T,>(lang: "ky" | "ru", ky: T, ru: T): T => (lang === "ky" ? ky : ru);
const ease = Easing.inOut(Easing.cubic);

const mix = (a: string, b: string, p: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * p)).join(",")})`;
};

/** Rows of wheat across the field. ripe 0..1 shifts colour green → gold. */
const WheatField: React.FC<{ frame: number; ripe: number; rows?: { y: number; scale: number; step: number; offset: number }[]; skip?: (x: number, row: number) => boolean }> = ({
  frame,
  ripe,
  rows = [
    { y: 1080, scale: 0.5, step: 60, offset: 20 },
    { y: 1160, scale: 0.66, step: 72, offset: 50 },
    { y: 1240, scale: 0.82, step: 84, offset: 10 },
  ],
  skip,
}) => {
  const color = mix("#8FB36A", "#E0A93A", ripe);
  return (
    <g>
      {rows.map((r, ri) => {
        const n = Math.ceil((W + 100) / r.step);
        return Array.from({ length: n }).map((_, i) => {
          const x = r.offset + i * r.step - 40;
          if (skip && skip(x, ri)) return null;
          return <Wheat key={`${ri}-${i}`} x={x} y={r.y} scale={r.scale} color={color} bend={sway(frame, 4, 110, i * 13 + ri * 40)} />;
        });
      })}
    </g>
  );
};

/* 1. Hook: field, rain, sun, harvest */
const Hook: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const labels = scene.labels ?? t(lang, ["Талаа", "Жамгыр", "Күн", "Түшүм"], ["Поле", "Дождь", "Солнце", "Урожай"]);
  const at = labels.map((l, i) => wordFrame(scene, l, 0.05 + i * 0.1));
  const ushrAt = wordFrame(scene, t(lang, "үшүр", "ушр"), 0.85);
  const rainP = prog(frame, at[1], at[1] + 20) * (1 - prog(frame, at[2], at[2] + 25));
  const sunP = prog(frame, at[2], at[2] + 40, ease);
  const ripe = prog(frame, at[2] + 10, at[2] + 60);
  const farmer = pop(frame, at[3], { damping: 14, stiffness: 90 });
  const sackS = [pop(frame, at[3] + 14, { damping: 13 }), pop(frame, at[3] + 24, { damping: 13 })];
  const swing = Math.sin(Math.max(0, frame - at[3]) / 6) * 14;
  return (
    <AbsoluteFill>
      <Camera duration={durationInFrames} from={{ scale: 1.03 }} to={{ scale: 1.1, y: -20 }}>
        <Sky mode="day" />
        {/* dim during rain */}
        <div style={{ position: "absolute", inset: 0, background: "#6E7F8E", opacity: rainP * 0.18 }} />
        <Sun x={860} y={720 - sunP * 220} r={62} />
        <Cloud x={80} y={520} scale={1} speed={0.25} opacity={0.9} />
        <Cloud x={520} y={450} scale={0.8} speed={0.18} opacity={0.75} />
        <Mountains y={620} parallax={0.1} />
        <Ground y={960} color="#B9C98B" color2="#9BB36E" />
        <Canvas>
          <WheatField frame={frame} ripe={ripe} skip={(x, row) => farmer > 0.3 && row === 2 && x > 150 && x < 330} />
          {/* farmer with sickle */}
          <g transform={`translate(300 1240) scale(${farmer})`}>
            <Person x={0} y={0} scale={0.95} hat="kalpak" outfit="#4F6F8F" skin={colors.skin2} armR={-50 + swing} armL={8} bob={floatY(frame, 2, 80)} />
            <g transform={`translate(${(52 + 136 * Math.sin(((50 - swing) * Math.PI) / 180)) * 0.95} ${(-250 + 136 * Math.cos(((50 - swing) * Math.PI) / 180)) * 0.95})`}>
              <Sickle x={0} y={0} scale={0.9} rotate={-40 + swing} />
            </g>
          </g>
          <Sack x={150} y={1240} scale={0.6 * sackS[0]} />
          <Sack x={80} y={1250} scale={0.5 * sackS[1]} />
        </Canvas>
        {rainP > 0 && <Rain intensity={50} opacity={rainP * 0.8} area={{ x: 0, y: 380, w: W, h: 760 }} />}
      </Camera>
      {labels.map((l, i) => (
        <Tag key={i} text={l} delay={at[i] - 2} x={150 + i * 258} y={470} bg={[colors.brandSoft, "#5E97BF", colors.gold, colors.terracotta][i]} size={36} />
      ))}
      <Caption text={scene.caption ?? ""} delay={ushrAt - 10} size={84} top={240} />
      <BrandChip delay={4} />
    </AbsoluteFill>
  );
};

/* 2. Meaning: ten sacks, one is 1/10, the Book */
const Meaning: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const tenthAt = wordFrame(scene, t(lang, "ондон", "десятая"), 0.1);
  const harvestAt = wordFrame(scene, t(lang, "түшүмүнөн", "урожая"), 0.35);
  const quranAt = wordFrame(scene, t(lang, "куранда", "коране"), 0.5);
  const n = 10;
  const hi = 4;
  const lift = pop(frame, tenthAt + 14, { damping: 12 });
  const bookS = pop(frame, quranAt, { damping: 14, stiffness: 90 });
  const orn = prog(frame, quranAt + 10, quranAt + 50);
  return (
    <SoftBackground tint="#F6EBD6" glow="#FBF3E4">
      <Caption text={scene.caption ?? ""} delay={4} size={64} />
      <Camera duration={durationInFrames} from={{ scale: 1 }} to={{ scale: 1.05, y: -8 }}>
        <Canvas>
          {/* shelf */}
          <rect x={60} y={884} width={W - 120} height={22} rx={11} fill="#D9BF93" opacity={prog(frame, 0, 10)} />
          {Array.from({ length: n }).map((_, i) => {
            const s = pop(frame, tenthAt - 24 + i * 4, { damping: 13 });
            const x = 112 + i * 95;
            const isHi = i === hi;
            const dy = isHi ? -lift * 60 : 0;
            return (
              <g key={i} transform={`translate(${x} ${884 + dy + floatY(frame, 2, 100, i * 17)}) scale(${s})`}>
                <ellipse cx={0} cy={4} rx={44} ry={8} fill="rgba(0,0,0,0.08)" />
                <Sack x={0} y={0} scale={0.62 * (isHi ? 1 + lift * 0.15 : 1)} highlight={isHi && lift > 0.3} />
              </g>
            );
          })}
          {/* connector from the lifted sack to the label */}
          <line x1={492} y1={700} x2={492} y2={760} stroke={colors.gold} strokeWidth={6} strokeDasharray="10 12" strokeLinecap="round" opacity={lift} />
          {/* harvest tags */}
          {harvestAt > 0 && (
            <g opacity={pop(frame, harvestAt, { damping: 14 })}>
              <Wheat x={150} y={760} scale={0.45} bend={sway(frame, 4, 100)} />
              <Apple x={880} y={690} r={26} />
              <Potato x={950} y={720} scale={1.1} />
            </g>
          )}
          {/* the Book with ornament, no text */}
          <g transform={`translate(540 ${1040 + (1 - bookS) * 30}) scale(${0.75 + 0.25 * bookS})`} opacity={bookS}>
            <Book x={0} y={0} scale={0.9} color={colors.brand} />
            <g transform="translate(0 -4)" opacity={orn}>
              {[0, 45].map((a) => (
                <rect key={a} x={-26} y={-26} width={52} height={52} rx={6} fill="none" stroke={colors.gold} strokeWidth={5} transform={`rotate(${a})`} />
              ))}
              <circle r={10} fill={colors.gold} />
            </g>
            {[[-120, -70], [120, -70], [-120, 70], [120, 70]].map(([cx, cy], i) => (
              <path key={i} d={`M${cx} ${cy} q ${cx > 0 ? -1 : 1 * 1 * 24} 0 ${cx > 0 ? -24 : 24} ${cy > 0 ? -24 : 24}`} stroke={colors.gold} strokeWidth={5} fill="none" strokeLinecap="round" opacity={orn} />
            ))}
          </g>
        </Canvas>
        {lift > 0.5 && <Sparkles x={492} y={800} count={10} spread={60} start={tenthAt + 20} size={6} />}
      </Camera>
      <BigLabel text="1/10" delay={tenthAt} size={116} y={640} color={colors.brandDeep} />
      {scene.note && <Note text={scene.note} delay={quranAt + 6} size={32} />}
    </SoftBackground>
  );
};

/* 3. Ten percent: rain, snow, river, spring */
const Ten: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const rainAt = wordFrame(scene, t(lang, "жамгыр", "дождём"), 0.12);
  const snowAt = wordFrame(scene, t(lang, "кар", "снегом"), 0.2);
  const riverAt = wordFrame(scene, t(lang, "дарыя", "рекой"), 0.3);
  const springAt = wordFrame(scene, t(lang, "булак", "родником"), 0.4);
  const tenAt = wordFrame(scene, t(lang, "пайызы", "десять"), 0.8) - (lang === "ky" ? 8 : 0);
  const rainP = prog(frame, rainAt, rainAt + 20);
  const snowP = prog(frame, snowAt, snowAt + 20);
  const river = prog(frame, riverAt, riverAt + 40, ease);
  const springS = pop(frame, springAt, { damping: 14 });
  const riverD = "M 790 640 Q 720 760 790 850 Q 850 940 740 1010 Q 660 1050 700 1070";
  return (
    <AbsoluteFill>
      <Camera duration={durationInFrames} from={{ scale: 1.04, x: 10 }} to={{ scale: 1.1, x: -10 }}>
        <Sky mode="day" />
        <Cloud x={60} y={470} scale={1.1} speed={0.2} opacity={0.95} />
        <Cloud x={420} y={420} scale={0.8} speed={0.28} opacity={0.8} />
        <Mountains y={540} parallax={0.08} />
        <Ground y={940} color="#A7BD7A" color2="#8FAA66" />
        <Canvas>
          {/* snow on peaks */}
          {snowP > 0 &&
            Array.from({ length: 14 }).map((_, i) => {
              const seed = (i * 97) % 100;
              const x = 420 + ((i * 173) % 560);
              const y = 480 + ((frame * (1 + (seed % 3) * 0.4) + seed * 7) % 180);
              return <Snowflake key={i} x={x + Math.sin(frame / 20 + i) * 6} y={y} r={10} opacity={snowP * 0.9} />;
            })}
          {/* river from the mountains */}
          <g opacity={river}>
            <Stream d={riverD} width={44} frame={frame} />
          </g>
          <g transform={`translate(700 1075) scale(${springS})`}>
            <Spring x={0} y={0} scale={0.9} frame={frame} />
          </g>
          <Tree x={960} y={1000} scale={0.75} sway={sway(frame, 1.4, 140)} />
          <WheatField frame={frame} ripe={1} rows={[{ y: 1170, scale: 0.55, step: 64, offset: 30 }, { y: 1245, scale: 0.72, step: 78, offset: 0 }]} />
        </Canvas>
        {rainP > 0 && <Rain intensity={40} opacity={rainP * 0.85} area={{ x: 0, y: 420, w: 620, h: 720 }} />}
      </Camera>
      <Caption text={scene.caption ?? ""} delay={4} size={64} />
      <BigLabel text="10 %" delay={tenAt} size={170} x={330} y={820} color={colors.brandDeep} bg="rgba(255,255,255,0.86)" />
      <Tag text={t(lang, "Жамгыр · кар · дарыя · булак", "Дождь · снег · река · родник")} delay={springAt} x={W / 2} y={1150} bg={"#5E97BF"} size={32} />
    </AbsoluteFill>
  );
};

/* 4. Five percent: pump, aryk, water receipt, water cart */
const Five: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const pumpAt = wordFrame(scene, "насос", 0.2);
  const payAt = wordFrame(scene, t(lang, "акы", "платят"), 0.4);
  const carryAt = wordFrame(scene, t(lang, "ташылып", "привозной"), 0.3);
  const fiveAt = wordFrame(scene, t(lang, "беш", "пяти"), 0.65);
  const hadithAt = wordFrame(scene, t(lang, "бухарий", "бухари"), 0.9);
  const on = prog(frame, pumpAt, pumpAt + 20);
  const flow = prog(frame, pumpAt + 10, pumpAt + 70, Easing.out(Easing.quad));
  const cartX = interpolate(frame, [carryAt, carryAt + 50], [1250, 870], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const receiptS = pop(frame, payAt, { damping: 13 });
  return (
    <AbsoluteFill>
      <Camera duration={durationInFrames} from={{ scale: 1.02 }} to={{ scale: 1.08, y: -12 }}>
        <Sky mode="dusk" />
        <Sun x={190} y={620} r={46} color="#F2B96B" rays={false} />
        <Mountains y={620} far="#C9ADB8" near="#A58A98" />
        <Ground y={960} color="#D2BE93" color2="#BFA97C" />
        <Canvas>
          <WheatField frame={frame} ripe={1} rows={[{ y: 1040, scale: 0.5, step: 60, offset: 500 }]} skip={(x) => x < 470} />
          <Person x={150} y={1080} scale={0.86} hat="kalpak" outfit="#4F6F8F" skin={colors.skin2} armR={-62 + on * 10} armL={8} bob={floatY(frame, 2, 90)} />
          <Pump x={300} y={1080} scale={1} on={on} frame={frame} />
          <Aryk x1={400} x2={1010} y={1095} flow={flow} frame={frame} />
          <BarrelCart x={cartX} y={1080} scale={0.62} wheel={(cartX - 870) * 1.5} />
          <g transform={`translate(800 ${760 + floatY(frame, 4, 90)}) scale(${receiptS})`}>
            <Receipt x={0} y={0} scale={0.85} rotate={8} />
          </g>
        </Canvas>
      </Camera>
      <Caption text={scene.caption ?? ""} delay={4} size={56} />
      <BigLabel text="5 %" delay={fiveAt} size={170} x={420} y={800} color={colors.brandDeep} bg="rgba(255,255,255,0.86)" />
      {scene.note && <Note text={scene.note} delay={hadithAt - 6} size={32} />}
    </AbsoluteFill>
  );
};

/* 5. Nuances: at harvest time (no year ring), differing opinions, ask the Muftiyat */
const Nuances: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const harvestAt = wordFrame(scene, t(lang, "жыйналганда", "сборе"), 0.05);
  const yearAt = wordFrame(scene, t(lang, "жыл", "год"), 0.2);
  const cropsAt = wordFrame(scene, t(lang, "өсүмдүктөр", "культуры"), 0.4);
  const minAt = wordFrame(scene, t(lang, "төмөнкү", "минимальный"), 0.5);
  const scholarsAt = wordFrame(scene, t(lang, "аалымдардын", "учёных"), 0.6);
  const muftiAt = wordFrame(scene, "муфтият", 0.8);
  const calS = pop(frame, harvestAt, { damping: 14, stiffness: 90 });
  const ringS = pop(frame, yearAt, { damping: 14 });
  const cross = prog(frame, yearAt + 16, yearAt + 36);
  const b1 = pop(frame, cropsAt, { damping: 14 });
  const b2 = pop(frame, minAt, { damping: 14 });
  const q = pop(frame, scholarsAt, { damping: 12 });
  const askS = pop(frame, muftiAt, { damping: 14, stiffness: 90 });
  return (
    <SoftBackground glow="#E3F0E6">
      <Caption text={scene.caption ?? ""} delay={4} size={64} />
      <Camera duration={durationInFrames} from={{ scale: 1 }} to={{ scale: 1.04, y: -8 }}>
        <Canvas>
          {/* calendar: pay at harvest */}
          <g transform={`translate(300 ${700 + floatY(frame, 3, 110)}) scale(${0.8 + 0.2 * calS})`} opacity={calS}>
            <Calendar x={0} y={0} scale={0.85} color={colors.brand}>
              <Wheat x={-40} y={110} scale={0.42} bend={sway(frame, 4, 100)} />
              <Check x={60} y={70} r={26} />
            </Calendar>
          </g>
          {/* year ring crossed out */}
          <g transform={`translate(740 ${700 + floatY(frame, 3, 110, 40)}) scale(${0.8 + 0.2 * ringS})`} opacity={ringS}>
            <circle r={100} fill="#fff" stroke={colors.mint} strokeWidth={5} />
            <path d="M0 -78 A78 78 0 1 1 -60 50" fill="none" stroke={colors.inkSoft} strokeWidth={8} strokeLinecap="round" strokeDasharray="12 14" />
            <path d="M-70 36 L-58 56 L-40 38" fill="none" stroke={colors.inkSoft} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
            <SvgText x={0} y={16} size={44} weight={900} color={colors.inkSoft}>
              {t(lang, "1 жыл", "1 год")}
            </SvgText>
            <line x1={-78} y1={-78} x2={-78 + 156 * cross} y2={-78 + 156 * cross} stroke={colors.red} strokeWidth={12} strokeLinecap="round" />
            <circle r={100} fill="none" stroke={colors.red} strokeWidth={10} opacity={cross} />
          </g>
          <SvgText x={740} y={840} size={34} weight={800} color={colors.inkSoft} opacity={ringS}>
            {t(lang, "Күтүүнүн кереги жок", "Ждать год не нужно")}
          </SvgText>
          {/* thought bubbles */}
          <g transform={`translate(230 ${1010 + floatY(frame, 4, 100)}) scale(${0.75 * b1})`} opacity={b1}>
            <ThoughtBubble x={0} y={0} scale={1} tail="left">
              <Wheat x={-70} y={60} scale={0.42} bend={sway(frame, 3, 90)} />
              <Apple x={10} y={-10} r={28} />
              <Potato x={90} y={10} scale={1.3} />
              <g transform="translate(70 -70)" opacity={q}>
                <circle r={30} fill={colors.gold} />
                <SvgText x={0} y={13} size={40} weight={900} color="#fff">
                  ?
                </SvgText>
              </g>
            </ThoughtBubble>
          </g>
          <g transform={`translate(565 ${1010 + floatY(frame, 4, 100, 50)}) scale(${0.75 * b2})`} opacity={b2}>
            <ThoughtBubble x={0} y={0} scale={1} tail="right">
              <Sack x={-70} y={60} scale={0.5} />
              <Sack x={-10} y={60} scale={0.65} />
              <Sack x={70} y={60} scale={0.8} />
              <SvgText x={-10} y={-46} size={50} weight={900} color={colors.brandDeep}>
                min
              </SvgText>
              <g transform="translate(80 -60)" opacity={q}>
                <circle r={30} fill={colors.gold} />
                <SvgText x={0} y={13} size={40} weight={900} color="#fff">
                  ?
                </SvgText>
              </g>
            </ThoughtBubble>
          </g>
          {/* ask the Muftiyat */}
          <g transform={`translate(900 ${1000 + floatY(frame, 3, 120, 80)}) scale(${0.8 * (0.85 + 0.15 * askS)})`} opacity={askS}>
            <AskCard x={0} y={0} scale={1} label={t(lang, "Муфтият", "Муфтият")} />
          </g>
        </Canvas>
        {askS > 0.5 && <Sparkles x={900} y={900} count={8} spread={80} start={muftiAt} size={5} />}
      </Camera>
      <Note text={t(lang, "Пикирлер айырмаланат — тактап алыңыз", "Мнения различаются — уточняйте")} delay={scholarsAt + 6} size={32} />
    </SoftBackground>
  );
};

/* 6. Kyrgyzstan: sharing the harvest with neighbours, Ala-Too behind */
const Kyrgyzstan: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const landAt = wordFrame(scene, t(lang, "жер", "землёй"), 0.25);
  const giveAt = wordFrame(scene, t(lang, "бөлүшүүнүн", "разделить"), 0.6);
  const neighboursAt = wordFrame(scene, t(lang, "кошуналар", "соседями"), 0.75);
  const walk = prog(frame, landAt - 20, landAt + 40, ease);
  const fx = 240 + walk * 140; // farmer x
  const give = prog(frame, giveAt, giveAt + 40, ease);
  const sackX = fx + 70 + give * (640 - fx - 120);
  const sackY = 1080 - Math.sin(give * Math.PI) * 120 + give * 110;
  const basketX = fx - 80 + give * (720 - fx + 60);
  const basketY = 1200 - Math.sin(give * Math.PI) * 160;
  const thanks = pop(frame, giveAt + 40, { damping: 12 });
  return (
    <AbsoluteFill>
      <Camera duration={durationInFrames} from={{ scale: 1 }} to={{ scale: 1.08, y: -16 }}>
        <Sky mode="day" />
        <Sun x={900} y={480} r={52} />
        <Cloud x={200} y={440} scale={0.9} speed={0.2} opacity={0.9} />
        <Mountains y={560} parallax={0.08} />
        <Ground y={960} color="#A7BD7A" color2="#8FAA66" />
        <Canvas>
          {/* village and orchard */}
          <House x={170} y={1030} scale={0.7} wall="#EFE3D0" roof="#8FA5B5" lit />
          <House x={930} y={1040} scale={0.68} />
          <Tree x={60} y={1080} scale={0.7} sway={sway(frame, 1.5, 140)} />
          <Tree x={1010} y={1120} scale={0.75} sway={sway(frame, 1.5, 160, 40)} />
          <Tree x={860} y={1060} scale={0.55} sway={sway(frame, 1.5, 150, 80)} />
          {/* apples in the orchard trees */}
          {[[20, 950], [95, 990], [1030, 980], [985, 1010], [845, 980]].map(([ax, ay], i) => (
            <Apple key={i} x={ax} y={ay + sway(frame, 2, 100, i * 20)} r={12} />
          ))}
          {/* garden fence */}
          {Array.from({ length: 9 }).map((_, i) => (
            <rect key={i} x={40 + i * 44} y={1120} width={14} height={56} rx={5} fill="#C9B88E" />
          ))}
          <rect x={30} y={1140} width={400} height={10} rx={5} fill="#C9B88E" />
          {/* farmer */}
          <Person x={fx} y={1200} scale={0.9} hat="kalpak" outfit={colors.brand} skin={colors.skin2} armR={give > 0 ? -70 : -50} armL={give > 0 ? 50 : 20} bob={walk < 1 ? Math.abs(Math.sin(frame / 5)) * 6 : floatY(frame, 2, 90)} />
          {/* neighbour family */}
          <Person x={660} y={1200} scale={0.84} hat="elechek" outfit="#8E5D6E" skin={colors.skin1} armR={-60} bob={floatY(frame, 2, 90, 30)} />
          <Person x={740} y={1200} scale={0.84} child outfit="#D9A24A" skin={colors.skin2} bob={floatY(frame, 2, 70, 10)} />
          <Person x={800} y={1200} scale={0.86} hat="cap" hatColor="#4F6F8F" outfit="#4F6F8F" skin={colors.skin3} armR={-50 * give} bob={floatY(frame, 2, 90, 60)} />
          {/* gifts */}
          <Sack x={sackX} y={sackY + 60} scale={0.6} />
          <Basket x={basketX} y={basketY} scale={0.65} />
          {/* hearts */}
          {thanks > 0 &&
            [0, 1, 2].map((i) => (
              <Heart key={i} x={560 + i * 60} y={820 - i * 30 - (1 - thanks) * 30 + floatY(frame, 4, 80, i * 20)} scale={0.45 * thanks} color={i % 2 ? colors.gold : colors.terracotta} />
            ))}
        </Canvas>
        {give >= 1 && <Sparkles x={680} y={1000} count={10} spread={100} start={giveAt + 40} size={6} />}
      </Camera>
      <Caption text={scene.caption ?? ""} delay={6} size={68} />
      <Tag text={t(lang, "Кошуналар менен", "С соседями")} delay={neighboursAt} x={300} y={640} bg={colors.terracotta} size={34} />
    </AbsoluteFill>
  );
};

/* 7. Outro: a wheat ear grows, then the logo */
const Outro: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const logoAt = wordFrame(scene, "зекет", 0.6);
  const grow = prog(frame, 4, 50, Easing.out(Easing.cubic));
  const fade = 1 - prog(frame, logoAt - 6, logoAt + 10);
  const shift = prog(frame, logoAt - 6, logoAt + 14, ease);
  return (
    <SoftBackground glow="#F3E2BD">
      <Caption text={scene.caption ?? ""} delay={6} size={72} top={280} />
      <Canvas>
        <g opacity={fade} transform={`translate(540 ${1010 + shift * 120}) scale(${(2.1 - shift * 0.8) * grow}) translate(-540 -1010)`}>
          <Wheat x={540} y={1010} scale={1} bend={sway(frame, 2, 120)} />
        </g>
      </Canvas>
      {frame >= logoAt - 6 && <LogoLockup delay={logoAt - 6} y={600} scale={0.9} />}
      <Sparkles x={W / 2} y={1000} count={16} spread={300} start={10} size={6} />
    </SoftBackground>
  );
};

export const scenes: SceneMap = { hook: Hook, meaning: Meaning, ten: Ten, five: Five, nuances: Nuances, kyrgyzstan: Kyrgyzstan, outro: Outro };
