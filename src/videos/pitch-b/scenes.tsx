import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import { C, EASE, FONT } from "../../brand";
import { useFrame } from "../../clock";
import { Burst, clamp, Disc, Pic, Pill, Sweep, Swoosh, usePop } from "../../kit";
import { Backdrop, BigWords, Check, CountUp, Glass, LogoColor, LogoWhite, PressButton, Rays, RingProgress } from "../../pitch/ui";
import { at } from "./tt";

const abs = (top: number, extra?: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left: 90, right: 90, top, display: "flex", flexDirection: "column", alignItems: "center", ...extra });
const Pop: React.FC<{ readonly delay: number; readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({ delay, children, style }) => {
  const p = usePop(delay, 12);
  return <div style={{ scale: 0.4 + Math.max(0, p) * 0.6, opacity: Math.min(1, p * 1.4), ...style }}>{children}</div>;
};

/* ------------------------------------------------------------ 1 the question */
export const B1: React.FC = () => {
  const f = useFrame();
  const drop = interpolate(f, [at(1, 2, -2), at(1, 2, 14)], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const shake = Math.sin(f * 2.2) * 5 * interpolate(f, [at(1, 2), at(1, 2, 30)], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <Backdrop variant="deep" warm={0.14} ring={false} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 1500, lineHeight: 1, color: C.desert, opacity: 0.1, rotate: `${-8 + Math.sin(f / 60) * 3}deg`, scale: 0.9 + Math.sin(f / 80) * 0.03 }}>؟</div>
      <div style={abs(340, { gap: 0 })}>
        <BigWords words={[{ t: "كم" }, { t: "رحلة" }]} delay={at(1, 0, 2)} size={210} />
        <BigWords words={[{ t: "ونشاط" }, { t: "مدرسي" }]} delay={at(1, 0, 8)} size={92} weight={300} />
      </div>
      <div style={abs(880, { gap: 4, translate: `0px ${drop * 260}px`, rotate: `${drop * 7}deg`, opacity: 1 - drop })}>
        <BigWords words={[{ t: "تضيع" }]} delay={at(1, 1, 2)} size={170} color={C.desert} />
        <BigWords words={[{ t: "تغطيتها" }]} delay={at(1, 1, 8)} size={88} weight={300} />
      </div>
      <div style={abs(900, { translate: `${shake}px 0px` })}>
        <BigWords words={[{ t: "تتعطل" }]} delay={at(1, 2)} size={190} color="#FFD3A1" />
      </div>
      <div style={{ position: "absolute", left: 130, right: 130, top: 1330, display: "flex", justifyContent: "center", gap: 26 }}>
        <Pop delay={at(1, 3, 2)}>
          <Glass style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 34px 16px 22px", borderRadius: 60, direction: "rtl", fontFamily: FONT }}>
            <Disc icon="shopping" size={74} />
            <div style={{ fontSize: 44, fontWeight: 700, color: C.white }}>الجمع</div>
          </Glass>
        </Pop>
        <Pop delay={at(1, 3, 10)}>
          <Glass style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 34px 16px 22px", borderRadius: 60, direction: "rtl", fontFamily: FONT }}>
            <Disc icon="ticket" size={74} />
            <div style={{ fontSize: 44, fontWeight: 700, color: C.white }}>التحصيل</div>
          </Glass>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ 2 your time */
const Clock: React.FC<{ readonly cx: number; readonly cy: number; readonly r: number; readonly delay: number }> = ({ cx, cy, r, delay }) => {
  const f = useFrame();
  const p = usePop(delay, 12);
  const mins = f * 13;
  const hrs = f * 1.1;
  return (
    <div style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, scale: Math.max(0, p), opacity: Math.min(1, p * 1.5) }}>
      <svg width={r * 2} height={r * 2} viewBox="-100 -100 200 200">
        <circle r={96} fill="rgba(255,255,255,0.08)" stroke={C.desert} strokeWidth={5} />
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={0} y1={-84} x2={0} y2={i % 3 === 0 ? -68 : -76} stroke={C.white} strokeWidth={i % 3 === 0 ? 5 : 3} strokeLinecap="round" transform={`rotate(${i * 30})`} />
        ))}
        <line x1={0} y1={6} x2={0} y2={-52} stroke={C.white} strokeWidth={7} strokeLinecap="round" transform={`rotate(${hrs})`} />
        <line x1={0} y1={10} x2={0} y2={-72} stroke={C.desert} strokeWidth={5} strokeLinecap="round" transform={`rotate(${mins})`} />
        <circle r={8} fill={C.desert} />
      </svg>
    </div>
  );
};

