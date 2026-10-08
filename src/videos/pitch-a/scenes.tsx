import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import { C, EASE, FONT } from "../../brand";
import { useFrame } from "../../clock";
import { Burst, clamp, Disc, Pic, Pill, Sweep, Swoosh, usePop } from "../../kit";
import { ParentFlow } from "../../pitch/flows";
import { Backdrop, BigWords, Check, CountUp, Glass, LogoColor, LogoWhite, Paper, Phone, PressButton, TripRow } from "../../pitch/ui";
import { at } from "./tt";

const abs = (top: number, extra?: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left: 90, right: 90, top, display: "flex", flexDirection: "column", alignItems: "center", ...extra });

/* ---------------------------------------------------------------- 1 greeting */
export const S1: React.FC = () => {
  const logo = usePop(2, 13);
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", scale: 0.6 + logo * 0.4, opacity: Math.min(1, logo) }}>
        <LogoWhite width={330} />
      </div>
      <div style={abs(520)}>
        <BigWords words={[{ t: "أهلاً" }]} delay={at(1, 0)} size={260} />
        <BigWords words={[{ t: "بحضرة" }, { t: "المدير" }]} delay={at(1, 1)} size={104} weight={300} stagger={5} />
      </div>
      <div style={abs(1090, { gap: 6 })}>
        <BigWords words={[{ t: "ويا" }, { t: "هلا" }, { t: "ومرحباً" }]} delay={at(1, 2)} size={78} weight={500} stagger={4} />
        <BigWords words={[{ t: "بملاك" }, { t: "المنشآت" }, { t: "التعليمية" }]} delay={at(1, 3)} size={78} weight={800} color={C.desert} stagger={4} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1420, display: "flex", justifyContent: "center", gap: 28 }}>
        {["learning", "teamwork", "science", "planetarium"].map((icon, i) => (
          <Pop key={icon} delay={at(1, 3, 6 + i * 3)}>
            <Disc icon={icon} size={112} />
          </Pop>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Pop: React.FC<{ readonly delay: number; readonly children: React.ReactNode }> = ({ delay, children }) => {
  const p = usePop(delay, 12);
  return <div style={{ scale: 0.4 + Math.max(0, p) * 0.6, opacity: Math.min(1, p * 1.4) }}>{children}</div>;
};

/* ---------------------------------------------------------------- 2 chaos */
const SHEETS = [
  { x: 300, y: 690, r: -14, from: { x: -200, y: 500 } },
  { x: 780, y: 670, r: 11, from: { x: 1300, y: 400 } },
  { x: 560, y: 850, r: -5, from: { x: 540, y: 2100 } },
  { x: 320, y: 960, r: 9, from: { x: -250, y: 1300 } },
  { x: 770, y: 940, r: -11, from: { x: 1330, y: 1250 } },
  { x: 540, y: 680, r: 17, from: { x: 540, y: -300 } },
  { x: 190, y: 820, r: -22, from: { x: -300, y: 900 } },
];

export const S2: React.FC = () => (
  <AbsoluteFill>
    <Backdrop variant="deep" warm={0.1} />
    <div style={abs(250, { gap: 2 })}>
      <BigWords words={[{ t: "إدارة" }, { t: "الرحلات" }]} delay={at(2, 1, -4)} size={112} />
      <BigWords words={[{ t: "والأنشطة" }, { t: "المدرسية" }]} delay={at(2, 1, 2)} size={84} weight={300} />
    </div>
    {SHEETS.map((s, i) => (
      <Paper key={i} x={s.x} y={s.y} rot={s.r} delay={at(2, 1, 4 + i * 4)} w={270} h={350} from={s.from} />
    ))}
    <div style={{ position: "absolute", left: 90, right: 90, top: 1190, display: "flex", justifyContent: "center" }}>
      <Pop delay={at(2, 2, 2)}>
        <div style={{ fontFamily: FONT, direction: "rtl", fontSize: 76, fontWeight: 900, color: C.desert, whiteSpace: "nowrap" }}>
          وقت ومجهود <span style={{ fontWeight: 300, color: C.white }}>غير عادي</span>
        </div>
      </Pop>
    </div>
    {[
      { icon: "ticket", label: "أوراق", k: 3 },
      { icon: "shopping", label: "تحصيل مالي", k: 4 },
      { icon: "safety", label: "متابعة ما تنتهي", k: 5 },
    ].map((c, i) => (
      <Chip key={c.label} y={1320 + i * 104} icon={c.icon} label={c.label} delay={at(2, c.k, -2)} />
    ))}
  </AbsoluteFill>
);

const Chip: React.FC<{ readonly y: number; readonly icon: string; readonly label: string; readonly delay: number }> = ({ y, icon, label, delay }) => {
  const p = usePop(delay, 12);
  return (
    <div style={{ position: "absolute", left: 160, right: 160, top: y, height: 90, scale: 0.8 + Math.max(0, p) * 0.2, opacity: Math.min(1, p * 1.5), translate: `${(1 - Math.min(1, p)) * 120}px 0px` }}>
      <Glass style={{ height: "100%", borderRadius: 48, display: "flex", alignItems: "center", gap: 22, padding: "0 20px", direction: "rtl", fontFamily: FONT }}>
        <Disc icon={icon} size={66} />
        <div style={{ fontSize: 46, fontWeight: 700, color: C.white }}>{label}</div>
      </Glass>
    </div>
  );
};

/* ---------------------------------------------------------------- 3 order */
export const S3: React.FC = () => {
  const f = useFrame();
  const collapse = interpolate(f, [at(3, 1), at(3, 1, 20)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const card = usePop(at(3, 2, 2), 12);
  const rows = [0, 1, 2, 3];
  return (
    <AbsoluteFill>
      <Backdrop variant="sea" />
      <div style={abs(250)}>
        <BigWords words={[{ t: "حوكمة" }, { t: "كاملة" }]} delay={at(3, 2, -2)} size={132} />
      </div>
      {SHEETS.map((s, i) => (
        <div key={i} style={{ opacity: 1 - interpolate(collapse, [0.8, 1], [0, 1], clamp) }}>
          <Paper x={s.x + (540 - s.x) * collapse} y={s.y + (880 - s.y) * collapse} rot={s.r * (1 - collapse)} delay={0} w={270} h={350} calm={collapse} />
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 170,
          right: 170,
          top: 560,
          height: 640,
          borderRadius: 60,
          backgroundColor: C.white,
          padding: "46px 48px",
          boxShadow: "0 36px 70px rgba(5,25,60,0.45)",
          scale: 0.7 + Math.max(0, card) * 0.3,
          opacity: Math.min(1, card * 1.4),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, direction: "rtl", height: 96 }}>
          <Disc icon="safety" size={96} bg="#D1DEED" />
          <div style={{ height: 30, width: 260, borderRadius: 15, backgroundColor: C.seaDark }} />
        </div>
        {rows.map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, direction: "rtl", height: 104 }}>
            <Check size={64} delay={at(3, 3, 8 + i * 5)} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 22, borderRadius: 11, backgroundColor: "#D1DEED", width: `${[78, 62, 86, 54][i]}%` }} />
              <div style={{ height: 14, borderRadius: 7, backgroundColor: "#E8EEF6", width: `${[48, 40, 52, 34][i]}%`, marginTop: 12 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1330, display: "flex", justifyContent: "center" }}>
        <PressButton label="بضغطة زر" delay={at(3, 3, -6)} pressAt={at(3, 3, 6)} width={560} height={150} size={64} />
      </div>
      <Burst at={at(3, 3, 8)} x={540} y={1400} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- 4 revenue */
export const S4: React.FC = () => {
  const f = useFrame();
  const heights = [0.2, 0.32, 0.28, 0.45, 0.58, 0.72, 1];
  const num = usePop(at(4, 2, -4), 11);
  return (
    <AbsoluteFill>
      <Backdrop variant="deep" warm={0.22} />
      <div style={{ position: "absolute", left: 110, right: 110, top: 760, height: 700, display: "flex", alignItems: "flex-end", justifyContent: "space-between", direction: "ltr" }}>
        {heights.map((h, i) => {
          const g = interpolate(f, [at(4, 0, i * 3), at(4, 0, i * 3 + 16)], [0, 1], { ...clamp, easing: EASE });
          return <div key={i} style={{ width: 96, height: 700 * h * g, borderRadius: 24, background: `linear-gradient(180deg, ${C.desert}, rgba(238,139,34,0.25))`, opacity: 0.42 }} />;
        })}
      </div>
      <div style={abs(260, { gap: 4 })}>
        <BigWords words={[{ t: "وفوقها" }, { t: "تحقق" }, { t: "لمدرستك" }]} delay={at(4, 0)} size={78} weight={300} />
        <BigWords words={[{ t: "عوائد" }, { t: "مالية" }]} delay={at(4, 1)} size={150} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", flexDirection: "column", alignItems: "center", scale: 0.8 + Math.max(0, num) * 0.2, opacity: Math.min(1, num * 1.5) }}>
        <CountUp from={0} to={100} start={at(4, 2)} dur={26} size={440} color={C.desert} />
        <div style={{ fontFamily: FONT, fontSize: 118, fontWeight: 700, color: C.white, direction: "rtl", marginTop: 6 }}>ألف ريال</div>
      </div>
      <Burst at={at(4, 2, 26)} x={540} y={900} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- 5 platform */
const TILES = ["bus", "ticket", "hiking", "camping", "science", "swimming"];
export const S5: React.FC = () => {
  const logo = usePop(at(5, 0, -2), 12);
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center", scale: 0.6 + Math.max(0, logo) * 0.4, opacity: Math.min(1, logo) }}>
        <LogoWhite width={440} />
      </div>
      <div style={abs(520)}>
        <BigWords words={[{ t: "سوقك" }, { t: "الرقمي" }, { t: "الشامل" }]} delay={at(5, 1)} size={100} />
      </div>
      <div style={{ position: "absolute", left: 105, top: 790, width: 870, display: "flex", flexWrap: "wrap", gap: 30, direction: "rtl" }}>
        {TILES.map((icon, i) => (
          <Tile key={icon} icon={icon} delay={at(5, 1, 4 + i * 4)} />
        ))}
      </div>
      <div style={abs(1450)}>
        <BigWords words={[{ t: "للأنشطة" }, { t: "والرحلات" }, { t: "المدرسية" }]} delay={at(5, 2)} size={72} weight={300} />
      </div>
    </AbsoluteFill>
  );
};
const Tile: React.FC<{ readonly icon: string; readonly delay: number }> = ({ icon, delay }) => {
  const p = usePop(delay, 12);
  return (
    <div style={{ width: 270, height: 270, scale: 0.5 + Math.max(0, p) * 0.5, opacity: Math.min(1, p * 1.5) }}>
      <Glass style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Disc icon={icon} size={170} />
      </Glass>
    </div>
  );
};

/* ---------------------------------------------------------------- 6 activity leader */
export const S6: React.FC = () => {
  const f = useFrame();
  const phone = usePop(at(6, 0, 2), 13);
  const tab = interpolate(f, [at(6, 3), at(6, 3, 10)], [0, 1], { ...clamp, easing: EASE });
  const calc = usePop(at(6, 4, 2), 12);
  const bar1 = interpolate(f, [at(6, 5), at(6, 5, 18)], [0, 1], { ...clamp, easing: EASE });
  const bar2 = interpolate(f, [at(6, 5, 6), at(6, 5, 26)], [0, 1], { ...clamp, easing: EASE });
  const tabX = 5 + tab * 300;
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={abs(250, { gap: 4 })}>
        <BigWords words={[{ t: "بضغطة" }, { t: "زر" }]} delay={at(6, 1, -4)} size={128} />
        <BigWords words={[{ t: "يختار" }, { t: "أفضل" }, { t: "الرحلات" }]} delay={at(6, 2, -4)} size={70} weight={300} />
      </div>
      <div style={{ position: "absolute", left: 270, top: 495, width: 540, height: 1090, scale: 0.84 * (0.7 + Math.max(0, phone) * 0.3), opacity: Math.min(1, phone * 1.5) }}>
        <Phone>
          <div style={{ position: "absolute", top: 82, left: 0, right: 0, textAlign: "center", fontSize: 44, fontWeight: 800, color: C.seaDark }}>الرحلات</div>
          <div style={{ position: "absolute", top: 156, left: 30, right: 30, height: 78, borderRadius: 39, backgroundColor: "#E4ECF6", display: "flex", direction: "rtl", alignItems: "center" }}>
            <div style={{ position: "absolute", top: 8, bottom: 8, right: tabX, width: 142, borderRadius: 31, backgroundColor: C.desert }} />
            {["محلية", "ترفيهية", "دولية"].map((t, i) => (
              <div key={t} style={{ flex: 1, textAlign: "center", fontSize: 32, fontWeight: 700, zIndex: 1, color: (i === 0 && tab < 0.5) || (i === 2 && tab >= 0.5) ? C.white : C.seaDark }}>
                {t}
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", top: 262, left: 28, right: 28, display: "flex", flexDirection: "column", gap: 20 }}>
            <TripRow icon="celebration" title="رحلة ترفيهية" tag="محلية" delay={at(6, 2)} />
            <TripRow icon="science" title="رحلة علمية" tag="محلية" delay={at(6, 2, 5)} selected selectAt={at(6, 1, 4)} />
            <TripRow icon="hot-air-balloon" title="رحلة دولية" tag="دولية" delay={at(6, 2, 10)} />
          </div>
          <div style={{ position: "absolute", left: 22, right: 22, bottom: 24, height: 370, borderRadius: 46, backgroundColor: C.white, boxShadow: "0 -18px 50px rgba(18,66,124,0.25)", padding: "34px 36px", translate: `0px ${(1 - Math.min(1, calc)) * 420}px` }}>
            <div style={{ fontSize: 34, fontWeight: 700, color: C.seaDark }}>التكلفة</div>
            <div style={{ height: 30, borderRadius: 15, backgroundColor: "#E4ECF6", marginTop: 14, overflow: "hidden", direction: "rtl" }}>
              <div style={{ height: "100%", width: `${bar1 * 62}%`, borderRadius: 15, backgroundColor: C.sea }} />
            </div>
            <div style={{ fontSize: 34, fontWeight: 700, color: C.seaDark, marginTop: 34 }}>أرباح المدرسة</div>
            <div style={{ height: 30, borderRadius: 15, backgroundColor: "#E4ECF6", marginTop: 14, overflow: "hidden", direction: "rtl" }}>
              <div style={{ height: "100%", width: `${bar2 * 84}%`, borderRadius: 15, backgroundColor: C.desert }} />
            </div>
            <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 14, direction: "rtl" }}>
              <Check size={50} delay={at(6, 5, 20)} />
              <div style={{ fontSize: 30, fontWeight: 500, color: C.sea }}>حساب تلقائي</div>
            </div>
          </div>
        </Phone>
      </div>
      <SideChip x={80} y={800} icon="celebration" label="ترفيهية" delay={at(6, 2, 6)} />
      <SideChip x={790} y={1180} icon="hot-air-balloon" label="دولية" delay={at(6, 3, 2)} />
    </AbsoluteFill>
  );
};
const SideChip: React.FC<{ readonly x: number; readonly y: number; readonly icon: string; readonly label: string; readonly delay: number }> = ({ x, y, icon, label, delay }) => {
  const f = useFrame();
  const p = usePop(delay, 12);
  return (
    <div style={{ position: "absolute", left: x, top: y + Math.sin(f / 14 + x) * 8, width: 210, scale: 0.5 + Math.max(0, p) * 0.5, opacity: Math.min(1, p * 1.5) }}>
      <Glass style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "20px 0 22px", borderRadius: 44, direction: "rtl", fontFamily: FONT }}>
        <Disc icon={icon} size={104} />
        <div style={{ fontSize: 40, fontWeight: 700, color: C.white }}>{label}</div>
      </Glass>
    </div>
  );
};

/* ---------------------------------------------------------------- 7 parent */
export const S7: React.FC = () => (
  <AbsoluteFill>
    <Backdrop variant="deep" />
    <div style={abs(250, { gap: 4 })}>
      <BigWords words={[{ t: "ولي" }, { t: "الأمر" }]} delay={at(7, 0, -2)} size={128} />
      <BigWords words={[{ t: "أسهل" }, { t: "بكثير" }]} delay={at(7, 1)} size={84} weight={300} color={C.desert} />
    </div>
    <ParentFlow appearAt={at(7, 0, 2)} notifAt={at(7, 2, -2)} approveAt={at(7, 3)} pay1At={at(7, 4)} pay2At={at(7, 5)} />
  </AbsoluteFill>
);

/* ---------------------------------------------------------------- 8 partners */
export const S8: React.FC = () => {
  const f = useFrame();
  const hub = usePop(at(8, 0, 4), 12);
  const l1 = interpolate(f, [at(8, 3, -8), at(8, 3, 10)], [0, 1], { ...clamp, easing: EASE });
  const l2 = interpolate(f, [at(8, 4, -8), at(8, 4, 10)], [0, 1], { ...clamp, easing: EASE });
  const l3 = interpolate(f, [at(8, 5, -8), at(8, 5, 10)], [0, 1], { ...clamp, easing: EASE });
  const hubY = 1440;
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={abs(250, { gap: 4 })}>
        <BigWords words={[{ t: "أضخم" }, { t: "الوجهات" }]} delay={at(8, 1, -4)} size={126} />
        <BigWords words={[{ t: "وشركاء" }, { t: "النجاح" }]} delay={at(8, 2)} size={72} weight={300} color={C.desert} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={`M540 ${hubY - 70} C 540 1250, 300 1250, 300 1060`} stroke={C.desert} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - l1} />
        <path d={`M540 ${hubY - 70} C 540 1250, 780 1250, 780 1060`} stroke={C.desert} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - l2} />
        <path d={`M540 ${hubY - 70} C 540 1050, 540 900, 540 730`} stroke="rgba(255,255,255,0.5)" strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray="2 22" pathLength={1} opacity={l3} />
      </svg>
      <DestCard x={310} y={880} name="القدية" icon="celebration" delay={at(8, 3, 0)} />
      <DestCard x={770} y={880} name="أكواريبيا" icon="swimming" delay={at(8, 4, -2)} />
      <DestCard x={540} y={560} name="وغيرها" icon="hot-air-balloon" delay={at(8, 5, -2)} small />
      {[0, 34, 68].map((o) => (
        <HubPulse key={o} start={at(8, 0, 6)} offset={o} cx={540} cy={hubY} />
      ))}
      <div style={{ position: "absolute", left: 540 - 190, top: hubY - 70, width: 380, height: 140, scale: 0.6 + Math.max(0, hub) * 0.4, opacity: Math.min(1, hub * 1.5) }}>
        <Glass style={{ height: "100%", borderRadius: 70, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.22)" }}>
          <LogoWhite width={260} />
        </Glass>
      </div>
    </AbsoluteFill>
  );
};
const HubPulse: React.FC<{ readonly start: number; readonly offset: number; readonly cx: number; readonly cy: number }> = ({ start, offset, cx, cy }) => {
  const f = useFrame();
  const t = ((f - start + offset) % 102) / 102;
  return <div style={{ position: "absolute", left: cx - 190, top: cy - 70, width: 380, height: 140, borderRadius: 70, border: "4px solid rgba(255,255,255,0.7)", scale: 1 + t * 2.1, opacity: f >= start ? (1 - t) * 0.6 : 0 }} />;
};

const DestCard: React.FC<{ readonly x: number; readonly y: number; readonly name: string; readonly icon: string; readonly delay: number; readonly small?: boolean }> = ({ x, y, name, icon, delay, small }) => {
  const f = useFrame();
  const p = usePop(delay, 11);
  const w = small ? 360 : 410;
  const h = small ? 230 : 340;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2 + Math.sin(f / 16 + x) * 6, width: w, height: h, scale: 0.5 + Math.max(0, p) * 0.5, opacity: Math.min(1, p * 1.5) }}>
      <Glass style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, direction: "rtl", fontFamily: FONT, backgroundColor: small ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)" }}>
        <Disc icon={icon} size={small ? 100 : 140} />
        <div style={{ fontSize: small ? 54 : 74, fontWeight: small ? 500 : 900, color: C.white, whiteSpace: "nowrap" }}>{name}</div>
      </Glass>
    </div>
  );
};

