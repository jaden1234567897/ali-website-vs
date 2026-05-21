import {AbsoluteFill} from 'remotion';
import {Headline} from '../primitives/Headline';
import {copy} from '../copy';
import {type} from '../theme';

export const B1_Hook: React.FC = () => {
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <Headline
        text={copy.hook}
        size={type.headline}
        enter={0}
        hold={90}
        exit={108}
      />
    </AbsoluteFill>
  );
};
