import {Composition} from 'remotion';
import {AliPromo} from './Composition';
import {layout} from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AliPromo"
      component={AliPromo}
      durationInFrames={layout.totalFrames}
      fps={layout.fps}
      width={layout.width}
      height={layout.height}
    />
  );
};
