import React from "react";
import { AbsoluteFill, Img, Interactive, staticFile } from "remotion";
import { C, FONT } from "../../brand";
import { Burst, Floaters, MaskLine, Ring, useIn, usePop } from "../../kit";
import { at } from "./timing";

// Logos are taken from the Guestna website payment methods.
const LogoCard: React.FC<{ readonly top: number; readonly delay: number; readonly src: string; readonly width: number; readonly name: string }> = ({
  top,
  delay,
  src,
  width,
  name,
}) => {
  const pop = usePop(delay, 12);
  return (
    <Interactive.Div
      name={name}
      style={{
        position: "absolute",
        left: 120,
        right: 120,
        top,
        height: 290,
        borderRadius: 60,
        backgroundColor: C.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scale: 0.6 + pop * 0.4,
        opacity: Math.min(1, pop * 1.3),
      }}
    >
      <Img src={staticFile(src)} style={{ width }} />
    </Interactive.Div>
  );
};

export const PaymentScene: React.FC = () => {
  const or = useIn(at(7, 2, -10), 8);
  return (
    <AbsoluteFill name="Payment" style={{ backgroundColor: C.seaDark }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(25,89,166,0.85) 0%, rgba(18,66,124,0) 62%)" }} />
      <Ring speed={0.7} opacity={0.1} top={200} />
      <Floaters />

      <div style={{ position: "absolute", left: 90, right: 90, top: 290 }}>
        <MaskLine name="Title" delay={at(7, 0)} size={124}>
          دفع إلكتروني
        </MaskLine>
      </div>

      <LogoCard name="Apple Pay" top={620} delay={at(7, 1)} src="pay/apple-pay.svg" width={320} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 935,
          textAlign: "center",
          direction: "rtl",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 66,
          color: C.white,
          opacity: or,
        }}
      >
        أو
      </div>
      <LogoCard name="Tamara" top={1050} delay={at(7, 2)} src="pay/tamara.svg" width={600} />
      <Burst at={at(7, 2)} x={540} y={1195} />
    </AbsoluteFill>
  );
};
