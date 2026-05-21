import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {colors, layout} from '../theme';

export const BgGradient: React.FC<{
  drift?: number;
}> = ({drift = 0.04}) => {
  const frame = useCurrentFrame();
  const t = frame / layout.fps;
  const cx = 50 + Math.sin(t * 0.18) * drift * 100;
  const cy = 48 + Math.cos(t * 0.22) * drift * 100;

  return (
    <AbsoluteFill style={{backgroundColor: colors.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 45% at ${cx}% ${cy}%, ${colors.bloomInner} 0%, rgba(220,233,255,0) 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};
