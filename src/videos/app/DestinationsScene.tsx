import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, Photo, Reveal, SceneFade, useWindow } from "../../brand";

const TOTAL = 196;

const CITIES = ["العلا", "جدة", "الطائف", "عسير"] as const;

// Local frames where each city is spoken
const CITY_AT = [96, 117, 141, 162] as const;

export const DestinationsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const alula = useWindow(0, CITY_AT[1] + 8);
  const jeddah = useWindow(CITY_AT[1], CITY_AT[2] + 8);
  const taif = useWindow(CITY_AT[2], CITY_AT[3] + 8);
  const asir = useWindow(CITY_AT[3], Infinity);

  const headline = useWindow(6, 84, 10);
  const shade = interpolate(frame, [80, 110], [0.5, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const nameOpacity = [
    useWindow(CITY_AT[0], CITY_AT[1] + 4, 8),
    useWindow(CITY_AT[1], CITY_AT[2] + 4, 8),
    useWindow(CITY_AT[2], CITY_AT[3] + 4, 8),
    useWindow(CITY_AT[3], Infinity, 8),
  ];

  const active = frame >= CITY_AT[3] ? 3 : frame >= CITY_AT[2] ? 2 : frame >= CITY_AT[1] ? 1 : frame >= CITY_AT[0] ? 0 : -1;

  return (
    <SceneFade>
      <AbsoluteFill name="Destinations" style={{ backgroundColor: C.ink }}>
        <Interactive.Div name="AlUla photo" style={{ position: "absolute", inset: 0, opacity: alula }}>
          <Photo src="media/app/photos/alula-elephant.jpg" total={TOTAL} position="50% 40%" />
        </Interactive.Div>
        <Interactive.Div name="Jeddah photo" style={{ position: "absolute", inset: 0, opacity: jeddah }}>
          <Photo src="media/app/photos/jeddah-balad.jpg" total={TOTAL} position="50% 60%" zoomFrom={1.16} zoomTo={1.04} />
        </Interactive.Div>
        <Interactive.Div name="Taif photo" style={{ position: "absolute", inset: 0, opacity: taif }}>
          <Photo src="media/app/photos/taif-hada.jpg" total={TOTAL} position="70% 50%" zoomFrom={1.04} zoomTo={1.18} />
        </Interactive.Div>
        <Interactive.Div name="Asir photo" style={{ position: "absolute", inset: 0, opacity: asir }}>
          <Photo src="media/app/photos/asir-rijal-almaa.jpg" total={TOTAL} position="47% 50%" zoomFrom={1.04} zoomTo={1.16} />
        </Interactive.Div>

        {/* legibility gradient */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, rgba(32,38,38,${shade + 0.25}) 0%, rgba(32,38,38,0) 34%, rgba(32,38,38,0) 45%, rgba(32,38,38,${shade + 0.5}) 100%)`,
          }}
        />

        {/* headline (spoken 4.35s to 6.8s) */}
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 300,
            direction: "rtl",
            textAlign: "center",
            fontFamily: FONT,
            color: C.white,
            opacity: headline,
          }}
        >
          <Reveal name="Headline 1" delay={8} style={{ fontSize: 112, fontWeight: 900, lineHeight: 1.2 }}>
            كل مكان في بالك
          </Reveal>
          <Reveal
            name="Headline 2"
            delay={22}
            style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.3, color: C.desert }}
          >
            جستنا تاخذك له
          </Reveal>
        </div>

        {/* city names */}
        {CITIES.map((city, i) => (
          <div
            key={city}
            style={{
              position: "absolute",
              left: 80,
              right: 80,
              top: 1010,
              direction: "rtl",
              textAlign: "center",
              fontFamily: FONT,
              fontSize: 230,
              fontWeight: 900,
              lineHeight: 1,
              color: C.white,
              opacity: nameOpacity[i],
              translate: `0px ${(1 - nameOpacity[i]) * 40}px`,
              textShadow: "0 6px 40px rgba(0,0,0,0.35)",
            }}
          >
            {city}
          </div>
        ))}

        {/* chips */}
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 1400,
            direction: "rtl",
            display: "flex",
            justifyContent: "center",
            gap: 20,
            fontFamily: FONT,
            opacity: useWindow(CITY_AT[0] - 6, Infinity, 10),
          }}
        >
          {CITIES.map((city, i) => (
            <div
              key={city}
              style={{
                fontSize: 48,
                fontWeight: 700,
                padding: "18px 40px",
                borderRadius: 60,
                color: i === active ? C.white : C.white,
                backgroundColor: i === active ? C.desert : "rgba(0,0,0,0.38)",
              }}
            >
              {city}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};
