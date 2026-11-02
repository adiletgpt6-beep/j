import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import type { SceneMap, SceneProps } from "../types";
import { colors, fonts, W, H } from "../theme";
import { Caption, Note, Tag } from "../components/Text";
import { Camera } from "../components/Camera";
import { LogoLockup, BrandChip } from "../components/Brand";
import { pop, prog, linear, wordFrame, floatY, sway } from "../components/anim";
import { Sky, Sun, Cloud, Mountains, Ground, Sparkles, House, Tree, Canvas, Person, Banknote, Hands, Heart, Check, SvgText } from "../illustrations";
import { DonationBox, QuestionMark, Bubble, Fog, Parcel, Stars, DocIcon, ChartIcon, MagnifierCheck, Folder, KyrgyzMap, BrowserFrame, Donut, PhotoIcon, RoadPath } from "../illustrations/extra-08-09";
import { SoftBackground, Badge } from "../scenes/common";

const t = (lang: "ky" | "ru", ky: string, ru: string) => (lang === "ky" ? ky : ru);

/* 1. Hook: giver with a banknote over a donation box; a question; the path in the thought bubble is lost in fog that slowly clears */
const Hook: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const questionAt = wordFrame(scene, t(lang, "суроо", "вопрос"), 0.35);
  const reachAt = wordFrame(scene, t(lang, "жетеби", "дойдёт"), 0.45);
  const rightAt = wordFrame(scene, t(lang, "туура", "правильный"), 0.6);
  const trustAt = wordFrame(scene, t(lang, "ишенимге", "доверие"), 0.75);
  const fog = interpolate(frame, [0, rightAt, trustAt + 40], [0.85, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const qS = pop(frame, questionAt, { damping: 11 });
  const bubbleS = pop(frame, reachAt - 6, { damping: 14, stiffness: 100 });
  const pathP = prog(frame, reachAt, reachAt + 40);
  const armP = prog(frame, 6, 30);
  return (
    <SoftBackground tint="#EEF1F2" glow="#DDE5E8">
      <Camera duration={durationInFrames} from={{ scale: 1.02 }} to={{ scale: 1.08, y: -10 }}>
        <Canvas>
          {/* floor */}
          <ellipse cx={540} cy={1160} rx={520} ry={60} fill="#DCE3E6" opacity={0.7} />
          <DonationBox x={660} y={1150} scale={1} />
          <Person x={360} y={1150} scale={0.95} hat="cap" hatColor="#5F6F82" outfit="#3F6B8E" skin={colors.skin2} armR={-40 - 70 * armP} armL={8} bob={floatY(frame, 2, 100)} />
          <g transform={`translate(${535 + (1 - armP) * -40} ${880 + floatY(frame, 2, 100) + (1 - armP) * 60}) rotate(${-24 + Math.sin(frame / 30) * 3})`}>
            <Banknote x={0} y={0} scale={0.72} />
          </g>
          {/* question mark */}
          <g transform={`translate(360 ${660 - (1 - qS) * 20}) scale(${qS})`} opacity={qS}>
            <circle r={62} fill="#fff" stroke={colors.mint} strokeWidth={5} />
            <QuestionMark x={0} y={36} size={100} color={colors.terracotta} />
          </g>
          {/* thought bubble with a path fading into fog */}
          <g transform={`translate(800 640) scale(${bubbleS}) translate(-800 -640)`} opacity={bubbleS}>
            <Bubble x={800} y={640} w={380} h={290} side="left">
              <rect x={-170} y={-125} width={340} height={250} rx={20} fill="#F4F6F7" />
              <path d="M-150 100 Q -40 90 20 20 T 150 -80" fill="none" stroke="#C9B88E" strokeWidth={26} strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420 * (1 - pathP)} />
              <path d="M-150 100 Q -40 90 20 20 T 150 -80" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeDasharray="12 18" opacity={0.7 * pathP} />
              <g transform="translate(110 -70) scale(0.45)" opacity={pathP}>
                <House x={0} y={0} scale={1} wall="#EFE3D0" roof={colors.terracotta} />
              </g>
              <g transform="translate(-130 90) scale(0.28)" opacity={pathP}>
                <Person x={0} y={0} scale={1} outfit="#3F6B8E" hat="cap" hatColor="#5F6F82" />
              </g>
              {/* in-bubble fog */}
              <rect x={-20} y={-125} width={190} height={250} rx={20} fill="url(#bubblefog)" opacity={0.4 + 0.6 * fog} />
              <QuestionMark x={90} y={10} size={64} color={colors.inkSoft} opacity={0.7 * fog} />
            </Bubble>
          </g>
          <defs>
            <linearGradient id="bubblefog" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#E8ECEE" stopOpacity={0} />
              <stop offset="0.4" stopColor="#E8ECEE" stopOpacity={0.95} />
              <stop offset="1" stopColor="#E8ECEE" stopOpacity={1} />
            </linearGradient>
          </defs>
        </Canvas>
        <Fog density={fog} frame={frame} top={420} bottom={1240} />
        {fog < 0.3 && <Sparkles x={660} y={1040} count={8} spread={110} start={trustAt + 20} size={5} />}
      </Camera>
      <Caption text={scene.caption ?? ""} delay={questionAt - 10} size={80} top={240} />
      <BrandChip delay={4} />
    </SoftBackground>
  );
};

