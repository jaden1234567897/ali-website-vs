import {AbsoluteFill} from 'remotion';
import {Headline} from '../primitives/Headline';
import {copy} from '../copy';
import {colors, type} from '../theme';

export const B2_Reframe: React.FC = () => {
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 24}}>
      <Headline
        text={copy.reframe.before}
        size={type.body}
        weight={400}
        color={colors.muted}
        enter={0}
        hold={120}
        exit={132}
      />
      <Headline
        text={copy.reframe.emphasis}
        size={type.headlineXL}
        weight={700}
        color={colors.ink}
        enter={6}
        hold={120}
        exit={132}
      />
      <Headline
        text={copy.reframe.after}
        size={type.body}
        weight={400}
        color={colors.muted}
        enter={12}
        hold={120}
        exit={132}
      />
    </AbsoluteFill>
  );
};