/* ---------------------------------------------------------------- 9 enjoy */
export const S9: React.FC = () => {
  const f = useFrame();
  const tag = usePop(at(9, 3, 4), 12);
  const drift = interpolate(f, [0, 200], [0, -40], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: C.seaDark }}>
      <div style={{ position: "absolute", inset: 0, translate: `0px ${drift}px` }}>
        <Pic src="media/edu/ai/fun.jpg" total={220} from={1.05} to={1.22} />
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,45,90,0.78) 0%, rgba(18,66,124,0.35) 45%, rgba(10,45,90,0.88) 100%)" }} />
      <div style={abs(300, { gap: 0 })}>
        <BigWords words={[{ t: "استمتعوا" }]} delay={at(9, 0, -2)} size={250} />
        <BigWords words={[{ t: "بالنشاط" }, { t: "والرحلة" }]} delay={at(9, 1)} size={84} weight={300} />
      </div>
      <div style={abs(1060, { gap: 6 })}>
        <BigWords words={[{ t: "والباقي" }, { t: "كله" }]} delay={at(9, 2)} size={116} weight={500} />
        <div style={{ position: "relative", marginLeft: -20 }}>
          <Swoosh at={at(9, 2, 10)} width={400} color={C.desert} thickness={12} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1380, display: "flex", justifyContent: "center", scale: 0.6 + Math.max(0, tag) * 0.4, opacity: Math.min(1, tag) }}>
        <div style={{ position: "relative", direction: "rtl", fontFamily: FONT, fontWeight: 700, fontSize: 74, color: C.white, backgroundColor: C.desert, padding: "22px 70px 30px", borderRadius: 200, boxShadow: "0 20px 44px rgba(238,139,34,0.4)" }}>
          على فريق جستنا
          <Sweep at={at(9, 3, 14)} radius={200} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- 10 call to action */
