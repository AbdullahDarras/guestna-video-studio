import React from "react";
import { AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, EASE, FONT, useWindow } from "../../brand";
import { clamp, Disc, Floaters, MaskLine, Pill, useIn, usePop } from "../../kit";
import { at } from "./timing";

const card: React.CSSProperties = { backgroundColor: C.white, borderRadius: 48, direction: "rtl", fontFamily: FONT };

const Role: React.FC<{ readonly x: number; readonly y: number; readonly delay: number; readonly label: string }> = ({ x, y, delay, label }) => {
  const pop = usePop(delay, 12);
  return (
    <Interactive.Div
      name={`Role ${label}`}
      style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: 0.5 + pop * 0.5, opacity: Math.min(1, pop) }}
    >
      <Pill size={46} bg={C.white} color={C.seaDark}>
        {label}
      </Pill>
    </Interactive.Div>
  );
};

const Toggle: React.FC<{ readonly on: number; readonly label: string; readonly delay: number }> = ({ on, label, delay }) => {
  const pop = usePop(delay, 13);
  const frame = useCurrentFrame();
  const k = interpolate(frame, [on, on + 8], [0, 1], { ...clamp, easing: EASE });
  return (
    <Interactive.Div
      name={`Toggle ${label}`}
      style={{
        ...card,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 52px",
        height: 200,
        scale: 0.8 + pop * 0.2,
        opacity: Math.min(1, pop),
      }}
    >
      <div style={{ fontSize: 62, fontWeight: 900, color: C.seaDark, whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ width: 180, height: 96, borderRadius: 48, backgroundColor: k > 0.5 ? C.desert : "#A3BCDB", position: "relative", direction: "ltr" }}>
        <div style={{ position: "absolute", top: 10, left: 10 + k * 84, width: 76, height: 76, borderRadius: 38, backgroundColor: C.white }} />
      </div>
    </Interactive.Div>
  );
};

const Check: React.FC<{ readonly at: number; readonly label: string }> = ({ at: a, label }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [a, a + 9], [0, 1], { ...clamp, easing: EASE });
  const pop = usePop(a, 10);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 34, height: 140 }}>
      <div
        style={{
          width: 104,
          height: 104,
          borderRadius: 52,
          backgroundColor: C.nature,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: 0.4 + pop * 0.6,
          opacity: Math.min(1, pop),
        }}
      >
        <svg width={60} height={60} viewBox="0 0 64 64">
          <path d="M12 34 L27 48 L52 16" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - p)} />
        </svg>
      </div>
      <div style={{ fontSize: 58, fontWeight: 800, color: C.seaDark, opacity: p, whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};

export const PlatformScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t1 = at(6, 1);
  const t2 = at(6, 2);
  const t3 = at(6, 3);
  const p1 = useWindow(2, t1 - 2, 6);
  const p2 = useWindow(t1 - 2, t2 - 2, 6);
  const p3 = useWindow(t2 - 2, t3 - 2, 6);
  const p4 = useWindow(t3 - 2, Infinity, 6);
  const hub = usePop(at(6, 0, 2), 12);
  const line = (d: number) => interpolate(frame, [d, d + 10], [0, 1], { ...clamp, easing: EASE });
  const bars = [0.38, 0.62, 0.5, 0.82, 1];
  const chart = useIn(t3 + 22, 10);

  return (
    <AbsoluteFill name="Platform" style={{ backgroundColor: C.seaDark }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, rgba(25,89,166,0.85) 0%, rgba(18,66,124,0) 62%)" }} />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)",
          backgroundSize: "90px 90px",
          translate: `0px ${(frame * 1.2) % 90}px`,
        }}
      />
      <Floaters />

      <div style={{ position: "absolute", left: 90, right: 90, top: 270 }}>
        <MaskLine name="Title" delay={at(6, 0)} size={124}>
          منصة واحدة
        </MaskLine>
      </div>

      {/* roles around the hub */}
      <div style={{ position: "absolute", inset: 0, opacity: p1, translate: `0px ${(1 - p1) * 30}px` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {[
            [540, 930, 540, 740, 8],
            [540, 930, 310, 1170, 14],
            [540, 930, 770, 1170, 20],
          ].map(([x1, y1, x2, y2, d]) => (
            <line
              key={`${x2}-${y2}`}
              x1={x1}
              y1={y1}
              x2={x1 + (x2 - x1) * line(d)}
              y2={y1 + (y2 - y1) * line(d)}
              stroke="#A3BCDB"
              strokeWidth={6}
              strokeDasharray="4 16"
              strokeLinecap="round"
            />
          ))}
        </svg>
        <Interactive.Div
          name="Hub"
          style={{
            position: "absolute",
            left: 540,
            top: 930,
            translate: "-50% -50%",
            width: 290,
            height: 290,
            borderRadius: 145,
            backgroundColor: C.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: 0.4 + hub * 0.6,
          }}
        >
          <Img src={staticFile("logos/symbol.svg")} style={{ width: 145 }} />
        </Interactive.Div>
        <Role x={540} y={700} delay={10} label="مالك الشركة التعليمية" />
        <Role x={310} y={1210} delay={16} label="مدير المدرسة" />
        <Role x={770} y={1210} delay={22} label="مدير النشاط" />
      </div>

      {/* automation toggles */}
      <div style={{ position: "absolute", left: 100, right: 100, top: 640, display: "flex", flexDirection: "column", gap: 34, opacity: p2, translate: `0px ${(1 - p2) * 40}px` }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pill bg={C.desert} color={C.white} size={50}>
            تشغيل وتنظيم تلقائي
          </Pill>
        </div>
        <Toggle delay={t1} on={t1 + 10} label="الرحلات" />
        <Toggle delay={t1 + 14} on={t1 + 32} label="الأنشطة اللاصفية" />
      </div>

      {/* bookings */}
      <div style={{ position: "absolute", left: 100, right: 100, top: 640, opacity: p3, translate: `0px ${(1 - p3) * 40}px` }}>
        <div style={{ ...card, padding: "46px 52px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 70, fontWeight: 900, color: C.seaDark }}>الحجوزات</div>
            <Pill bg={C.desert} color={C.white} size={42}>
              أونلاين
            </Pill>
          </div>
          <Check at={t2 + 4} label="إدارة كاملة للحجوزات" />
          <Check at={t2 + 22} label="متابعة مباشرة" />
        </div>
      </div>

      {/* smart reports */}
      <div style={{ position: "absolute", left: 100, right: 100, top: 640, opacity: p4, translate: `0px ${(1 - p4) * 40}px` }}>
        <div style={{ ...card, padding: "46px 52px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 70, fontWeight: 900, color: C.seaDark }}>تقارير ذكية</div>
            <Disc icon="photography" size={120} bg="#D1DEED" />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 26, height: 400, marginTop: 36 }}>
            {bars.map((b, i) => {
              const g = interpolate(frame, [t3 + 2 + i * 4, t3 + 16 + i * 4], [0, 1], { ...clamp, easing: EASE });
              return <div key={i} style={{ width: 104, height: 380 * b * g, borderRadius: 22, backgroundColor: i === bars.length - 1 ? C.desert : C.sea }} />;
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 32, opacity: chart }}>
            <Pill bg="#D1DEED" color={C.seaDark} size={44}>
              تصوير الأنشطة
            </Pill>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
