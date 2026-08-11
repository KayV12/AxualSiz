import { Composition } from "remotion";
import { ACTUAL_SIZE_DURATION_IN_FRAMES, ActualSize } from "./ActualSize";
import {
  VIDEO02_503020_DURATION_IN_FRAMES,
  Video02_503020,
} from "./Video02_503020";
import {
  VIDEO07_TAKE_HOME_DURATION_IN_FRAMES,
  Video07_TakeHome,
} from "./Video07_TakeHome";
import {
  VIDEO08_RENT_LIE_DURATION_IN_FRAMES,
  Video08_RentLie,
} from "./Video08_RentLie";
import {
  VIDEO09_SNOWBALL_AVALANCHE_DURATION_IN_FRAMES,
  Video09_SnowballAvalanche,
} from "./Video09_SnowballAvalanche";
import {
  VIDEO14_RENT_VS_BUY_DURATION_IN_FRAMES,
  Video14_RentVsBuy,
} from "./Video14_RentVsBuy";
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
      <Composition
        id="Video07-TakeHome"
        component={Video07_TakeHome}
        durationInFrames={VIDEO07_TAKE_HOME_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video08-RentLie"
        component={Video08_RentLie}
        durationInFrames={VIDEO08_RENT_LIE_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video09-SnowballAvalanche"
        component={Video09_SnowballAvalanche}
        durationInFrames={VIDEO09_SNOWBALL_AVALANCHE_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video14-RentVsBuy"
        component={Video14_RentVsBuy}
        durationInFrames={VIDEO14_RENT_VS_BUY_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
    </>
  );
};
