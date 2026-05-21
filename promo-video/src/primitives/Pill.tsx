import {spring, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {colors, motion, type} from '../theme';
import {fontFamily} from './font';

type Props = {
  label: string;
  enterAt: number;
  fromSide: 'left' | 'right';
  width?: number;
};

export const Pill: React.FC<Props> = ({label, enterAt, fromSide, width = 760}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({
    frame: frame - enterAt,
    fps,
    config: motion.springSnap,
    durationInFrames: 28,
  });

  const x = interpolate(progress, [0, 1], [fromSide === 'left' ? -200 : 200, 0]);
  const opacity = progress;

  return (
    <div
      style={{
        fontFamily,
        fontWeight: 600,
        fontSize: type.pill,
        color: colors.ink,
        letterSpacing: type.trackingBody,
        background: 'rgba(255,255,255,0.7)',
        border: `1.5px solid ${colors.guide}`,
        boxShadow: '0 4px 24px rgba(34, 60, 120, 0.06)',
        backdropFilter: 'blur(8px)',
        borderRadius: 999,
        padding: '28px 56px',
        width,
        textAlign: 'center',
        opacity,
        transform: `translateX(${x}px)`,
      }}
    >
      {label}
    </div>
  );
};
