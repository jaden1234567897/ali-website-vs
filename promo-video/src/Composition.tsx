import {AbsoluteFill, Sequence} from 'remotion';
import {BgGradient} from './primitives/BgGradient';
import {GridGuide} from './primitives/GridGuide';
import {B1_Hook} from './beats/B1_Hook';
import {B2_Reframe} from './beats/B2_Reframe';
import {B3_Capabilities} from './beats/B3_Capabilities';
import {B4_Vision} from './beats/B4_Vision';
import {B5_Cta} from './beats/B5_Cta';
import {beats} from './theme';

export const AliPromo: React.FC = () => {
  return (
    <AbsoluteFill>
      <BgGradient />
      <GridGuide />

      <Sequence from={beats.hook.from} durationInFrames={beats.hook.duration} name="1. Hook">
        <B1_Hook />
      </Sequence>

      <Sequence from={beats.reframe.from} durationInFrames={beats.reframe.duration} name="2. Reframe">
        <B2_Reframe />
      </Sequence>

      <Sequence from={beats.capabilities.from} durationInFrames={beats.capabilities.duration} name="3. Capabilities">
        <B3_Capabilities />
      </Sequence>

      <Sequence from={beats.vision.from} durationInFrames={beats.vision.duration} name="4. Vision">
        <B4_Vision />
      </Sequence>

      <Sequence from={beats.cta.from} durationInFrames={beats.cta.duration} name="5. CTA">
        <B5_Cta />
      </Sequence>
    </AbsoluteFill>
  );
};
