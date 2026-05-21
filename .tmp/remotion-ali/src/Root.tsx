import React from "react";
import { Composition } from "remotion";
import { AliDemo } from "./AliDemo";

export const Root: React.FC = () => {
  return (
    <Composition
      id="AliDemo"
      component={AliDemo}
      durationInFrames={690}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
