import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, motion, type} from '../theme';
import {fontFamily} from './font';

type Props = {
  text: string;
  enterAt?: number;
};

export const CtaCard: React.FC<Props> = ({text, enterAt = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = frame - enterAt;

  const cardProgress = spring({
    frame: local,
    fps,
    config: motion.springSoft,
    durationInFrames: 30,
  });

  // Letter-by-letter type-in starts after card lands.
  const typeStart = 16;
  const perLetter = 2;
  const visibleLetters = Math.max(
    0,
    Math.floor((local - typeStart) / perLetter)
  );

  // Cyan underline draws after text completes.
  const underlineStart = typeStart + text.length * perLetter;
  const underlineProgress = interpolate(
    local,
    [underlineStart, underlineStart + 20],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const cardOpacity = cardProgress;
  const cardScale = interpolate(cardProgress, [0, 1], [0.96, 1]);

  return (
    <div
      style={{
        opacity: cardOpacity,
        transform: `scale(${cardScale})`,
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 600,
          fontSize: type.cta,
          color: colors.ink,
          letterSpacing: type.trackingBody,
          textAlign: 'center',
          position: 'relative',
          display: 'inline-block',
        }}
      >
        <span style={{visibility: 'hidden'}}>{text}</span>
        <span
          style={{
            position: 'absolute',
            inset: 0,
            whiteSpace: 'pre',
          }}
        >
          {text.slice(0, visibleLetters)}
        </span>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -14,
            height: 3,
            background: colors.accent,
            transformOrigin: 'left center',
            transform: `scaleX(${underlineProgress})`,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
};
