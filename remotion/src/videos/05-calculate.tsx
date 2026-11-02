import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import type { SceneMap, SceneProps, Lang } from "../types";
import { colors, fonts, W } from "../theme";
import { Caption, Note } from "../components/Text";
import { Camera } from "../components/Camera";
import { LogoLockup, BrandChip } from "../components/Brand";
import { pop, prog, linear, wordFrame, floatY } from "../components/anim";
import { Sky, Mountains, Sparkles, House, Canvas, Person, Coin, Banknote, GoldBar, Check, Phone, SvgText } from "../illustrations";
import { SoftBackground, Badge } from "../scenes/common";
import { Basket, BasketFront, Teacup, Notebook, Pen, GoodsBox, Car, PersonalThings, Strike, StepIndicator, CalculatorScreen, Arrow } from "../illustrations/extra-04-05";

const t = (lang: Lang, ky: string, ru: string) => (lang === "ky" ? ky : ru);
const capSize = (s: string) => (s.length > 44 ? 50 : s.length > 30 ? 56 : s.length > 24 ? 60 : 68);

/** Faint graph-paper grid for the chart-like scenes */
const Grid: React.FC<{ color?: string; opacity?: number }> = ({ color = colors.brandSoft, opacity = 0.12 }) => (
  <g opacity={opacity}>
    {Array.from({ length: 14 }).map((_, i) => (
      <line key={`v${i}`} x1={60 + i * 80} y1={520} x2={60 + i * 80} y2={1140} stroke={color} strokeWidth={2} />
    ))}
    {Array.from({ length: 8 }).map((_, i) => (
      <line key={`h${i}`} x1={60} y1={540 + i * 80} x2={1020} y2={540 + i * 80} stroke={color} strokeWidth={2} />
    ))}
  </g>
);

/** Bank card icon. Origin centre, 150×96 */
const BankCard: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-75} y={-48} width={150} height={96} rx={14} fill="#3F6B8E" />
    <rect x={-75} y={-28} width={150} height={20} fill={colors.ink} opacity={0.7} />
    <rect x={-58} y={8} width={38} height={26} rx={5} fill={colors.gold} />
    <rect x={-10} y={16} width={60} height={8} rx={4} fill="#fff" opacity={0.8} />
  </g>
);

/** Text whose characters pop in one after another (HTML) */
const Reveal: React.FC<{ text: string; at: number; x: number; y: number; size: number; color: string; stagger?: number; anchor?: "center" | "left" }> = ({ text, at, x, y, size, color, stagger = 3, anchor = "center" }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: anchor === "center" ? "translate(-50%, -50%)" : "translateY(-50%)", display: "flex", fontFamily: fonts.display, fontWeight: 900, fontSize: size, color, whiteSpace: "pre", letterSpacing: -1 }}>
      {text.split("").map((c, i) => {
        const s = pop(frame, at + i * stagger, { damping: 12, stiffness: 160 });
        return (
          <span key={i} style={{ display: "inline-block", opacity: s, transform: `translateY(${(1 - s) * 24}px) scale(${0.6 + 0.4 * s})` }}>
            {c}
          </span>
        );
      })}
    </div>
  );
};

