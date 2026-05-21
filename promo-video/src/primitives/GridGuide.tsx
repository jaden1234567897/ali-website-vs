import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors, layout} from '../theme';

const BRACKET = 56;
const STROKE = 2;

export const GridGuide: React.FC<{
  inset?: number;
}> = ({inset = 220}) => {
  const frame = useCurrentFrame();
  const breathe = interpolate(
    Math.sin((frame / layout.fps) * 1.6),
    [-1, 1],
    [0.22, 0.42]
  );

  const cornerStyle: React.CSSProperties = {
    position: 'absolute',
    width: BRACKET,
    height: BRACKET,
    opacity: breathe,
  };

  const stroke = `${STROKE}px solid ${colors.guide}`;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          inset,
          pointerEvents: 'none',
        }}
      >
        <div style={{...cornerStyle, top: 0, left: 0, borderTop: stroke, borderLeft: stroke}} />
        <div style={{...cornerStyle, top: 0, right: 0, borderTop: stroke, borderRight: stroke}} />
        <div style={{...cornerStyle, bottom: 0, left: 0, borderBottom: stroke, borderLeft: stroke}} />
        <div style={{...cornerStyle, bottom: 0, right: 0, borderBottom: stroke, borderRight: stroke}} />
      </div>
    </AbsoluteFill>
  );
};
