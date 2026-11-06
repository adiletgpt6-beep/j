import React from "react";
import { Composition } from "remotion";
import { AliShell, type AliData } from "./AliShell";
import full from "../../public/ali/data/ali.json";
import test from "../../public/ali/data/ali-test.json";

export const AliCompositions: React.FC = () => (
  <>
    {([["ali-test", test], ["ali", full]] as [string, AliData][]).map(([id, data]) => (
      <Composition key={id} id={id} component={AliShell} durationInFrames={data.totalFrames} fps={30} width={1080} height={1920} defaultProps={{ data }} />
    ))}
  </>
);
