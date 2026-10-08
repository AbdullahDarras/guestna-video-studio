import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import { C, EASE, FONT } from "../../brand";
import { useFrame } from "../../clock";
import { Burst, clamp, Clip, Disc, Pic, Pill, Sweep, Swoosh, usePop } from "../../kit";
import { ParentFlow } from "../../pitch/flows";
import { Backdrop, BigWords, CountUp, Glass, LogoColor, LogoWhite, Paper, PressButton, Rays, RingProgress } from "../../pitch/ui";
import { at, sceneDur } from "./tt";

const abs = (top: number, extra?: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left: 90, right: 90, top, display: "flex", flexDirection: "column", alignItems: "center", ...extra });
const photo = (n: string) => `media/edu/ai/${n}.jpg`;
const grade = (a = 0.82, b = 0.55, c = 0.9): React.CSSProperties => ({ background: `linear-gradient(180deg, rgba(10,45,90,${a}) 0%, rgba(18,66,124,${b}) 50%, rgba(10,45,90,${c}) 100%)` });

/* ------------------------------------------------------------ 1 ambition */
export const C1: React.FC = () => {
  const f = useFrame();
  const swap = interpolate(f, [at(1, 3, -6), at(1, 3, 12)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const first = 1 - Math.min(1, swap * 1.6);
  return (
    <AbsoluteFill style={{ backgroundColor: C.seaDark }}>
      <Pic src={photo("riyadh")} total={sceneDur(1)} from={1.02} to={1.3} />
      <div style={{ position: "absolute", inset: 0, opacity: swap }}>
        <Pic src={photo("sports")} total={sceneDur(1)} from={1.04} to={1.22} position="55% 50%" />
      </div>
      <AbsoluteFill style={grade()} />
      <div style={abs(300, { alignItems: "flex-end", opacity: first, translate: `0px ${-swap * 120}px`, gap: 0 })}>
        <BigWords words={[{ t: "في" }, { t: "كل" }, { t: "مدرسة" }]} delay={at(1, 0)} size={82} weight={300} />
        <BigWords words={[{ t: "أو" }, { t: "شركة" }, { t: "تعليمية" }]} delay={at(1, 1)} size={82} weight={300} />
        <BigWords words={[{ t: "طموحة" }]} delay={at(1, 2, -2)} size={220} color={C.desert} />
      </div>
      <div style={abs(900, { gap: 4 })}>
        <BigWords words={[{ t: "الأنشطة" }, { t: "والرحلات" }]} delay={at(1, 3)} size={96} weight={800} />
        <div style={{ position: "relative" }}>
          <BigWords words={[{ t: "مو" }, { t: "مجرد" }, { t: "ترفيه" }]} delay={at(1, 4)} size={70} weight={300} />
          <Strike at={at(1, 4, 14)} />
        </div>
        <BigWords words={[{ t: "هي" }, { t: "جزء" }, { t: "أساسي" }, { t: "من" }, { t: "بناء" }]} delay={at(1, 5)} size={64} weight={500} stagger={3} />
      </div>
      <div style={abs(1330, { gap: 0 })}>
        <div style={{ position: "relative" }}>
          <BigWords words={[{ t: "طالب" }, { t: "المستقبل" }]} delay={at(1, 7, -4)} size={130} color={C.white} />
          <Sweep at={at(1, 7, 8)} dur={30} />
        </div>
        <div style={{ marginLeft: -30 }}>
          <Swoosh at={at(1, 7, 6)} width={440} color={C.desert} thickness={12} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
const Strike: React.FC<{ readonly at: number }> = ({ at: t }) => {
  const f = useFrame();
  const s = interpolate(f, [t, t + 10], [0, 1], { ...clamp, easing: EASE });
  return <div style={{ position: "absolute", left: "calc(50% - 250px)", width: 500, top: "52%", height: 8, borderRadius: 4, backgroundColor: C.desert, transformOrigin: "right", scale: `${s} 1` }} />;
};

/* ------------------------------------------------------------ 2 the question */
export const C2: React.FC = () => {
  const f = useFrame();
  const q = usePop(at(2, 0, -4), 12);
  const shake = Math.sin(f * 2.4) * 4 * interpolate(f, [at(2, 2), at(2, 2, 40)], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: C.seaDark }}>
      <div style={{ position: "absolute", inset: -60, filter: "blur(16px)" }}>
        <Pic src={photo("art")} total={sceneDur(2)} from={1.1} to={1.25} />
      </div>
      <AbsoluteFill style={grade(0.9, 0.78, 0.94)} />
      <Paper x={170} y={1500} rot={-16} delay={at(2, 1)} w={220} h={290} from={{ x: -200, y: 1900 }} />
      <Paper x={900} y={1450} rot={14} delay={at(2, 1, 8)} w={240} h={310} from={{ x: 1300, y: 1900 }} />
      <Paper x={640} y={1640} rot={-6} delay={at(2, 2, 0)} w={200} h={260} from={{ x: 700, y: 2100 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 700, lineHeight: 1, color: C.desert, opacity: 0.18 * Math.min(1, q), scale: 0.8 + Math.max(0, q) * 0.2 }}>؟</div>
      <div style={abs(420, { gap: 4 })}>
        <BigWords words={[{ t: "بس" }, { t: "السؤال" }]} delay={at(2, 0)} size={96} weight={300} />
        <BigWords words={[{ t: "ليش" }, { t: "يتحول" }, { t: "تنظيم" }, { t: "الرحلة" }]} delay={at(2, 1)} size={92} weight={800} />
      </div>
      <div style={abs(980, { translate: `${shake}px 0px`, gap: 0 })}>
        <BigWords words={[{ t: "لمعاناة" }]} delay={at(2, 2, -2)} size={150} weight={300} color="#FFD3A1" />
        <BigWords words={[{ t: "إدارية" }]} delay={at(2, 2, 6)} size={220} color={C.desert} />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ 3 one platform */
export const C3: React.FC = () => {
  const logo = usePop(at(3, 0, -2), 12);
  return (
    <AbsoluteFill style={{ backgroundColor: C.seaDark }}>
      <Clip src="media/edu/ai-bus.mp4" total={sceneDur(3)} zoomFrom={1.04} zoomTo={1.18} />
      <AbsoluteFill style={grade(0.82, 0.62, 0.92)} />
      <Rays cx={540} cy={600} size={1800} opacity={0.55} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", scale: 0.55 + Math.max(0, logo) * 0.45, opacity: Math.min(1, logo) }}>
        <LogoWhite width={560} />
      </div>
      <div style={abs(700, { gap: 4 })}>
        <BigWords words={[{ t: "اختصرنا" }, { t: "كل" }, { t: "هالدورة" }]} delay={at(3, 1)} size={92} weight={300} />
      </div>
      <div style={abs(900, { gap: 0 })}>
        <BigWords words={[{ t: "منصة" }, { t: "رقمية" }]} delay={at(3, 2, -2)} size={200} />
        <BigWords words={[{ t: "واحدة" }]} delay={at(3, 2, 8)} size={250} color={C.desert} />
        <div style={{ marginLeft: -30 }}>
          <Swoosh at={at(3, 2, 16)} width={480} color={C.white} thickness={12} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ 4 smart marketplace */
export const C4: React.FC = () => {
  const f = useFrame();
  const cards = [
    { icon: "celebration", label: "ترفيهية", rot: -9, x: 120, k: 1 },
    { icon: "science", label: "محلية", rot: 0, x: 390, k: 2 },
    { icon: "hot-air-balloon", label: "دولية", rot: 9, x: 660, k: 3 },
  ];
  const panel = usePop(at(4, 4, -4), 12);
  const b1 = interpolate(f, [at(4, 4, 2), at(4, 4, 22)], [0, 1], { ...clamp, easing: EASE });
  const b2 = interpolate(f, [at(4, 5, 0), at(4, 5, 22)], [0, 1], { ...clamp, easing: EASE });
  const auto = usePop(at(4, 6, 0), 11);
  const clear = usePop(at(4, 7, 0), 11);
  return (
    <AbsoluteFill style={{ backgroundColor: C.seaDark }}>
      <div style={{ position: "absolute", inset: -60, filter: "blur(14px)" }}>
        <Pic src={photo("science")} total={sceneDur(4)} from={1.1} to={1.24} />
      </div>
      <AbsoluteFill style={grade(0.88, 0.7, 0.93)} />
      <div style={abs(250, { gap: 2 })}>
        <BigWords words={[{ t: "سوق" }, { t: "مدرسي" }, { t: "ذكي" }]} delay={at(4, 0, -2)} size={104} />
        <BigWords words={[{ t: "يتيح" }, { t: "لرائد" }, { t: "النشاط" }]} delay={at(4, 1)} size={62} weight={300} />
      </div>
      {cards.map((c) => (
        <FanCard key={c.label} {...c} delay={at(4, 2, c.k * 4)} />
      ))}
      <div style={{ position: "absolute", left: 100, right: 100, top: 1090, height: 420, scale: 0.8 + Math.max(0, panel) * 0.2, opacity: Math.min(1, panel * 1.4) }}>
        <Glass style={{ height: "100%", padding: "34px 44px", direction: "rtl", fontFamily: FONT, backgroundColor: "rgba(255,255,255,0.16)" }}>
          <div style={{ fontSize: 44, fontWeight: 700, color: C.white }}>التكاليف</div>
          <div style={{ height: 30, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.18)", marginTop: 14, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${b1 * 60}%`, backgroundColor: C.white, borderRadius: 15 }} />
          </div>
          <div style={{ fontSize: 44, fontWeight: 700, color: C.white, marginTop: 34 }}>أرباح المدرسة</div>
          <div style={{ height: 30, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.18)", marginTop: 14, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${b2 * 86}%`, backgroundColor: C.desert, borderRadius: 15 }} />
          </div>
        </Glass>
      </div>
      <div style={{ position: "absolute", left: 100, right: 100, top: 1560, display: "flex", justifyContent: "center", gap: 22 }}>
        <div style={{ scale: 0.5 + Math.max(0, auto) * 0.5, opacity: Math.min(1, auto * 1.5), position: "relative" }}>
          <Pill bg={C.desert} color={C.white} size={44} weight={700}>
            تلقائياً
          </Pill>
        </div>
        <div style={{ scale: 0.5 + Math.max(0, clear) * 0.5, opacity: Math.min(1, clear * 1.5) }}>
          <Pill bg="rgba(255,255,255,0.2)" color={C.white} size={44} weight={700}>
            بكل شفافية
          </Pill>
        </div>
      </div>
    </AbsoluteFill>
  );
};
const FanCard: React.FC<{ readonly icon: string; readonly label: string; readonly rot: number; readonly x: number; readonly delay: number }> = ({ icon, label, rot, x, delay }) => {
  const f = useFrame();
  const p = usePop(delay, 11);
  return (
    <div style={{ position: "absolute", left: x, top: 590 + Math.sin(f / 16 + x) * 8, width: 300, height: 420, scale: 0.5 + Math.max(0, p) * 0.5, opacity: Math.min(1, p * 1.5), rotate: `${rot * Math.min(1, p)}deg` }}>
      <Glass style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, direction: "rtl", fontFamily: FONT, backgroundColor: "rgba(255,255,255,0.2)" }}>
        <Disc icon={icon} size={170} />
        <div style={{ fontSize: 58, fontWeight: 800, color: C.white }}>{label}</div>
      </Glass>
    </div>
  );
};

/* ------------------------------------------------------------ 5 parent */
export const C5: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.seaDark }}>
    <div style={{ position: "absolute", inset: -60, filter: "blur(16px)" }}>
      <Pic src={photo("fun")} total={sceneDur(5)} from={1.1} to={1.24} />
    </div>
    <AbsoluteFill style={grade(0.88, 0.72, 0.94)} />
    <div style={abs(250, { gap: 4 })}>
      <BigWords words={[{ t: "ولي" }, { t: "الأمر" }]} delay={at(5, 0, -2)} size={128} />
      <BigWords words={[{ t: "كل" }, { t: "شيء" }, { t: "على" }, { t: "جواله" }]} delay={at(5, 1)} size={66} weight={300} color={C.desert} />
    </div>
    <ParentFlow appearAt={at(5, 0, 2)} notifAt={at(5, 1, 6)} approveAt={at(5, 2)} pay1At={at(5, 3)} pay2At={at(5, 4)} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------ 6 the result */
export const C6: React.FC = () => {
  const s1 = usePop(at(6, 1, -4), 12);
  const s2 = usePop(at(6, 3, -4), 12);
  return (
    <AbsoluteFill>
      <Backdrop variant="deep" warm={0.22} ring={false} />
      <Rays cx={540} cy={960} size={2100} opacity={0.5} />
      <div style={abs(250, { gap: 0 })}>
        <BigWords words={[{ t: "أما" }, { t: "النتيجة" }]} delay={at(6, 0, -2)} size={96} weight={300} />
      </div>
      <RingProgress cx={540} cy={780} r={250} start={at(6, 1)} dur={30} thickness={22} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 620, display: "flex", flexDirection: "column", alignItems: "center", scale: 0.8 + Math.max(0, s1) * 0.2, opacity: Math.min(1, s1 * 1.5) }}>
        <CountUp from={0} to={100} start={at(6, 1)} dur={30} size={210} suffix="%" />
      </div>
      <div style={abs(1000, { gap: 0, scale: 0.8 + Math.max(0, s1) * 0.2, opacity: Math.min(1, s1 * 1.5) })}>
        <div style={{ fontFamily: FONT, direction: "rtl", fontSize: 84, fontWeight: 800, color: C.white }}>حوكمة رقمية</div>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 1230, height: 330, scale: 0.8 + Math.max(0, s2) * 0.2, opacity: Math.min(1, s2 * 1.5) }}>
        <Glass style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.14)" }}>
          <div style={{ fontFamily: FONT, direction: "rtl", fontSize: 50, fontWeight: 300, color: C.white }}>أرباح إضافية تتجاوز</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18, direction: "rtl" }}>
            <CountUp from={0} to={100} start={at(6, 3)} dur={26} size={170} color={C.desert} />
            <div style={{ fontFamily: FONT, fontSize: 64, fontWeight: 700, color: C.white }}>ألف ريال</div>
          </div>
        </Glass>
      </div>
      <Burst at={at(6, 3, 26)} x={540} y={1400} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ 7 global experience */
