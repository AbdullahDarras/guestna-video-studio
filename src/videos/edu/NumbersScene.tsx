import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE, FONT } from "../../brand";
import { clamp, MaskLine, Pill, Pic, useIn } from "../../kit";
import { at, dur } from "./timing";

const Block: React.FC<{
  readonly top: number;
  readonly delay: number;
  readonly big: string;
  readonly label: string;
  readonly color: string;
  readonly labelDelay: number;
}> = ({ top, delay, big, label, color, labelDelay }) => {
  const line = useIn(delay, 14);
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top, textAlign: "center" }}>
      <MaskLine name={`Stat ${label}`} delay={delay} size={200} color={color}>
        {big}
      </MaskLine>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
        <div style={{ height: 8, width: 500 * line, borderRadius: 4, backgroundColor: C.desert }} />
      </div>
      <MaskLine name={`Label ${label}`} delay={labelDelay} size={54} weight={700} style={{ marginTop: 14 }}>
        {label}
      </MaskLine>
    </div>
  );
};

export const NumbersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const startCount = at(4, 1, 14);
  const count = Math.round(interpolate(frame, [startCount, startCount + 22], [0, 300], { ...clamp, easing: EASE }));
  const tag = useIn(at(4, 2, 16), 10);

  return (
    <AbsoluteFill name="Numbers" style={{ backgroundColor: C.seaDark }}>
      <Pic src="media/edu/ai/riyadh.jpg" total={dur(4)} from={1.02} to={1.2} />
      <AbsoluteFill style={{ backgroundColor: "rgba(18,66,124,0.66)" }} />

      <Block top={250} delay={at(4, 0)} big="آلاف" label="طلاب في رحلات مدرسية" color={C.desert} labelDelay={at(4, 0, 14)} />

      <div style={{ position: "absolute", left: 90, right: 90, top: 620, textAlign: "center" }}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 200,
            lineHeight: 1.12,
            color: C.white,
            direction: "ltr",
            opacity: frame >= at(4, 1) ? 1 : 0,
          }}
        >
          +{count}
        </div>
        <MaskLine name="Label 300" delay={at(4, 1)} size={54} weight={700}>
          وجهة تعليمية وترفيهية
        </MaskLine>
      </div>

      <Block top={1000} delay={at(4, 2)} big="عشرات" label="المدن السعودية" color={C.desert} labelDelay={at(4, 2, 8)} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1420, display: "flex", justifyContent: "center", opacity: tag }}>
        <Pill bg="rgba(255,255,255,0.16)" color={C.white} size={40}>
          في كل اتجاهات السعودية
        </Pill>
      </div>
    </AbsoluteFill>
  );
};
