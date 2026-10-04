import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, IconDisc, Photo, Reveal, SceneFade } from "../../brand";

const TOTAL = 106;

const Card: React.FC<{
  readonly name: string;
  readonly delay: number;
  readonly icon: string;
  readonly label: string;
  readonly filled: boolean;
}> = ({ name, delay, icon, label, filled }) => (
  <Reveal
    name={name}
    delay={delay}
    style={{
      direction: "rtl",
      display: "flex",
      alignItems: "center",
      gap: 36,
      padding: "0 48px",
      height: 210,
      borderRadius: 40,
      fontFamily: FONT,
      fontSize: 66,
      whiteSpace: "nowrap",
      fontWeight: 900,
      color: filled ? C.white : C.seaDark,
      backgroundColor: filled ? C.desert : C.white,
    }}
  >
    <IconDisc icon={icon} size={140} bg={filled ? C.white : C.sea20} />
    <span>{label}</span>
  </Reveal>
);

export const TripTypesScene: React.FC = () => {
  return (
    <SceneFade>
      <AbsoluteFill name="Trip types" style={{ backgroundColor: C.seaDark }}>
        <Photo src="media/app/photos/alula-tombs.jpg" total={TOTAL} position="50% 45%" zoomFrom={1.02} zoomTo={1.12} />

        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 1040,
            display: "flex",
            flexDirection: "column",
            gap: 36,
          }}
        >
          <Card name="One day card" delay={9} icon="hiking" label="رحلات يوم واحد" filled={false} />
          <Card name="Multi day card" delay={48} icon="hotel" label="رحلات متعددة الأيام" filled />
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};