const POL = [
  { src: "sports", x: 330, y: 700, r: -9, k: 2 },
  { src: "science", x: 760, y: 780, r: 7, k: 2 },
  { src: "art", x: 360, y: 1130, r: 6, k: 3 },
  { src: "fun", x: 740, y: 1190, r: -7, k: 3 },
];
export const C7: React.FC = () => {
  const a = usePop(at(7, 2, -2), 12);
  const b = usePop(at(7, 3, -2), 12);
  const world = usePop(at(7, 6, -4), 11);
  return (
    <AbsoluteFill style={{ backgroundColor: C.seaDark }}>
      <Backdrop variant="deep" ring={false} />
      <div style={abs(250, { gap: 2 })}>
        <BigWords words={[{ t: "شراكات" }, { t: "استراتيجية" }]} delay={at(7, 0, -2)} size={86} />
        <BigWords words={[{ t: "مع" }, { t: "وجهات" }, { t: "عملاقة" }]} delay={at(7, 1)} size={62} weight={300} color={C.desert} />
      </div>
      {POL.map((p, i) => (
        <Polaroid key={i} {...p} delay={at(7, p.k, i * 5 - 4)} />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1440, display: "flex", justifyContent: "center", gap: 22 }}>
        <div style={{ scale: 0.5 + Math.max(0, a) * 0.5, opacity: Math.min(1, a * 1.5) }}>
          <Pill bg={C.white} color={C.seaDark} size={54} weight={900}>
            القدية
          </Pill>
        </div>
        <div style={{ scale: 0.5 + Math.max(0, b) * 0.5, opacity: Math.min(1, b * 1.5) }}>
          <Pill bg={C.desert} color={C.white} size={54} weight={900}>
            أكواريبيا
          </Pill>
        </div>
      </div>
      <div style={abs(1530, { gap: 0, scale: 0.7 + Math.max(0, world) * 0.3, opacity: Math.min(1, world * 1.5) })}>
        <div style={{ fontFamily: FONT, direction: "rtl", fontSize: 76, fontWeight: 900, color: C.white }}>
          تجربة <span style={{ color: C.desert }}>عالمية</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
const Polaroid: React.FC<{ readonly src: string; readonly x: number; readonly y: number; readonly r: number; readonly delay: number }> = ({ src, x, y, r, delay }) => {
  const f = useFrame();
  const p = usePop(delay, 10);
  const k = Math.min(1, p);
  return (
    <div style={{ position: "absolute", left: x - 190, top: y - 230 + (1 - k) * -700 + Math.sin(f / 18 + x) * 6, width: 380, height: 470, backgroundColor: C.white, padding: "22px 22px 80px", borderRadius: 14, rotate: `${r * k + (1 - k) * 30}deg`, scale: Math.max(0.2, p), opacity: Math.min(1, p * 1.6), boxShadow: "0 30px 60px rgba(5,25,60,0.55)" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: 6 }}>
        <Pic src={photo(src)} total={400} from={1.0} to={1.18} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ 8 memories */
const SLIDES = ["fun", "art", "science", "sports", "riyadh"];
export const C8: React.FC = () => {
  const f = useFrame();
  const idx = SLIDES.map((_, i) => (i === 0 ? 1 : interpolate(f, [at(8, i, -6), at(8, i, 6)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })));
  const logo = usePop(at(8, 1, 4), 12);
  const mem = usePop(at(8, 3, -2), 11);
  return (
    <AbsoluteFill style={{ backgroundColor: C.seaDark }}>
      {SLIDES.map((s, i) => (
        <div key={s} style={{ position: "absolute", inset: 0, opacity: idx[i], scale: 1 + (1 - idx[i]) * 0.06 }}>
          <Pic src={photo(s)} total={sceneDur(8)} from={1.02} to={1.2} position={`${40 + i * 8}% 50%`} />
        </div>
      ))}
      <AbsoluteFill style={grade(0.7, 0.35, 0.92)} />
      <div style={abs(300, { gap: 4 })}>
        <BigWords words={[{ t: "اترك" }, { t: "التنظيم" }, { t: "والتشغيل" }]} delay={at(8, 0)} size={84} weight={300} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", scale: 0.6 + Math.max(0, logo) * 0.4, opacity: Math.min(1, logo) }}>
        <Glass style={{ padding: "26px 60px", borderRadius: 120, backgroundColor: "rgba(255,255,255,0.22)" }}>
          <LogoWhite width={380} />
        </Glass>
      </div>
      <div style={abs(1000, { gap: 4 })}>
        <BigWords words={[{ t: "وركز" }, { t: "على" }, { t: "المهم" }]} delay={at(8, 2)} size={72} weight={300} />
      </div>
      <div style={abs(1200, { gap: 0, scale: 0.8 + Math.max(0, mem) * 0.2 })}>
        <BigWords words={[{ t: "صناعة" }, { t: "ذكريات" }]} delay={at(8, 3, -4)} size={130} />
        <BigWords words={[{ t: "جميلة" }]} delay={at(8, 3, 6)} size={190} color={C.desert} />
        <BigWords words={[{ t: "لطلابك" }]} delay={at(8, 4)} size={72} weight={300} />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ 9 call to action */
export const C9: React.FC = () => {
  const f = useFrame();
  const logo = usePop(at(9, 1, -2), 12);
  const ring = usePop(2, 16);
  return (
    <AbsoluteFill style={{ backgroundColor: C.white }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F1F6FC 100%)" }} />
      <div style={{ position: "absolute", left: -310, top: 120, width: 1700, height: 1700, opacity: 0.17 * Math.min(1, ring), rotate: `${f * 0.4}deg`, scale: 0.85 + Math.max(0, ring) * 0.15 }}>
        <Img src={staticFile("patterns/primary-ring-color.svg")} style={{ width: "100%", height: "100%" }} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.85) 46%, rgba(255,255,255,0) 80%)" }} />
      <div style={abs(290, { gap: 0 })}>
        <BigWords words={[{ t: "وخلي" }, { t: "مدرستك" }]} delay={at(9, 2, -2)} size={96} weight={500} color={C.seaDark} />
        <BigWords words={[{ t: "تتصدر" }]} delay={at(9, 3, -4)} size={220} color={C.desert} />
        <div style={{ marginLeft: -30, marginTop: -6 }}>
          <Swoosh at={at(9, 3, 6)} width={440} color={C.sea} thickness={12} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center", scale: 0.55 + Math.max(0, logo) * 0.45, opacity: Math.min(1, logo) }}>
        <div style={{ position: "relative" }}>
          <LogoColor width={520} />
          <Sweep at={at(9, 1, 12)} dur={28} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1180, display: "flex", justifyContent: "center" }}>
        <PressButton label="احجز جلستك" delay={at(9, 0, 0)} pressAt={at(9, 1, 18)} width={620} height={150} size={62} />
      </div>
      <div style={abs(1400, { gap: 0 })}>
        <BigWords words={[{ t: "الجلسة" }, { t: "التعريفية" }, { t: "اليوم" }]} delay={at(9, 1, 4)} size={56} weight={300} color={C.seaDark} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1540, display: "flex", justifyContent: "center" }}>
        <div style={{ direction: "ltr", fontFamily: FONT, fontWeight: 500, fontSize: 52, letterSpacing: 2, color: C.sea }}>guestna-edu.com</div>
      </div>
    </AbsoluteFill>
  );
};