export const S10: React.FC = () => {
  const f = useFrame();
  const logo = usePop(at(10, 1, -4), 12);
  const badge = usePop(at(10, 1, 6), 11);
  const url = usePop(at(10, 1, 18), 12);
  const ring = usePop(2, 16);
  return (
    <AbsoluteFill style={{ backgroundColor: C.white }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F1F6FC 100%)" }} />
      <div style={{ position: "absolute", left: -310, top: 120, width: 1700, height: 1700, opacity: 0.17 * Math.min(1, ring), rotate: `${f * 0.4}deg`, scale: 0.85 + Math.max(0, ring) * 0.15 }}>
        <Img src={staticFile("patterns/primary-ring-color.svg")} style={{ width: "100%", height: "100%" }} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.85) 46%, rgba(255,255,255,0) 80%)" }} />
      <div style={abs(300, { gap: 0 })}>
        <BigWords words={[{ t: "تواصل" }, { t: "معنا" }, { t: "اليوم" }]} delay={at(10, 0, -2)} size={84} weight={500} color={C.seaDark} />
        <BigWords words={[{ t: "مجاناً" }]} delay={at(10, 1, -6)} size={210} color={C.desert} />
        <div style={{ marginLeft: -30, marginTop: -6 }}>
          <Swoosh at={at(10, 1, 4)} width={430} color={C.sea} thickness={12} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center", scale: 0.55 + Math.max(0, logo) * 0.45, opacity: Math.min(1, logo) }}>
        <div style={{ position: "relative" }}>
          <LogoColor width={520} />
          <Sweep at={at(10, 1, 14)} dur={28} />
        </div>
      </div>
      <div style={abs(1160)}>
        <BigWords words={[{ t: "لمستوى" }, { t: "أسهل" }, { t: "وأكثر" }, { t: "أرباحاً" }]} delay={at(10, 3, 0)} size={64} weight={300} color={C.seaDark} stagger={5} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1330, display: "flex", justifyContent: "center", scale: 0.5 + Math.max(0, badge) * 0.5, opacity: Math.min(1, badge) }}>
        <div style={{ position: "relative" }}>
          <Pill bg={C.desert} color={C.white} size={60} weight={700}>
            للمدارس
          </Pill>
          <Sweep at={at(10, 4, 4)} radius={130} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1500, display: "flex", justifyContent: "center", scale: 0.6 + Math.max(0, url) * 0.4, opacity: Math.min(1, url) }}>
        <div style={{ direction: "ltr", fontFamily: FONT, fontWeight: 500, fontSize: 54, letterSpacing: 2, color: C.sea }}>guestna-edu.com</div>
      </div>
    </AbsoluteFill>
  );
};