/* 1. Hook: a home table with notebook, pen, tea and a phone; five empty steps descend */
const Hook: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const stepsAt = wordFrame(scene, t(lang, "Кадам", "шагам"), 0.55);
  const drop = prog(frame, stepsAt - 6, stepsAt + 24, Easing.out(Easing.back(1.1)));
  const tableS = pop(frame, 2, { damping: 16, stiffness: 90 });
  return (
    <SoftBackground tint="#FBF3E6" glow="#F5E3C8">
      <Caption text={scene.caption ?? ""} delay={6} size={capSize(scene.caption ?? "")} />
      <Camera duration={durationInFrames} from={{ scale: 1.0 }} to={{ scale: 1.08, y: -16 }}>
        <Canvas>
          {/* wall ornament stripe */}
          <g opacity={0.5}>
            {Array.from({ length: 9 }).map((_, i) => (
              <path key={i} d={`M${60 + i * 120} 1060 l30 -22 l30 22 l30 -22 l30 22`} fill="none" stroke={colors.terracotta} strokeWidth={4} />
            ))}
          </g>
          {/* table */}
          <g opacity={tableS}>
            <rect x={60} y={1080} width={960} height={36} rx={14} fill="#B07A4A" />
            <rect x={60} y={1080} width={960} height={10} fill="#C98F5B" />
            <rect x={140} y={1116} width={26} height={110} rx={8} fill="#8C5A32" />
            <rect x={914} y={1116} width={26} height={110} rx={8} fill="#8C5A32" />
          </g>
          <g transform={`translate(0 ${(1 - tableS) * 40})`} opacity={tableS}>
            <Notebook x={360} y={990} scale={1} rotate={-6} lines={3} />
            <Pen x={540} y={1010} scale={0.8} rotate={-62} />
            <Teacup x={700} y={1078} scale={1} steam={frame} />
            <Phone x={880} y={930} scale={0.3}>
              <CalculatorScreen title={t(lang, "Эсептөө", "Расчёт")} value="—" result="—" resultLabel="" reveal={0} />
            </Phone>
          </g>
          {/* five empty steps descending */}
          <g transform={`translate(0 ${-90 * (1 - drop)})`} opacity={prog(frame, stepsAt - 6, stepsAt + 4)}>
            <StepIndicator step={0} y={470} />
          </g>
        </Canvas>
      </Camera>
      <BrandChip delay={4} />
    </SoftBackground>
  );
};

/* 2. Step 1: what counts – items fall into the basket; excluded items gently crossed out */
const Assets: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const labels = scene.labels ?? ["", "", "", ""];
  const excluded = scene.excluded ?? ["", "", ""];
  const ats = [
    wordFrame(scene, t(lang, "накталай", "наличные"), 0.25),
    wordFrame(scene, t(lang, "эсептеги", "счетах"), 0.35),
    wordFrame(scene, t(lang, "алтын", "золото"), 0.45),
    wordFrame(scene, t(lang, "товарлар", "товары"), 0.55),
  ];
  const exAts = [wordFrame(scene, t(lang, "үй", "дом"), 0.72), wordFrame(scene, t(lang, "унаа", "машина"), 0.8), wordFrame(scene, t(lang, "жеке", "вещи"), 0.86)];
  const notAt = wordFrame(scene, t(lang, "кирбейт", "облагаются"), 0.93);
  const bx = 300;
  const by = 1190;
  const rowY = [630, 720, 810, 900];
  const icons = [
    (s: number) => <Banknote x={0} y={0} scale={0.42 * s} rotate={-8} />,
    (s: number) => <BankCard x={0} y={0} scale={0.5 * s} />,
    (s: number) => (
      <g transform={`scale(${s})`}>
        <GoldBar x={-10} y={10} scale={0.5} />
        <g transform="translate(26 -6) scale(0.42)">
          <path d="M-70 30 L-55 -30 L55 -30 L70 30 Z" fill="#C9D1D9" />
          <path d="M-55 -30 L-45 -42 L45 -42 L55 -30 Z" fill="#E6EBEF" />
        </g>
      </g>
    ),
    (s: number) => <GoodsBox x={0} y={36} scale={0.5 * s} />,
  ];
  return (
    <SoftBackground tint="#F7F3EA" glow="#E6EFE3">
      <Caption text={scene.caption ?? ""} delay={4} size={capSize(scene.caption ?? "")} />
      <Camera duration={durationInFrames} from={{ scale: 1.0, x: 6 }} to={{ scale: 1.04, x: -6 }}>
        <Canvas>
          <StepIndicator step={1} delay={2} />
          {/* column headers */}
          <g opacity={prog(frame, ats[0] - 20, ats[0] - 6)}>
            <rect x={70} y={548} width={440} height={54} rx={27} fill={colors.brand} />
            <SvgText x={290} y={585} size={32} weight={900} color="#fff">
              ✓ {t(lang, "Эсепке кирет", "Учитывается")}
            </SvgText>
          </g>
          <g opacity={prog(frame, exAts[0] - 20, exAts[0] - 6)}>
            <rect x={600} y={548} width={420} height={54} rx={27} fill="#fff" stroke={colors.red} strokeWidth={4} />
            <SvgText x={810} y={585} size={32} weight={900} color={colors.red}>
              ✕ {t(lang, "Эсепке кирбейт", "Не облагается")}
            </SvgText>
          </g>
          {/* basket (back) */}
          <g opacity={prog(frame, 6, 20)}>
            <Basket x={bx} y={by} scale={0.72} />
          </g>
          {/* included items: appear by the label, then drop into the basket */}
          {labels.map((lab, i) => {
            const at = ats[i];
            const s = pop(frame, at, { damping: 13, stiffness: 140 });
            const fall = prog(frame, at + 26, at + 60, Easing.in(Easing.quad));
            const ix = 130 + (bx - 130 + (i - 1.5) * 56) * fall;
            const iy = rowY[i] + (by - 150 - rowY[i]) * fall;
            const scaleF = 1 - fall * 0.15;
            return (
              <g key={i}>
                <SvgText x={215} y={rowY[i] + 12} size={34} weight={800} color={colors.brandDeep} anchor="start" opacity={s}>
                  {lab}
                </SvgText>
                <g transform={`translate(${ix} ${iy}) scale(${s * scaleF})`}>{icons[i](1.5)}</g>
              </g>
            );
          })}
          <BasketFront x={bx} y={by} scale={0.72} />
          {/* excluded column */}
          {excluded.map((ex, i) => {
            const at = exAts[i];
            const s = pop(frame, at, { damping: 13, stiffness: 120 });
            const strike = prog(frame, at + 14, at + 34);
            const cy = [690, 870, 1040][i];
            return (
              <g key={i} opacity={s}>
                <g transform={`translate(810 ${cy}) scale(${0.7 + 0.3 * s})`}>
                  {i === 0 && <House x={0} y={40} scale={0.42} />}
                  {i === 1 && <Car x={0} y={40} scale={0.55} />}
                  {i === 2 && <PersonalThings x={0} y={0} scale={0.55} />}
                  <Strike x={0} y={0} w={200} progress={strike} />
                </g>
                <SvgText x={810} y={cy + 92} size={32} weight={800} color={colors.inkSoft}>
                  {ex}
                </SvgText>
              </g>
            );
          })}
        </Canvas>
      </Camera>
      {frame > notAt && <Sparkles x={bx} y={1000} count={10} spread={120} start={notAt} size={5} />}
    </SoftBackground>
  );
};

