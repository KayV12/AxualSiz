import { Composition } from "remotion";
import { ACTUAL_SIZE_DURATION_IN_FRAMES, ActualSize } from "./ActualSize";

export const RemotionCompositions: React.FC = () => {
  return (
    <Composition
      id="ActualSize"
      component={ActualSize}
      durationInFrames={ACTUAL_SIZE_DURATION_IN_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