const Struck: React.FC<{ readonly y: number; readonly icon: string; readonly label: string; readonly delay: number; readonly strikeAt: number }> = ({ y, icon, label, delay, strikeAt }) => {
  const f = useFrame();
  const p = usePop(delay, 12);
  const s = interpolate(f, [strikeAt, strikeAt + 12], [0, 1], { ...clamp, easing: EASE });
  return (
    <div style={{ position: "absolute", left: 130, right: 130, top: y, height: 112, scale: 0.85 + Math.max(0, p) * 0.15, opacity: Math.min(1, p * 1.5) * (1 - s * 0.35), translate: `${(1 - Math.min(1, p)) * 110}px 0px` }}>
      <Glass style={{ height: "100%", borderRadius: 56, display: "flex", alignItems: "center", gap: 24, padding: "0 24px", direction: "rtl", fontFamily: FONT, position: "relative" }}>
        <Disc icon={icon} size={74} />
        <div style={{ fontSize: 50, fontWeight: 600, color: C.white }}>{label}</div>
        <div style={{ position: "absolute", right: 20, left: 20, top: "50%", height: 8, borderRadius: 4, backgroundColor: C.desert, transformOrigin: "right", scale: `${s} 1` }} />
      </Glass>
    </div>
  );
};

export const B2: React.FC = () => (
  <AbsoluteFill>
    <Backdrop variant="deep" />
    <div style={abs(250, { gap: 0 })}>
      <BigWords words={[{ t: "وقتك" }]} delay={at(2, 1, -2)} size={250} />
      <BigWords words={[{ t: "أثمن" }]} delay={at(2, 1, 6)} size={150} weight={300} color={C.desert} />
    </div>
    <Clock cx={540} cy={1000} r={210} delay={at(2, 1, 4)} />
    <Struck y={1330} icon="ticket" label="موافقات ورقية" delay={at(2, 2, 0)} strikeAt={at(2, 2, 40)} />
    <Struck y={1460} icon="shopping" label="حسابات يدوية" delay={at(2, 3, -4)} strikeAt={at(2, 3, 26)} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------ 3 new era */
export const B3: React.FC = () => {
  const logo = usePop(at(3, 0, -2), 12);
  const glow = usePop(at(3, 0, -6), 16);
  return (
    <AbsoluteFill>
      <Backdrop variant="sea" ring={false} />
      <Rays cx={540} cy={800} size={2000} opacity={Math.min(0.8, glow)} />
      <div style={{ position: "absolute", left: 340, top: 560, width: 400, height: 400, borderRadius: 200, background: "radial-gradient(circle, rgba(255,255,255,0.35), rgba(255,255,255,0) 70%)", scale: 0.4 + Math.max(0, glow) * 1.4 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", scale: 0.55 + Math.max(0, logo) * 0.45, opacity: Math.min(1, logo) }}>
        <LogoWhite width={460} />
      </div>
      <div style={abs(660, { gap: 0 })}>
        <BigWords words={[{ t: "عهد" }, { t: "جديد" }]} delay={at(3, 2, -4)} size={230} />
        <div style={{ marginLeft: -30, marginTop: -6 }}>
          <Swoosh at={at(3, 2, 8)} width={480} color={C.desert} thickness={13} />
        </div>
      </div>
      <div style={abs(1150, { gap: 4 })}>
        <BigWords words={[{ t: "نقلنا" }, { t: "إدارة" }, { t: "الأنشطة" }]} delay={at(3, 1)} size={68} weight={300} />
        <BigWords words={[{ t: "والرحلات" }, { t: "المدرسية" }]} delay={at(3, 1, 8)} size={68} weight={700} />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ 4 marketplace */
const CARDS = [
  { icon: "celebration", title: "رحلة ترفيهية", tag: "ترفيهية" },
  { icon: "science", title: "رحلة علمية", tag: "محلية" },
  { icon: "hot-air-balloon", title: "رحلة دولية", tag: "دولية" },
];
export const B4: React.FC = () => {
  const f = useFrame();
  const t1 = interpolate(f, [at(4, 3, -4), at(4, 3, 8)], [0, 1], { ...clamp, easing: EASE });
  const t2 = interpolate(f, [at(4, 4, -4), at(4, 4, 8)], [0, 1], { ...clamp, easing: EASE });
  const idx = t1 + t2;
  const calc = interpolate(f, [at(4, 5, -6), at(4, 5, 6)], [0, 1], { ...clamp, easing: EASE });
  const bar1 = interpolate(f, [at(4, 6, 0), at(4, 6, 22)], [0, 1], { ...clamp, easing: EASE });
  const bar2 = interpolate(f, [at(4, 6, 8), at(4, 6, 34)], [0, 1], { ...clamp, easing: EASE });
  const tabs = ["محلية", "ترفيهية", "دولية"];
  const ti = Math.round(idx);
  return (
    <AbsoluteFill>
      <Backdrop variant="deep" />
      <div style={abs(250, { gap: 4 })}>
        <BigWords words={[{ t: "سوق" }, { t: "رقمي" }, { t: "متكامل" }]} delay={at(4, 0, -2)} size={100} />
        <BigWords words={[{ t: "يخلي" }, { t: "رائد" }, { t: "النشاط" }, { t: "يختار" }]} delay={at(4, 1)} size={62} weight={300} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 600, height: 96, borderRadius: 48, backgroundColor: "rgba(255,255,255,0.12)", display: "flex", direction: "rtl", alignItems: "center", opacity: 1 - calc }}>
        <div style={{ position: "absolute", top: 8, bottom: 8, right: 8 + idx * 280, width: 276, borderRadius: 40, backgroundColor: C.desert }} />
        {tabs.map((t, i) => (
          <div key={t} style={{ flex: 1, textAlign: "center", fontFamily: FONT, fontSize: 40, fontWeight: 700, zIndex: 1, color: C.white, opacity: i === ti ? 1 : 0.75 }}>
            {t}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, height: 640, opacity: 1 - calc, translate: `0px ${-calc * 60}px`, scale: 1 - calc * 0.08 }}>
        {CARDS.map((c, i) => (
          <TripCard key={i} i={i} idx={idx} {...c} delay={at(4, 1, 6 + i * 5)} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 640, height: 780, borderRadius: 60, backgroundColor: C.white, padding: "50px 56px", boxShadow: "0 40px 80px rgba(5,25,60,0.5)", opacity: calc, scale: 0.9 + calc * 0.1, translate: `0px ${(1 - calc) * 80}px`, direction: "rtl", fontFamily: FONT }}>
        <div style={{ fontSize: 52, fontWeight: 800, color: C.seaDark }}>التكلفة</div>
        <div style={{ height: 40, borderRadius: 20, backgroundColor: "#E4ECF6", marginTop: 22, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${bar1 * 62}%`, backgroundColor: C.sea, borderRadius: 20 }} />
        </div>
        <div style={{ fontSize: 52, fontWeight: 800, color: C.seaDark, marginTop: 56 }}>صافي أرباح المدرسة</div>
        <div style={{ height: 40, borderRadius: 20, backgroundColor: "#E4ECF6", marginTop: 22, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${bar2 * 86}%`, backgroundColor: C.desert, borderRadius: 20 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 52 }}>
          <PressButton label="بلمسة شاشة" delay={at(4, 7, -6)} pressAt={at(4, 7, 6)} width={520} height={130} size={56} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
const TripCard: React.FC<{ readonly i: number; readonly idx: number; readonly icon: string; readonly title: string; readonly tag: string; readonly delay: number }> = ({ i, idx, icon, title, tag, delay }) => {
  const p = usePop(delay, 12);
  const off = i - idx; // 0 = centred
  const active = Math.max(0, 1 - Math.abs(off));
  return (
    <div style={{ position: "absolute", left: 540 - 280 - off * 620, top: 40 + (1 - active) * 50, width: 560, height: 560, scale: (0.82 + active * 0.18) * Math.max(0, p), opacity: Math.min(1, p * 1.5) * (0.5 + active * 0.5), rotate: `${off * -4}deg`, direction: "rtl", fontFamily: FONT }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 60, backgroundColor: C.white, boxShadow: "0 36px 70px rgba(5,25,60,0.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
        <Disc icon={icon} size={220} bg="#D1DEED" />
        <div style={{ fontSize: 60, fontWeight: 800, color: C.seaDark }}>{title}</div>
        <div style={{ fontSize: 38, fontWeight: 600, color: C.white, backgroundColor: C.sea, padding: "8px 34px", borderRadius: 40 }}>{tag}</div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ 5 the parent */
export const B5: React.FC = () => {
  const f = useFrame();
  const sw = interpolate(f, [at(5, 3, 0), at(5, 3, 12)], [0, 1], { ...clamp, easing: EASE });
  const card = usePop(at(5, 2, -2), 12);
  const last = usePop(at(5, 4, 0), 11);
  return (
    <AbsoluteFill>
      <Backdrop variant="sea" />
      <div style={abs(250, { gap: 2 })}>
        <BigWords words={[{ t: "ولي" }, { t: "الأمر" }]} delay={at(5, 0, -2)} size={150} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center" }}>
        <PressButton label="موافقة" delay={at(5, 1, -4)} pressAt={at(5, 1, 14)} width={520} height={130} size={58} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 710, display: "flex", justifyContent: "center" }}>
        <Check size={110} delay={at(5, 1, 22)} />
      </div>
      <div style={{ position: "absolute", left: 140, right: 140, top: 880, height: 360, scale: 0.8 + Math.max(0, card) * 0.2, opacity: Math.min(1, card * 1.4) }}>
        <div style={{ position: "relative", height: "100%", borderRadius: 60, backgroundColor: C.white, boxShadow: "0 36px 70px rgba(5,25,60,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile("pay/apple-pay.svg")} style={{ position: "absolute", width: 260, opacity: 1 - sw, scale: 1 - sw * 0.2 }} />
          <Img src={staticFile("pay/tamara.svg")} style={{ position: "absolute", width: 420, opacity: sw, scale: 0.8 + sw * 0.2 }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, display: "flex", justifyContent: "center", gap: 18, fontFamily: FONT, direction: "rtl" }}>
        <Pill bg={sw < 0.5 ? C.desert : "rgba(255,255,255,0.18)"} color={C.white} size={44} weight={700}>
          دفع بسهولة
        </Pill>
        <Pill bg={sw >= 0.5 ? C.desert : "rgba(255,255,255,0.18)"} color={C.white} size={44} weight={700}>
          أقساط مؤتمتة
        </Pill>
      </div>
      <div style={abs(1440, { scale: 0.7 + Math.max(0, last) * 0.3, opacity: Math.min(1, last * 1.4) })}>
        <div style={{ fontFamily: FONT, direction: "rtl", fontSize: 92, fontWeight: 900, color: C.white }}>
          بدون <span style={{ color: C.desert }}>وجع راس</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ 6 result */
export const B6: React.FC = () => {
  const f = useFrame();
  const d1 = usePop(at(6, 1, 2), 12);
  const d2 = usePop(at(6, 2, 2), 12);
  const swapOut = interpolate(f, [at(6, 3, -4), at(6, 3, 6)], [1, 0], clamp);
  const num = usePop(at(6, 3, -2), 11);
  const chip1 = usePop(at(6, 1, 2), 12);
  const chip2 = usePop(at(6, 2, 2), 12);
  return (
    <AbsoluteFill>
      <Backdrop variant="deep" warm={0.2} ring={false} />
      <Rays cx={540} cy={900} size={2000} opacity={0.5} />
      <div style={abs(250, { gap: 0 })}>
        <BigWords words={[{ t: "والنتيجة" }]} delay={at(6, 0, -2)} size={92} weight={300} />
      </div>
      <RingProgress cx={540} cy={920} r={340} start={at(6, 3)} dur={34} />
      <div style={{ position: "absolute", left: 540 - 130, top: 920 - 130, scale: Math.max(0, d1) * (1 - Math.min(1, d2) * 0.3), opacity: swapOut * (1 - Math.min(1, d2)) }}>
        <Disc icon="safety" size={260} />
      </div>
      <div style={{ position: "absolute", left: 540 - 130, top: 920 - 130, scale: Math.max(0, d2), opacity: swapOut * Math.min(1, d2) }}>
        <Disc icon="shopping" size={260} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 740, display: "flex", flexDirection: "column", alignItems: "center", scale: 0.8 + Math.max(0, num) * 0.2, opacity: Math.min(1, num * 1.5) }}>
        <CountUp from={0} to={100} start={at(6, 3)} dur={34} size={330} color={C.white} />
        <div style={{ fontFamily: FONT, fontSize: 92, fontWeight: 700, color: C.desert, direction: "rtl", marginTop: 8 }}>ألف ريال</div>
      </div>
      <div style={{ position: "absolute", left: 100, right: 100, top: 1390, display: "flex", justifyContent: "center", gap: 24 }}>
        <div style={{ scale: 0.5 + Math.max(0, chip1) * 0.5, opacity: Math.min(1, chip1 * 1.5) }}>
          <Glass style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 30px 14px 18px", borderRadius: 60, direction: "rtl", fontFamily: FONT }}>
            <Disc icon="safety" size={70} />
            <div style={{ fontSize: 42, fontWeight: 700, color: C.white }}>حوكمة كاملة</div>
          </Glass>
        </div>
        <div style={{ scale: 0.5 + Math.max(0, chip2) * 0.5, opacity: Math.min(1, chip2 * 1.5) }}>
          <Glass style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 30px 14px 18px", borderRadius: 60, direction: "rtl", fontFamily: FONT }}>
            <Disc icon="shopping" size={70} />
            <div style={{ fontSize: 42, fontWeight: 700, color: C.white }}>عوائد مالية</div>
          </Glass>
        </div>
      </div>
      <Burst at={at(6, 3, 34)} x={540} y={920} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ 7 students and partners */
const PHOTOS = ["sports", "science", "art", "fun"];
const PhotoCard: React.FC<{ readonly src: string; readonly delay: number; readonly r: number; readonly pos: string }> = ({ src, delay, r, pos }) => {
  const p = usePop(delay, 12);
  return (
    <div style={{ position: "relative", width: 420, height: 620, marginBottom: 30, borderRadius: 56, overflow: "hidden", scale: 0.8 + Math.max(0, p) * 0.2, opacity: Math.min(1, p * 1.5), boxShadow: "0 30px 60px rgba(5,25,60,0.5)" }}>
      <Pic src={`media/edu/ai/${src}.jpg`} total={320} from={1.0 + r * 0.05} to={1.2} position={pos} />
    </div>
  );
};

export const B7: React.FC = () => {
  const f = useFrame();
  const slide = interpolate(f, [0, 300], [0, 1], clamp);
  const a = usePop(at(7, 3, -2), 12);
  const b = usePop(at(7, 4, -2), 12);
  const col = (k: number) => ({ x: k === 0 ? 100 : 560, dir: k === 0 ? -1 : 1 });
  return (
    <AbsoluteFill style={{ backgroundColor: C.seaDark }}>
      <Backdrop variant="deep" ring={false} floaters={false} />
      {[0, 1].map((k) => (
        <div key={k} style={{ position: "absolute", left: col(k).x, top: 380 + col(k).dir * slide * 90 - (k === 0 ? 0 : -110), width: 420, height: 1500 }}>
          {[0, 1].map((r) => (
            <PhotoCard key={r} src={PHOTOS[(k * 2 + r) % 4]} delay={at(7, 1, k * 6 + r * 6)} r={r} pos={k === 0 ? "40% 50%" : "60% 50%"} />
          ))}
        </div>
      ))}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,45,90,0.95) 0%, rgba(10,45,90,0) 26%, rgba(10,45,90,0) 62%, rgba(10,45,90,0.96) 100%)" }} />
      <div style={abs(240, { gap: 2 })}>
        <BigWords words={[{ t: "تجارب" }, { t: "استثنائية" }]} delay={at(7, 1, -4)} size={104} />
        <BigWords words={[{ t: "مع" }, { t: "كبراء" }, { t: "شركائنا" }]} delay={at(7, 2)} size={64} weight={300} color={C.desert} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1480, display: "flex", justifyContent: "center", gap: 26 }}>
        <div style={{ scale: 0.5 + Math.max(0, a) * 0.5, opacity: Math.min(1, a * 1.5) }}>
          <Pill bg={C.white} color={C.seaDark} size={60} weight={900}>
            القدية
          </Pill>
        </div>
        <div style={{ scale: 0.5 + Math.max(0, b) * 0.5, opacity: Math.min(1, b * 1.5) }}>
          <Pill bg={C.desert} color={C.white} size={60} weight={900}>
            أكواريبيا
          </Pill>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ 8 your role */
export const B8: React.FC = () => {
  const f = useFrame();
  const merge = interpolate(f, [at(8, 3, 0), at(8, 3, 18)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const logo = usePop(at(8, 3, 6), 11);
  const rows = [
    { icon: "celebration", label: "التجربة", k: 1 },
    { icon: "bus", label: "التشغيل", k: 2 },
    { icon: "staff", label: "التنظيم", k: 2 },
  ];
  return (
    <AbsoluteFill>
      <Backdrop variant="sea" />
      <div style={abs(250, { gap: 0 })}>
        <BigWords words={[{ t: "دوركم" }]} delay={at(8, 0, -2)} size={190} />
        <BigWords words={[{ t: "تستمتعون" }, { t: "بالتجربة" }]} delay={at(8, 1, -2)} size={70} weight={300} />
      </div>
      {rows.map((r, i) => (
        <RoleRow key={r.label} y={760 + i * 170} {...r} i={i} merge={merge} delay={at(8, r.k, i === 2 ? 14 : 0)} />
      ))}
      <div style={{ position: "absolute", left: 540 - 270, top: 1330, width: 540, height: 190, scale: 0.6 + Math.max(0, logo) * 0.4, opacity: Math.min(1, logo * 1.5) }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 95, backgroundColor: C.white, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 ${merge * 16}px rgba(238,139,34,0.4), 0 30px 60px rgba(5,25,60,0.4)` }}>
          <LogoColor width={400} />
          <Sweep at={at(8, 3, 16)} radius={95} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
const RoleRow: React.FC<{ readonly y: number; readonly icon: string; readonly label: string; readonly delay: number; readonly i: number; readonly merge: number }> = ({ y, icon, label, delay, i, merge }) => {
  const p = usePop(delay, 12);
  const ty = (1330 + 95 - 85 - y) * merge;
  return (
    <div style={{ position: "absolute", left: 160, right: 160, top: y, height: 140, translate: `0px ${ty}px`, scale: (0.85 + Math.max(0, p) * 0.15) * (1 - merge * 0.5), opacity: Math.min(1, p * 1.5) * (1 - merge * merge), zIndex: 3 - i }}>
      <Glass style={{ height: "100%", borderRadius: 70, display: "flex", alignItems: "center", gap: 26, padding: "0 28px", direction: "rtl", fontFamily: FONT, backgroundColor: "rgba(255,255,255,0.2)" }}>
        <Disc icon={icon} size={96} />
        <div style={{ flex: 1, fontSize: 62, fontWeight: 800, color: C.white }}>{label}</div>
        <Check size={72} delay={delay + 8} />
      </Glass>
    </div>
  );
};

/* ------------------------------------------------------------ 9 call to action */
export const B9: React.FC = () => {
  const f = useFrame();
  const logo = usePop(at(9, 2, -4), 12);
  const url = usePop(at(9, 3, 16), 12);
  const ring = usePop(2, 16);
  return (
    <AbsoluteFill style={{ backgroundColor: C.white }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F1F6FC 100%)" }} />
      <div style={{ position: "absolute", left: -310, top: 120, width: 1700, height: 1700, opacity: 0.17 * Math.min(1, ring), rotate: `${f * 0.4}deg`, scale: 0.85 + Math.max(0, ring) * 0.15 }}>
        <Img src={staticFile("patterns/primary-ring-color.svg")} style={{ width: "100%", height: "100%" }} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.85) 46%, rgba(255,255,255,0) 80%)" }} />
      <div style={abs(280, { gap: 0 })}>
        <BigWords words={[{ t: "اشترك" }, { t: "معنا" }, { t: "اليوم" }]} delay={at(9, 0, -2)} size={84} weight={500} color={C.seaDark} />
        <BigWords words={[{ t: "مجاناً" }]} delay={at(9, 1, -4)} size={200} color={C.desert} />
      </div>
      <div style={abs(700, { gap: 0 })}>
        <BigWords words={[{ t: "مصدر" }, { t: "دخل" }]} delay={at(9, 3, -2)} size={118} color={C.sea} />
        <BigWords words={[{ t: "وراحة" }]} delay={at(9, 3, 8)} size={118} weight={300} color={C.seaDark} />
        <div style={{ marginLeft: -30 }}>
          <Swoosh at={at(9, 3, 16)} width={420} color={C.desert} thickness={12} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1130, display: "flex", justifyContent: "center", scale: 0.55 + Math.max(0, logo) * 0.45, opacity: Math.min(1, logo) }}>
        <div style={{ position: "relative" }}>
          <LogoColor width={520} />
          <Sweep at={at(9, 3, 10)} dur={28} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1450, display: "flex", justifyContent: "center", scale: 0.6 + Math.max(0, url) * 0.4, opacity: Math.min(1, url) }}>
        <div style={{ direction: "ltr", fontFamily: FONT, fontWeight: 500, fontSize: 54, letterSpacing: 2, color: C.sea }}>guestna-edu.com</div>
      </div>
    </AbsoluteFill>
  );
};
