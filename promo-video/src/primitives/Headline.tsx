import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, motion, type} from '../theme';
import {fontFamily} from './font';

type Props = {
  text: string;
  size?: number;
  weight?: 400 | 500 | 600 | 700;
  color?: string;
  align?: 'center' | 'left';
  enter?: number;
  hold?: number;
  exit?: number;
};

export const Headline: React.FC<Props> = ({
  text,
  size = type.headline,
  weight = 700,
  color = colors.ink,
  align = 'center',
  enter = 0,
  hold = 60,
  exit = enter + hold,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entryProgress = spring({
    frame: frame - enter,
    fps,
    config: motion.springSoft,
    durationInFrames: motion.entryFrames,
  });

  const exitProgress = interpolate(
    frame,
    [exit, exit + motion.exitFrames],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const scale = interpolate(entryProgress, [0, 1], [0.96, 1]);
  const opacity = entryProgress * (1 - exitProgress);
  const ty = interpolate(exitProgress, [0, 1], [0, -12]);

  return (
    <div
      style={{
        fontFamily,
        fontWeight: weight,
        fontSize: size,
        color,
        letterSpacing: type.trackingHeadline,
        lineHeight: type.leadingTight,
        textAlign: align,
        whiteSpace: 'pre-line',
        opacity,
        transform: `translateY(${ty}px) scale(${scale})`,
        padding: '0 80px',
      }}
    >
      {text}
    </div>
  );
};