/* 2. Amana: three pairs of hands pass a glowing bundle (giver → fund → recipient) under a thin line of responsibility */
const Amana: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const amanatAt = wordFrame(scene, "аманат", 0.1);
  const collectAt = wordFrame(scene, t(lang, "чогултуп", "собирает"), 0.4);
  const receiverAt = wordFrame(scene, t(lang, "алуучунун", "получателем"), 0.72);
  const responsibleAt = wordFrame(scene, t(lang, "жооптуу", "отвечает"), 0.9);
  const hx = [190, 540, 890];
  const hy = 940;
  const m1 = prog(frame, collectAt, collectAt + 36, Easing.inOut(Easing.cubic));
  const m2 = prog(frame, receiverAt, receiverAt + 36, Easing.inOut(Easing.cubic));
  const px = m1 < 1 ? hx[0] + (hx[1] - hx[0]) * m1 : hx[1] + (hx[2] - hx[1]) * m2;
  const arc = m1 < 1 ? Math.sin(m1 * Math.PI) : Math.sin(m2 * Math.PI);
  const py = hy - 60 - arc * 150;
  const lineP = prog(frame, amanatAt, Math.max(amanatAt + 30, responsibleAt + 20));
  const labels = [t(lang, "Берүүчү", "Дающий"), t(lang, "Фонд", "Фонд"), t(lang, "Алуучу", "Получатель")];
  const glow = 0.7 + 0.3 * Math.sin(frame / 9);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.brandDeep} 0%, #06301C 100%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${px / W * 100}% 48%, rgba(224,169,58,0.22) 0%, rgba(224,169,58,0) 45%)` }} />
      <Canvas>
        <Stars frame={frame} count={30} top={430} height={700} color="#F6E7B8" />
      </Canvas>
      <Camera duration={durationInFrames} from={{ scale: 1 }} to={{ scale: 1.06 }}>
        <Canvas>
          {/* line of responsibility */}
          <line x1={hx[0]} y1={700} x2={hx[0] + (hx[2] - hx[0]) * lineP} y2={700} stroke={colors.gold} strokeWidth={3} strokeLinecap="round" opacity={0.9} />
          {hx.map((x, i) => {
            const vis = lineP * 1.1 >= i / 2 ? 1 : 0;
            return (
              <g key={i} opacity={vis}>
                <circle cx={x} cy={700} r={10} fill={colors.gold} />
                <line x1={x} y1={712} x2={x} y2={hy - 120} stroke={colors.gold} strokeWidth={2} strokeDasharray="4 12" opacity={0.5} />
              </g>
            );
          })}
          {hx.map((x, i) => {
            const holding = (i === 0 && m1 < 0.5) || (i === 1 && m1 >= 0.5 && m2 < 0.5) || (i === 2 && m2 >= 0.5);
            const s = pop(frame, 6 + i * 8, { damping: 15, stiffness: 90 });
            return (
              <g key={i} transform={`translate(${x} ${hy + floatY(frame, 4, 110, i * 35)}) scale(${s})`}>
                <circle r={120} fill="#fff" opacity={holding ? 0.08 : 0.04} />
                <Hands x={0} y={0} scale={0.78} skin={[colors.skin1, colors.skin2, colors.skin3][i]} open={holding ? 1 : 0.5} />
              </g>
            );
          })}
          <Parcel x={px} y={py} scale={0.9 + arc * 0.15} glow={glow} />
        </Canvas>
        {labels.map((lab, i) => (
          <Tag key={i} text={lab} delay={14 + i * 8} x={hx[i]} y={1110} bg={i === 1 ? colors.gold : "rgba(255,255,255,0.14)"} color={i === 1 ? colors.brandDeep : "#F6E7B8"} size={34} />
        ))}
        <div style={{ position: "absolute", top: 610, left: 0, width: W, textAlign: "center", opacity: prog(frame, responsibleAt, responsibleAt + 14), fontFamily: fonts.display, fontWeight: 800, fontSize: 36, color: colors.gold, letterSpacing: 1 }}>
          {t(lang, "Жоопкерчилик", "Ответственность")}
        </div>
        <Sparkles x={px} y={py + 40} count={8} spread={60} size={5} color="#F6E7B8" />
      </Camera>
      <Caption text={scene.caption ?? ""} delay={4} size={80} top={240} color="#F6E7B8" />
    </AbsoluteFill>
  );
};

