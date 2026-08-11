import { Composition } from "remotion";
import { ACTUAL_SIZE_DURATION_IN_FRAMES, ActualSize } from "./ActualSize";
import {
  VIDEO02_503020_DURATION_IN_FRAMES,
  Video02_503020,
} from "./Video02_503020";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./theme";

export const RemotionCompositions: React.FC = () => {
  return (
    <>
      <Composition
        id="ActualSize"
        component={ActualSize}
        durationInFrames={ACTUAL_SIZE_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video02-503020"
        component={Video02_503020}
        durationInFrames={VIDEO02_503020_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
    </>
  );
};