/* 3. Step 2: nisab threshold line; the savings column grows past it; ≈85 g gold */
const Nisab: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const compareAt = wordFrame(scene, t(lang, "салыштырыңыз", "сравните"), 0.12);
  const nisabAt = wordFrame(scene, t(lang, "Нисаб", "Нисаб"), 0.2, 1);
  const goldAt = wordFrame(scene, t(lang, "сексен", "восьмидесяти"), 0.35);
  const silverAt = wordFrame(scene, t(lang, "күмүштүн", "серебре"), 0.55);
  const noteAt = wordFrame(scene, t(lang, "актуалдуу", "Актуальную"), 0.72);
  const lineY = 800;
  const baseY = 1060;
  const lineP = prog(frame, 6, 40);
  const barH = interpolate(frame, [compareAt, compareAt + 70], [40, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const above = baseY - barH < lineY;
  const okS = pop(frame, compareAt + 58, { damping: 12 });
  const goldS = pop(frame, goldAt, { damping: 13 });
  const silverS = pop(frame, silverAt, { damping: 13 });
  return (
    <SoftBackground tint="#F8F6F0" glow="#E7EFEA">
      <Caption text={scene.caption ?? ""} delay={4} size={capSize(scene.caption ?? "")} />
      <Camera duration={durationInFrames} from={{ scale: 1.0 }} to={{ scale: 1.05, y: -10 }}>
        <Canvas>
          <Grid />
          <StepIndicator step={2} delay={2} />
          {/* base */}
          <line x1={100} y1={baseY} x2={980} y2={baseY} stroke={colors.brandDeep} strokeWidth={6} strokeLinecap="round" opacity={lineP} />
          {/* threshold */}
          <line x1={100} y1={lineY} x2={100 + 880 * lineP} y2={lineY} stroke={colors.terracotta} strokeWidth={6} strokeDasharray="22 16" strokeLinecap="round" />
          <g transform={`translate(190 ${lineY - 44}) scale(${pop(frame, nisabAt, { damping: 14 })})`}>
            <rect x={-90} y={-30} width={180} height={60} rx={30} fill={colors.terracotta} />
            <SvgText x={0} y={12} size={34} weight={900} color="#fff">
              {t(lang, "НИСАБ", "НИСАБ")}
            </SvgText>
          </g>
          {/* savings column */}
          <rect x={360} y={baseY - barH} width={180} height={barH} rx={18} fill={above ? colors.brand : colors.brandSoft} opacity={prog(frame, compareAt - 10, compareAt + 5)} />
          <rect x={360} y={baseY - barH} width={180} height={Math.min(barH, 40)} rx={18} fill="rgba(255,255,255,0.25)" opacity={prog(frame, compareAt - 10, compareAt + 5)} />
          {Array.from({ length: 4 }).map((_, i) => (
            <Coin key={i} x={400 + (i % 2) * 100} y={baseY - 40 - Math.floor(i / 2) * 60} r={22} color="#EBC66B" />
          ))}
          <SvgText x={450} y={baseY + 48} size={34} weight={800} color={colors.brandDeep} opacity={prog(frame, compareAt, compareAt + 12)}>
            {t(lang, "Сиздин сумма", "Ваша сумма")}
          </SvgText>
          <g transform={`translate(450 ${baseY - barH - 48}) scale(${okS})`} opacity={okS}>
            <Check x={0} y={0} r={34} color={colors.brand} progress={okS} />
          </g>
          {/* gold & silver reference on the right */}
          <g transform={`translate(780 1000) scale(${goldS})`} opacity={goldS}>
            <GoldBar x={0} y={0} scale={1.1} />
            <GoldBar x={-14} y={-46} scale={0.95} />
          </g>
          <g transform={`translate(780 ${baseY - 40}) scale(${goldS})`} opacity={goldS}>
            <rect x={-130} y={-30} width={260} height={60} rx={30} fill={colors.gold} />
            <SvgText x={0} y={14} size={44} weight={900} color={colors.brandDeep}>
              ≈ 85 {t(lang, "г", "г")}
            </SvgText>
          </g>
          <SvgText x={780} y={baseY + 48} size={34} weight={800} color={colors.brandDeep} opacity={goldS}>
            {t(lang, "алтын", "золота")}
          </SvgText>
          <g transform={`translate(900 ${900 + floatY(frame, 3, 80)}) scale(${silverS * 0.7})`} opacity={silverS}>
            <path d="M-70 30 L-55 -30 L55 -30 L70 30 Z" fill="#C9D1D9" />
            <path d="M-55 -30 L-45 -42 L45 -42 L55 -30 Z" fill="#E6EBEF" />
            <SvgText x={0} y={-56} size={32} weight={800} color={colors.inkSoft}>
              {t(lang, "же күмүш", "или серебро")}
            </SvgText>
          </g>
        </Canvas>
        {okS > 0.5 && <Sparkles x={450} y={baseY - barH - 40} count={10} spread={80} start={compareAt + 58} size={6} />}
      </Camera>
      {scene.note && <Note text={scene.note} delay={noteAt - 6} />}
    </SoftBackground>
  );
};

/* 4. Step 3: lunar-year ring; start and end both above the nisab line */
const Hawl: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const sweepAt = wordFrame(scene, t(lang, "мөөнөттү", "срок"), 0.15);
  const startAt = wordFrame(scene, t(lang, "башында", "начале"), 0.7);
  const endAt = wordFrame(scene, t(lang, "аягында", "конце"), 0.85);
  const cx = 540;
  const cy = 860;
  const R = 250;
  const sweep = linear(frame, sweepAt, endAt);
  const startS = pop(frame, startAt, { damping: 12 });
  const endS = pop(frame, endAt, { damping: 12 });
  const light = "#F6E7B8";
  return (
    <AbsoluteFill>
      <Sky mode="night" />
      <Canvas>
        {Array.from({ length: 36 }).map((_, i) => {
          const sx = (i * 263) % W;
          const sy = (i * 157) % 1000;
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / 25 + i));
          return <circle key={i} cx={sx} cy={sy + 40} r={2.5} fill="#fff" opacity={tw * 0.8} />;
        })}
      </Canvas>
      <Mountains y={1000} far="#2C4466" near="#1E3250" />
      <Camera duration={durationInFrames} from={{ scale: 1.0 }} to={{ scale: 1.06 }}>
        <Canvas>
          <StepIndicator step={3} delay={2} dark />
          {/* ring of 12 moons */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={light} strokeWidth={3} strokeDasharray="6 14" opacity={0.3} />
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={colors.gold} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={`${sweep} 1`} transform={`rotate(-90 ${cx} ${cy})`} opacity={0.9} />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = -Math.PI / 2 + (i / 12) * Math.PI * 2;
            const mx = cx + Math.cos(a) * R;
            const my = cy + Math.sin(a) * R;
            const lit = sweep * 12 >= i ? 1 : 0.3;
            const k = Math.cos((i / 12) * Math.PI * 2);
            return (
              <g key={i} transform={`translate(${mx} ${my})`} opacity={lit}>
                <circle r={30} fill={colors.night} />
                <circle r={22} fill={light} />
                <ellipse cx={k > 0 ? 8 : -8} cy={0} rx={Math.abs(k) * 22} ry={22} fill={k > 0 ? colors.night : light} opacity={k > 0 ? 1 : 0} />
              </g>
            );
          })}
          {/* inside: nisab line + two bars */}
          <line x1={cx - 160} y1={cy + 40} x2={cx + 160} y2={cy + 40} stroke={colors.terracotta} strokeWidth={5} strokeDasharray="16 12" strokeLinecap="round" />
          <SvgText x={cx - 160} y={cy + 76} size={32} weight={800} color="#E7B98A" opacity={0.9} anchor="start">
            {t(lang, "нисаб", "нисаб")}
          </SvgText>
          <g transform={`translate(${cx - 90} ${cy + 40})`}>
            <rect x={-40} y={-150 * startS} width={80} height={150 * startS} rx={14} fill={colors.brand} stroke={light} strokeWidth={3} />
            <SvgText x={0} y={-166} size={32} weight={900} color={light} opacity={startS}>
              {t(lang, "башы", "начало")}
            </SvgText>
          </g>
          <g transform={`translate(${cx + 90} ${cy + 40})`}>
            <rect x={-40} y={-170 * endS} width={80} height={170 * endS} rx={14} fill={colors.brand} stroke={light} strokeWidth={3} />
            <SvgText x={0} y={-186} size={32} weight={900} color={light} opacity={endS}>
              {t(lang, "аягы", "конец")}
            </SvgText>
          </g>
          <SvgText x={cx} y={cy + 140} size={44} weight={900} color={light} opacity={prog(frame, 10, 24)}>
            {t(lang, "12 ай", "12 месяцев")}
          </SvgText>
        </Canvas>
      </Camera>
      <Caption text={scene.caption ?? ""} delay={4} size={capSize(scene.caption ?? "")} color={light} />
    </AbsoluteFill>
  );
};

