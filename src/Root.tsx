import { Composition, Folder } from "remotion";
import { useBrandFonts } from "./brand";
import { VIDEOS } from "./videos/registry";

export const RemotionRoot: React.FC = () => {
  useBrandFonts();

  return (
    <>
      {VIDEOS.map((v) => (
        <Folder key={v.id} name={v.id}>
          <Composition
            id={v.id}
            component={v.component}
            durationInFrames={v.durationInFrames}
            fps={v.fps ?? 30}
            width={v.width ?? 1080}
            height={v.height ?? 1920}
          />
          {(v.scenes ?? []).map((s) => (
            <Composition
              key={s.id}
              id={`${v.id}-${s.id}`}
              component={s.component}
              durationInFrames={s.durationInFrames}
              fps={v.fps ?? 30}
              width={v.width ?? 1080}
              height={v.height ?? 1920}
            />
          ))}
        </Folder>
      ))}
    </>
  );
};
