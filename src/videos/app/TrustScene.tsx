import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, IconDisc, Reveal, SceneFade } from "../../brand";

const Row: React.FC<{
  readonly name: string;
  readonly delay: number;
  readonly icon: string;
  readonly label: string;
}> = ({ name, delay, icon, label }) => (
  <Reveal
    name={name}
    delay={delay}
    style={{
      direction: "rtl",
      display: "flex",
      alignItems: "center",
      gap: 40,
      padding: "0 44px",
      height: 210,
      borderRadius: 40,
      backgroundColor: C.sea20,
      fontFamily: FONT,
      fontSize: 58,
      whiteSpace: "nowrap",
      fontWeight: 700,
      color: C.ink,
    }}
  >
    <IconDisc icon={icon} size={150} />
    <span>{label}</span>
  </Reveal>
);

// Local frames (scene starts at 17.3s). Voice: 17.6s, 19.75s, 22.15s, 23.5s
export const TrustScene: React.FC = () => {
  return (
    <SceneFade>
      <AbsoluteFill name="Trust" style={{ backgroundColor: C.white }}>
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 380,
            direction: "rtl",
            fontFamily: FONT,
            color: C.sea,
          }}
        >
          <Reveal name="Heading" delay={0} style={{ fontSize: 96, fontWeight: 900 }}>
            مع جستنا
          </Reveal>
        </div>

        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 550,
            display: "flex",
            flexDirection: "column",
            gap: 32,
          }}
        >
          <Row name="Women row" delay={9} icon="heritage-woman" label="رحلات نسائية آمنة" />
          <Row name="Payment row" delay={74} icon="shopping" label="خيارات دفع تناسب الجميع" />
          <Row name="Policies row" delay={146} icon="learning" label="سياسات واضحة" />
          <Row name="Data row" delay={186} icon="safety" label="بياناتك محفوظة" />
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};