/* 5. Step 4: debts – a red block subtracts from the sum, a green block adds */
const Debts: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const labels = scene.labels ?? ["−", "+"];
  const debtAt = wordFrame(scene, t(lang, "карыздарды", "долги"), 0.15);
  const subAt = wordFrame(scene, t(lang, "алынып", "вычитаются"), 0.5);
  const creditAt = wordFrame(scene, t(lang, "сизге", "вам"), 0.65);
  const addAt = wordFrame(scene, t(lang, "кошулат", "учитываются"), 0.92);
  const baseY = 1090;
  const H0 = 340;
  const sub = prog(frame, subAt, subAt + 30, Easing.inOut(Easing.cubic));
  const add = prog(frame, addAt, addAt + 30, Easing.out(Easing.back(1.2)));
  const h = H0 - 90 * sub + 70 * add;
  const debtIn = prog(frame, debtAt, debtAt + 30, Easing.out(Easing.back(1.1)));
  const credIn = prog(frame, creditAt, creditAt + 30, Easing.out(Easing.back(1.1)));
  return (
    <SoftBackground tint={colors.creamDark} glow="#F5EBDA">
      <Caption text={scene.caption ?? ""} delay={4} size={capSize(scene.caption ?? "")} />
      <Camera duration={durationInFrames} from={{ scale: 1.0, y: 6 }} to={{ scale: 1.05, y: -8 }}>
        <Canvas>
          <StepIndicator step={4} delay={2} />
          {/* ledger sheet */}
          <rect x={90} y={560} width={900} height={580} rx={30} fill="#fff" opacity={0.75 * prog(frame, 4, 18)} />
          <line x1={90} y1={640} x2={990} y2={640} stroke={colors.mint} strokeWidth={3} opacity={prog(frame, 4, 18)} />
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1={130} y1={700 + i * 70} x2={950} y2={700 + i * 70} stroke={colors.mintLight} strokeWidth={3} />
          ))}
          <line x1={120} y1={baseY} x2={960} y2={baseY} stroke={colors.brandDeep} strokeWidth={6} strokeLinecap="round" />
          {/* sum column */}
          <rect x={440} y={baseY - h} width={200} height={h} rx={20} fill={colors.brandSoft} />
          <rect x={440} y={baseY - h} width={200} height={34} rx={17} fill="rgba(255,255,255,0.3)" />
          <SvgText x={540} y={baseY + 46} size={34} weight={800} color={colors.brandDeep}>
            {t(lang, "Сумма", "Сумма")}
          </SvgText>
          {/* red block: debts you owe (slides in from the left, then a slice leaves the column top) */}
          <g transform={`translate(${-300 + debtIn * (250 + 300)} 780)`} opacity={debtIn}>
            <rect x={-140} y={-50} width={280} height={100} rx={20} fill={colors.red} />
            <SvgText x={0} y={12} size={34} weight={900} color="#fff">
              {labels[0]}
            </SvgText>
          </g>
          {sub > 0 && (
            <g transform={`translate(${540 + sub * -170} ${baseY - H0 + sub * -90 + 45 * sub}) rotate(${sub * -20})`} opacity={1 - sub}>
              <rect x={-100} y={-45} width={200} height={90} rx={18} fill={colors.red} />
            </g>
          )}
                    <g opacity={debtIn * (1 - sub)}>
            <Arrow x={398} y={780} angle={0} len={36} color={colors.red} width={8} />
          </g>
          {/* green block: money owed to you (slides in from the right, then attaches on top) */}
          <g transform={`translate(${W + 300 - credIn * (W + 300 - 830)} 780)`} opacity={credIn}>
            <rect x={-140} y={-50} width={280} height={100} rx={20} fill={colors.brand} />
            <SvgText x={0} y={12} size={34} weight={900} color="#fff">
              {labels[1]}
            </SvgText>
          </g>
          <g opacity={credIn * (1 - add)}>
            <Arrow x={682} y={780} angle={180} len={36} color={colors.brand} width={8} />
          </g>
          {add > 0 && <rect x={440} y={baseY - h} width={200} height={70 * add} rx={20} fill={colors.brand} />}
          {add > 0.5 && <Sparkles x={540} y={baseY - h} count={10} spread={120} start={addAt + 15} size={6} />}
        </Canvas>
      </Camera>
    </SoftBackground>
  );
};

