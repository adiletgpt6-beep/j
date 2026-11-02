import React from "react";
import { Composition } from "remotion";
import { VideoShell } from "./components/VideoShell";
import { videos } from "./videos";
import { FPS, H, W } from "./theme";
import type { VideoData } from "./types";

export const RemotionRoot: React.FC = () => (
  <>
    {videos.flatMap((v) =>
      (["ky", "ru"] as const)
        .filter((lang) => v.data[lang])
        .map((lang) => {
          const data = v.data[lang] as VideoData;
          return (
            <Composition
              key={`${v.id}-${lang}`}
              id={`${v.id}-${lang}`}
              component={VideoShell}
              durationInFrames={data.totalFrames}
              fps={FPS}
              width={W}
              height={H}
              defaultProps={{ data }}
            />
          );
        })
    )}
  </>
);