/* 3. Principles: three card-columns rise in turn — information / reports / verification */
const Principles: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const threeAt = wordFrame(scene, t(lang, "үч", "три"), 0.17);
  const at = [wordFrame(scene, t(lang, "маалымат", "информация"), 0.3), wordFrame(scene, t(lang, "отчеттуулук", "отчётность"), 0.55), wordFrame(scene, t(lang, "текшерүү", "проверка"), 0.75)];
  const labels = scene.labels ?? [t(lang, "Түшүнүктүү маалымат", "Понятная информация"), t(lang, "Отчеттуулук", "Отчётность"), t(lang, "Текшерүү", "Проверка")];
  const xs = [200, 540, 880];
  const baseP = prog(frame, threeAt - 4, threeAt + 16);
  return (
    <SoftBackground glow="#E3F0E6">
      <Caption text={scene.caption ?? ""} delay={threeAt - 10} size={76} />
      <Camera duration={durationInFrames} from={{ scale: 1.02, y: 10 }} to={{ scale: 1.06, y: -6 }}>
        <Canvas>
          {/* opening question: what makes an organisation trustworthy? */}
          <g transform={`translate(540 ${840 + floatY(frame, 6, 80)}) scale(${pop(frame, 4, { damping: 12 }) * (1 - prog(frame, threeAt - 8, threeAt + 6))})`}>
            <circle r={150} fill={colors.mintLight} stroke={colors.mint} strokeWidth={6} />
            <circle r={150} fill={colors.brandSoft} opacity={0.08 + 0.05 * Math.sin(frame / 10)} />
            <DocIcon x={-40} y={10} scale={0.9} />
            <QuestionMark x={70} y={50} size={150} color={colors.terracotta} />
          </g>
          <rect x={70} y={1120} width={(W - 140) * baseP} height={26} rx={13} fill={colors.brandDeep} />
          <rect x={110} y={1146} width={(W - 220) * baseP} height={18} rx={9} fill={colors.brandSoft} opacity={0.7} />
        </Canvas>
        {xs.map((x, i) => {
          const s = pop(frame, at[i], { damping: 15, stiffness: 95 });
          const inner = prog(frame, at[i] + 12, at[i] + 40);
          const icon = i === 0 ? <DocIcon x={0} y={0} scale={1.05 * (0.85 + 0.15 * inner)} /> : i === 1 ? <ChartIcon x={0} y={-10} scale={1.05} progress={inner} /> : <MagnifierCheck x={-10} y={-10} scale={1} check={inner} />;
          const bg = i === 1 ? colors.gold : colors.brand;
          return (
            <div key={i} style={{ position: "absolute", left: x - 150, top: 560, width: 300, height: 560, transform: `translateY(${(1 - s) * 420}px) scale(${0.9 + 0.1 * s})`, opacity: s, transformOrigin: "50% 100%" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 36, background: "#fff", border: `4px solid ${colors.mint}`, boxShadow: "0 14px 34px rgba(0,0,0,0.07)" }} />
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 16, borderRadius: "36px 36px 0 0", background: bg }} />
              <div style={{ position: "absolute", top: 36, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
                <div style={{ width: 60, height: 60, borderRadius: 30, background: bg, color: i === 1 ? colors.brandDeep : "#fff", fontFamily: fonts.display, fontWeight: 900, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
              </div>
              <svg width={300} height={220} style={{ position: "absolute", top: 110, left: 0, overflow: "visible" }} viewBox="-150 -110 300 220">
                <circle r={88} fill={colors.mintLight} />
                <g transform={`translate(0 ${floatY(frame, 4, 90, i * 30)})`}>{icon}</g>
              </svg>
              <div style={{ position: "absolute", top: 350, left: 22, right: 22, textAlign: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 36, lineHeight: 1.15, color: colors.brandDeep }}>{labels[i]}</div>
            </div>
          );
        })}
        {at.map((a, i) => (frame >= a + 6 ? <Sparkles key={i} x={xs[i]} y={620} count={6} spread={110} start={a + 6} size={5} color={i === 1 ? colors.gold : colors.brandSoft} /> : null))}
      </Camera>
    </SoftBackground>
  );
};

/* 4. Zeket: schematic site — reports chart, projects on a Kyrgyzstan map, verified requests */
const Zeket: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const siteAt = wordFrame(scene, t(lang, "сайтта", "сайте"), 0.2);
  const reportsAt = wordFrame(scene, t(lang, "отчеттор", "отчётов"), 0.28);
  const regionsAt = Math.max(reportsAt + 1, wordFrame(scene, t(lang, "аймактар", "регионам"), 0.42));
  const checkAt = Math.max(regionsAt + 1, wordFrame(scene, t(lang, "текшерүүдөн", "проверку"), 0.6));
  const detailsAt = wordFrame(scene, t(lang, "сайттын", "самом"), 0.75);
  const frameS = pop(frame, 4, { damping: 16, stiffness: 90 });
  const panelAt = Math.min(siteAt, 26);
  const donutP = prog(frame, reportsAt, reportsAt + 40);
  const dotsP = prog(frame, regionsAt, regionsAt + 40);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);
  const rowsP = linear(frame, checkAt, checkAt + 50);
  const cur = [
    [460, 300],
    [230, 220],
    [690, 240],
    [560, 520],
  ];
  const cx = interpolate(frame, [0, reportsAt, regionsAt, checkAt], cur.map((c) => c[0]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cy = interpolate(frame, [0, reportsAt, regionsAt, checkAt], cur.map((c) => c[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const panel = (x: number, y: number, w: number, h: number, title: string, delay: number, children: React.ReactNode) => {
    const s = pop(frame, delay, { damping: 16, stiffness: 100 });
    return (
      <g transform={`translate(${x + w / 2} ${y + h / 2}) scale(${0.9 + 0.1 * s}) translate(${-(x + w / 2)} ${-(y + h / 2)})`} opacity={s}>
        <rect x={x} y={y} width={w} height={h} rx={24} fill={colors.mintLight} />
        <SvgText x={x + 24} y={y + 44} size={32} weight={800} color={colors.brandDeep} anchor="start">
          {title}
        </SvgText>
        {children}
      </g>
    );
  };
  return (
    <SoftBackground tint="#F4F6F8" glow="#E3ECEF">
      <Badge text="Иллюстрация" delay={4} />
      <Caption text={scene.caption ?? ""} delay={4} size={54} top={250} />
      <Camera duration={durationInFrames} from={{ scale: 1 }} to={{ scale: 1.05, y: -12 }}>
        <Canvas>
          <g transform={`translate(540 780) scale(${0.92 + 0.08 * frameS}) translate(-540 -780)`} opacity={frameS}>
            <BrowserFrame x={80} y={450} w={920} h={660} url="zeket.kg">
              {panel(30, 30, 420, 320, t(lang, "Отчеттор", "Отчёты"), panelAt, (
                <g>
                  <Donut x={140} y={200} r={72} thickness={28} progress={donutP} segments={[{ value: 40, color: colors.brand }, { value: 25, color: colors.gold }, { value: 20, color: colors.brandSoft }, { value: 15, color: colors.terracotta }]} />
                  {[colors.brand, colors.gold, colors.brandSoft, colors.terracotta].map((c, i) => (
                    <g key={i} transform={`translate(250 ${130 + i * 46})`} opacity={donutP > i / 4 ? 1 : 0.25}>
                      <rect x={0} y={-10} width={20} height={20} rx={6} fill={c} />
                      <rect x={34} y={-7} width={(140 - i * 25) * Math.min(1, Math.max(0, donutP * 4 - i))} height={14} rx={7} fill={c} opacity={0.5} />
                    </g>
                  ))}
                </g>
              ))}
              {panel(470, 30, 420, 320, t(lang, "Долбоорлор", "Проекты"), panelAt + 8, (
                <g>
                  <KyrgyzMap x={495} y={90} w={370} dots={dotsP} pulse={pulse} />
                </g>
              ))}
              {panel(30, 380, 860, 190, t(lang, "Кайрылуулар", "Обращения"), panelAt + 16, (
                <g>
                  <Folder x={130} y={480} scale={0.78} check={prog(frame, checkAt + 30, checkAt + 46)} />
                  {[0, 1, 2].map((i) => {
                    const p = Math.min(1, Math.max(0, rowsP * 3 - i));
                    return (
                      <g key={i} transform={`translate(250 ${435 + i * 48})`} opacity={0.3 + 0.7 * p}>
                        <rect x={0} y={0} width={600} height={34} rx={17} fill="#fff" />
                        <rect x={16} y={11} width={(220 + i * 60) * (0.4 + 0.6 * p)} height={12} rx={6} fill={colors.mint} />
                        <Check x={570} y={17} r={13} progress={p} />
                      </g>
                    );
                  })}
                </g>
              ))}
              {/* cursor */}
              <g transform={`translate(${cx} ${cy})`}>
                <path d="M0 0 L0 28 L8 21 L14 34 L20 31 L14 18 L24 18 Z" fill={colors.ink} stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
              </g>
            </BrowserFrame>
          </g>
        </Canvas>
        {frame >= checkAt + 30 && <Sparkles x={740} y={1000} count={8} spread={200} start={checkAt + 30} size={5} />}
      </Camera>
      <Tag text={t(lang, "Текшерилди", "Проверено")} delay={checkAt + 36} x={840} y={1035} bg={colors.brand} size={32} />
      <Note text={t(lang, "Майда-чүйдөсү — zeket.kg сайтында", "Подробности — на сайте zeket.kg")} delay={detailsAt - 6} bottom={690} />
    </SoftBackground>
  );
};

/* 5. Your part: a calm dialogue — question bubbles answered with documents and checks */
const YourPart: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const askAt = wordFrame(scene, t(lang, "суроо", "вопросы"), 0.25);
  const reportsAt = wordFrame(scene, t(lang, "отчетторду", "отчёты"), 0.4);
  const whoAt = wordFrame(scene, t(lang, "кимге", "кому"), 0.55);
  const gladAt = wordFrame(scene, t(lang, "кубанат", "рада"), 0.85);
  const rows = [
    { q: askAt, y: 560, answer: <DocIcon x={0} y={0} scale={0.42} /> },
    { q: reportsAt, y: 720, answer: <ChartIcon x={0} y={-6} scale={0.42} progress={1} /> },
    { q: whoAt, y: 880, answer: <PhotoIcon x={0} y={0} scale={0.62} /> },
  ];
  const glad = pop(frame, gladAt, { damping: 12 });
  return (
    <SoftBackground glow="#F6E3D2">
      <Caption text={scene.caption ?? ""} delay={askAt - 20} size={76} />
      <Camera duration={durationInFrames} from={{ scale: 1.02 }} to={{ scale: 1.07, y: -8 }}>
        <Canvas>
          <ellipse cx={540} cy={1160} rx={500} ry={50} fill={colors.creamDark} opacity={0.8} />
          <Person x={230} y={1150} scale={0.82} hat="cap" hatColor="#5F6F82" outfit="#3F6B8E" skin={colors.skin2} bob={floatY(frame, 2, 100)} armR={-30 - 10 * Math.sin(frame / 40)} />
          <Person x={850} y={1150} scale={0.82} hat="hijab" hatColor="#B9897F" outfit={colors.brand} skin={colors.skin1} bob={floatY(frame, 2, 110, 30)} flip armR={-20} />
          {/* fund badge on the chest */}
          <g transform={`translate(${850 - 10} ${1150 - 215 + floatY(frame, 2, 110, 30)}) scale(0.82)`}>
            <rect x={-30} y={-14} width={60} height={28} rx={8} fill={colors.gold} />
          </g>
          {rows.map((r, i) => {
            const qs = pop(frame, r.q, { damping: 13, stiffness: 120 });
            const as = pop(frame, r.q + 26, { damping: 13, stiffness: 120 });
            return (
              <g key={i}>
                <g transform={`translate(430 ${r.y + floatY(frame, 2, 80, i * 20)}) scale(${qs})`} opacity={qs}>
                  <Bubble x={0} y={0} w={240} h={110} side="left" stroke={colors.terracotta}>
                    <QuestionMark x={0} y={26} size={72} color={colors.terracotta} />
                  </Bubble>
                </g>
                <g transform={`translate(650 ${r.y + 50 + floatY(frame, 2, 80, i * 20 + 40)}) scale(${as})`} opacity={as}>
                  <Bubble x={0} y={0} w={240} h={110} side="right" color={colors.mintLight} stroke={colors.brand}>
                    <g transform="translate(-30 0)">{r.answer}</g>
                    <Check x={62} y={0} r={22} progress={prog(frame, r.q + 36, r.q + 52)} />
                  </Bubble>
                </g>
              </g>
            );
          })}
          <g transform={`translate(850 ${720 - (1 - glad) * 20}) scale(${glad})`} opacity={glad}>
            <Heart x={0} y={0} scale={0.55} color={colors.terracotta} />
          </g>
        </Canvas>
        {frame >= gladAt && <Sparkles x={850} y={760} count={10} spread={80} start={gladAt} size={5} />}
      </Camera>
      <Tag text={t(lang, "Ачыктык — эки тарапка", "Прозрачность — в обе стороны")} delay={8} x={W / 2} y={450} bg={colors.brandSoft} size={32} />
    </SoftBackground>
  );
};

/* 6. Outro: the fog has cleared — a clear road from giver to recipient, logo lockup */
const Outro: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const fog = 1 - prog(frame, 6, 54, Easing.inOut(Easing.quad));
  const roadP = prog(frame, 10, 60);
  const walk = linear(frame, 30, 190);
  return (
    <AbsoluteFill>
      <Sky mode="day" />
      <Sun x={930} y={470} r={36} />
      <Cloud x={60} y={440} scale={0.6} speed={0.2} opacity={0.7} />
      <Mountains y={1040} parallax={0.04} />
      <Ground y={1160} />
      <Canvas>
        <RoadPath d="M120 1236 Q 400 1160 620 1210 T 960 1200" progress={roadP} color="#D9C9A3" width={44} dashed />
        <Tree x={60} y={1200} scale={0.55} sway={sway(frame, 1.5, 140)} />
        <House x={960} y={1210} scale={0.55} lit />
        <Person x={120 + walk * 360} y={1236} scale={0.45} hat="cap" hatColor="#5F6F82" outfit="#3F6B8E" skin={colors.skin2} bob={-Math.abs(Math.sin(frame / 5)) * 3 * (walk < 1 ? 1 : 0)} armL={Math.sin(frame / 5) * 14} armR={-Math.sin(frame / 5) * 14} />
        <Person x={880} y={1232} scale={0.45} hat="scarf" hatColor="#C98BA4" outfit="#6E8F6B" skin={colors.skin1} flip armR={-40 * prog(frame, 120, 150)} />
      </Canvas>
      <Fog density={fog} frame={frame} top={430} bottom={1300} />
      <LogoLockup delay={16} y={440} />
      {frame >= 30 && <Sparkles x={W / 2} y={820} count={14} spread={260} start={30} size={6} />}
      <Caption text={scene.caption ?? ""} delay={26} size={72} top={240} />
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = { hook: Hook, amana: Amana, principles: Principles, zeket: Zeket, yourpart: YourPart, outro: Outro };