/* 6. Step 5: the formula on a green board, digits appear as spoken */
const Rate: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const exampleAt = wordFrame(scene, t(lang, "Мисал", "примера"), 0.2);
  const sumAt = wordFrame(scene, t(lang, "сексен", "восемьдесят"), 0.3);
  const rateAt = wordFrame(scene, t(lang, "жарым", "половиной"), 0.45, 1);
  const resultAt = wordFrame(scene, t(lang, "миң", "две"), 0.55, lang === "ky" ? 2 : 0);
  const arithAt = wordFrame(scene, "арифметика", 0.65);
  const boardS = pop(frame, 4, { damping: 16, stiffness: 90 });
  const glow = 0.5 + 0.5 * Math.sin(frame / 18);
  return (
    <SoftBackground tint="#F6F1E6" glow="#E7EFE9">
      <Caption text={t(lang, "5-кадам. Өлчөм 2,5 %", "Шаг 5. Ставка 2,5 %")} delay={4} size={60} />
      <Canvas>
        <StepIndicator step={5} delay={2} />
        <g transform={`translate(540 820) scale(${0.9 + 0.1 * boardS})`} opacity={boardS}>
          <rect x={-444} y={-254} width={900} height={520} rx={34} fill="rgba(0,0,0,0.12)" />
          <rect x={-450} y={-260} width={900} height={520} rx={34} fill={colors.brandDeep} />
          <rect x={-450} y={-260} width={900} height={520} rx={34} fill="none" stroke="#8C6A52" strokeWidth={14} />
          <rect x={-430} y={-240} width={860} height={480} rx={24} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={3} />
          {/* 1/40 chip */}
          <g opacity={pop(frame, rateAt + 20, { damping: 14 })} transform="translate(330 -190)">
            <rect x={-80} y={-30} width={160} height={60} rx={30} fill={colors.gold} />
            <SvgText x={0} y={13} size={36} weight={900} color={colors.brandDeep}>
              1 / 40
            </SvgText>
          </g>
          {/* coin ring decoration */}
          {Array.from({ length: 40 }).map((_, i) => {
            const a = (i / 40) * Math.PI * 2 + frame / 400;
            const r = 24;
            return <circle key={i} cx={-330 + Math.cos(a) * 70} cy={-170 + Math.sin(a) * 70} r={i === 0 ? 7 : 4} fill={i === 0 ? colors.gold : "rgba(255,255,255,0.35)"} />;
          })}
        </g>
      </Canvas>
      {/* formula (HTML text so digits can pop one by one) */}
      <div style={{ position: "absolute", left: 0, width: W, top: 680, textAlign: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 36, color: "rgba(255,255,255,0.7)", opacity: prog(frame, exampleAt, exampleAt + 12) }}>
        {t(lang, "Мисал:", "Пример:")}
      </div>
      <Reveal text="80 000" at={sumAt} x={360} y={790} size={112} color="#FFF3C9" />
      <Reveal text="× 2,5 %" at={rateAt} x={790} y={792} size={86} color={colors.gold} stagger={4} />
      <div style={{ position: "absolute", left: 90, width: 900, top: 866, height: 6, background: `rgba(255,255,255,${0.25 + 0.2 * glow})`, borderRadius: 3, opacity: prog(frame, resultAt - 10, resultAt) }} />
      <Reveal text="= 2 000" at={resultAt} x={450} y={950} size={124} color="#FFFFFF" />
      <Reveal text={t(lang, "сом", "сом")} at={resultAt + 20} x={790} y={960} size={72} color="#FFF3C9" stagger={4} />
      {frame > resultAt + 20 && <Sparkles x={540} y={950} count={16} spread={300} start={resultAt + 20} size={6} />}
      <Badge text={t(lang, "Мисал", "Пример")} delay={exampleAt} />
      {scene.note && <Note text={scene.note} delay={arithAt} />}
    </SoftBackground>
  );
};

