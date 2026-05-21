import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors, type} from '../theme';
import {fontFamily} from '../primitives/font';
import {copy} from '../copy';

export const B4_Vision: React.FC = () => {
  const frame = useCurrentFrame();

  // Mask reveal: clip-path opens horizontally from center outward.
  const reveal = interpolate(frame, [10, 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const half = reveal * 50;

  // Beat fades out at the end (150f total).
  const fadeOut = interpolate(frame, [126, 150], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: type.headline,
          color: colors.ink,
          letterSpacing: type.trackingHeadline,
          lineHeight: type.leadingTight,
          textAlign: 'center',
          whiteSpace: 'pre-line',
          padding: '0 80px',
          clipPath: `polygon(${50 - half}% 0, ${50 + half}% 0, ${50 + half}% 100%, ${50 - half}% 100%)`,
        }}
      >
        {copy.vision}
      </div>
    </AbsoluteFill>
  );
};
