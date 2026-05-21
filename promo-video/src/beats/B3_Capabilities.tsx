import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Pill} from '../primitives/Pill';
import {copy} from '../copy';
import {motion} from '../theme';

export const B3_Capabilities: React.FC = () => {
  const frame = useCurrentFrame();
  // Whole beat fades out near its end (beat is 270f long).
  const fadeOut = interpolate(frame, [240, 270], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 32,
        opacity: fadeOut,
      }}
    >
      {copy.capabilities.map((label, i) => (
        <Pill
          key={label}
          label={label}
          enterAt={20 + i * (motion.pillStagger * 6)}
          fromSide={i % 2 === 0 ? 'left' : 'right'}
        />
      ))}
    </AbsoluteFill>
  );
};