/* 7. Disclaimer: calm consultation over tea with a knowledgeable person */
const Disclaimer: React.FC<SceneProps> = ({ scene, lang, durationInFrames }) => {
  const frame = useCurrentFrame();
  const bizAt = wordFrame(scene, "бизнес", 0.55);
  const sharesAt = wordFrame(scene, t(lang, "үлүштөр", "доли"), 0.63);
  const investAt = wordFrame(scene, t(lang, "инвестициялар", "инвестиции"), 0.7);
  const adviseAt = wordFrame(scene, t(lang, "кеңешиңиз", "посоветуйтесь"), 0.9);
  const nod = pop(frame, adviseAt, { damping: 12 });
  const icons = [
    { at: bizAt, x: 360, draw: <GoodsBox x={0} y={34} scale={0.5} /> },
    {
      at: sharesAt,
      x: 540,
      draw: (
        <g>
          <circle r={34} fill={colors.mint} />
          <path d="M0 0 L0 -34 A34 34 0 0 1 32 10 Z" fill={colors.brand} />
          <path d="M0 0 L32 10 A34 34 0 0 1 -20 28 Z" fill={colors.gold} />
        </g>
      ),
    },
    {
      at: investAt,
      x: 720,
      draw: (
        <g>
          <path d="M-34 24 L-12 0 L6 14 L34 -24" fill="none" stroke={colors.brand} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M34 -24 L14 -24 M34 -24 L34 -4" fill="none" stroke={colors.brand} strokeWidth={8} strokeLinecap="round" />
        </g>
      ),
    },
  ];
  return (
    <SoftBackground tint="#FAF1E3" glow="#F2DFC4">
      <Caption text={scene.caption ?? ""} delay={4} size={capSize(scene.caption ?? "")} />
      <Camera duration={durationInFrames} from={{ scale: 1.0 }} to={{ scale: 1.06, y: -10 }}>
        <Canvas>
          <StepIndicator step={6} delay={2} />
          {/* shyrdak ornament band */}
          <g opacity={0.55}>
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i} transform={`translate(${110 + i * 124} 1180)`}>
                <path d="M-40 0 Q-40 -40 0 -40 Q40 -40 40 0 Q40 40 0 40 Q-40 40 -40 0 Z" fill="none" stroke={i % 2 ? colors.terracotta : colors.brandSoft} strokeWidth={6} />
                <circle r={10} fill={i % 2 ? colors.brandSoft : colors.terracotta} />
              </g>
            ))}
          </g>
          {/* rug + low table */}
          <ellipse cx={540} cy={1090} rx={430} ry={46} fill="#E6CFB0" />
          <rect x={400} y={990} width={280} height={30} rx={12} fill="#B07A4A" />
          <rect x={420} y={1020} width={18} height={60} fill="#8C5A32" />
          <rect x={642} y={1020} width={18} height={60} fill="#8C5A32" />
          <Teacup x={480} y={990} scale={0.6} steam={frame} />
          <Teacup x={600} y={990} scale={0.6} steam={frame + 40} />
          {/* people */}
          <Person x={300} y={1050} scale={0.8} sit outfit="#3F6B8E" skin={colors.skin2} armR={-60} armL={10} bob={floatY(frame, 2, 90)} />
          <Notebook x={420} y={900 + floatY(frame, 2, 90)} scale={0.5} rotate={-10} lines={3} />
          <Person x={780} y={1050} scale={0.8} sit hat="kalpak" outfit={colors.brand} skin={colors.skin1} armR={-30 - nod * 20} armL={10} bob={floatY(frame, 2, 100, 40) - nod * 6} flip />
          {/* topic icons */}
          {icons.map((ic, i) => {
            const s = pop(frame, ic.at, { damping: 13 });
            return (
              <g key={i} transform={`translate(${ic.x} ${620 + floatY(frame, 4, 90, i * 30)}) scale(${s})`} opacity={s}>
                <circle r={54} fill="#fff" stroke={colors.mint} strokeWidth={4} />
                {ic.draw}
              </g>
            );
          })}
          {/* reassurance check from the knowledgeable person */}
          <g transform={`translate(880 ${760 + (1 - nod) * 20}) scale(${nod})`} opacity={nod}>
            <circle r={44} fill="#fff" stroke={colors.mint} strokeWidth={4} />
            <Check x={0} y={0} r={30} color={colors.brand} progress={nod} />
          </g>
        </Canvas>
      </Camera>
    </SoftBackground>
  );
};

