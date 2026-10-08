import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { C, EASE } from "../brand";
import { useFrame } from "../clock";
import { clamp, Disc, usePop } from "../kit";
import { Check, Phone, PressButton, TripRow } from "./ui";

/**
 * The parent journey on a phone: notification, approval, payment (online then instalments).
 * All times are design frames local to the scene. `appearAt` is when the phone pops in.
 */
export const ParentFlow: React.FC<{
  readonly appearAt: number;
  readonly notifAt: number;
  readonly approveAt: number;
  readonly pay1At: number;
  readonly pay2At: number;
  readonly top?: number;
  readonly scale?: number;
}> = ({ appearAt, notifAt, approveAt, pay1At, pay2At, top = 495, scale = 0.84 }) => {
  const f = useFrame();
  const phone = usePop(appearAt, 13);
  const notif = usePop(notifAt, 11);
  const toApprove = interpolate(f, [approveAt - 6, approveAt + 2], [0, 1], { ...clamp, easing: EASE });
  const toPay = interpolate(f, [pay1At - 6, pay1At + 2], [0, 1], { ...clamp, easing: EASE });
  const first = usePop(pay1At + 2, 12);
  const second = usePop(pay2At, 12);
  return (
    <div style={{ position: "absolute", left: 270, top, width: 540, height: 1090, scale: scale * (0.7 + Math.max(0, phone) * 0.3), opacity: Math.min(1, phone * 1.5) }}>
      <Phone screen="#0E3A70">
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(170deg, ${C.sea}, ${C.seaDark})`, opacity: 1 - toApprove }}>
          <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontSize: 150, fontWeight: 300, color: C.white, direction: "ltr" }}>9:41</div>
          <div style={{ position: "absolute", left: 26, right: 26, top: 400, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.96)", padding: "24px 26px", display: "flex", alignItems: "center", gap: 20, direction: "rtl", scale: 0.8 + Math.max(0, notif) * 0.2, opacity: Math.min(1, notif * 1.5), translate: `0px ${(1 - Math.min(1, notif)) * -120}px` }}>
            <Disc icon="bus" size={96} bg="#D1DEED" />
            <div>
              <div style={{ fontSize: 36, fontWeight: 800, color: C.seaDark }}>رحلة جديدة</div>
              <div style={{ fontSize: 28, fontWeight: 400, color: C.sea, marginTop: 4 }}>بانتظار موافقتك</div>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "#F4F8FD", opacity: toApprove * (1 - toPay), translate: `0px ${(1 - toApprove) * 60}px` }}>
          <div style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", fontSize: 44, fontWeight: 800, color: C.seaDark }}>الموافقة</div>
          <div style={{ position: "absolute", top: 190, left: 28, right: 28 }}>
            <TripRow icon="science" title="رحلة علمية" tag="محلية" delay={approveAt - 4} />
          </div>
          <div style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <PressButton label="موافقة" delay={approveAt - 2} pressAt={approveAt + 12} width={400} height={130} size={52} />
          </div>
          <div style={{ position: "absolute", top: 740, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <Check size={150} delay={approveAt + 18} />
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "#F4F8FD", opacity: toPay, translate: `0px ${(1 - toPay) * 80}px` }}>
          <div style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", fontSize: 44, fontWeight: 800, color: C.seaDark }}>الدفع</div>
          <PayCard top={210} label="أونلاين" logo="pay/apple-pay.svg" logoW={190} p={first} />
          <PayCard top={500} label="أقساط" logo="pay/tamara.svg" logoW={330} p={second} />
          <div style={{ position: "absolute", top: 820, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <Check size={120} delay={pay2At + 8} />
          </div>
        </div>
      </Phone>
    </div>
  );
};

const PayCard: React.FC<{ readonly top: number; readonly label: string; readonly logo: string; readonly logoW: number; readonly p: number }> = ({ top, label, logo, logoW, p }) => (
  <div style={{ position: "absolute", top, left: 28, right: 28, height: 250, borderRadius: 40, backgroundColor: C.white, boxShadow: "0 14px 34px rgba(18,66,124,0.14)", border: `4px solid ${p > 0.6 ? C.desert : "#E4ECF6"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, scale: 0.85 + Math.max(0, p) * 0.15, opacity: Math.min(1, p * 1.5) }}>
    <Img src={staticFile(logo)} style={{ width: logoW }} />
    <div style={{ fontSize: 34, fontWeight: 700, color: C.sea }}>{label}</div>
  </div>
);
