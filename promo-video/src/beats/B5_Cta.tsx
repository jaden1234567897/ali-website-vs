import {AbsoluteFill} from 'remotion';
import {CtaCard} from '../primitives/CtaCard';
import {copy} from '../copy';

export const B5_Cta: React.FC = () => {
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <CtaCard text={copy.cta} enterAt={0} />
    </AbsoluteFill>
  );
};