/* 8. Outro: phone with schematic calculator, then logo lockup */
const Outro: React.FC<SceneProps> = ({ scene, lang }) => {
  const frame = useCurrentFrame();
  const calcAt = wordFrame(scene, t(lang, "калькулятору", "калькулятор"), 0.2);
  const logoAt = wordFrame(scene, t(lang, "жардам", "помогает"), 0.5);
  const reveal = prog(frame, calcAt + 10, calcAt + 30);
  const phoneS = pop(frame, 4, { damping: 14, stiffness: 90 });
  const out = 1 - prog(frame, logoAt - 6, logoAt + 10);
  return (
    <SoftBackground>
      <Caption text={scene.caption ?? ""} delay={6} size={capSize(scene.caption ?? "")} top={270} />
      <Canvas>
        <g transform={`translate(540 ${870 + (1 - phoneS) * 60 + (1 - out) * -60}) scale(${0.7 * phoneS * (0.8 + 0.2 * out)})`} opacity={phoneS * out}>
          <Phone x={0} y={0} scale={1}>
            <CalculatorScreen title={t(lang, "Зекет калькулятору", "Калькулятор закята")} value="80 000" result="2 000" resultLabel={t(lang, "Зекет (сом)", "Закят (сом)")} reveal={reveal} />
          </Phone>
        </g>
      </Canvas>
      {out > 0.5 && <Badge text={scene.note ?? "Иллюстрация"} delay={6} />}
      {frame >= logoAt - 6 && <LogoLockup delay={logoAt} y={640} />}
      {frame >= logoAt && <Sparkles x={W / 2} y={900} count={18} spread={300} start={logoAt + 10} size={6} />}
    </SoftBackground>
  );
};

export const scenes: SceneMap = { hook: Hook, assets: Assets, nisab: Nisab, hawl: Hawl, debts: Debts, rate: Rate, disclaimer: Disclaimer, outro: Outro };
