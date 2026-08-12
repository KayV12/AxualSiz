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
  VIDEO10_START_TODAY_DURATION_IN_FRAMES,
  Video10_StartToday,
} from "./Video10_StartToday";
import {
  VIDEO11_TACKLE_OR_IGNORE_DURATION_IN_FRAMES,
  Video11_TackleOrIgnore,
} from "./Video11_TackleOrIgnore";
import {
  VIDEO14_RENT_VS_BUY_DURATION_IN_FRAMES,
  Video14_RentVsBuy,
} from "./Video14_RentVsBuy";
import {
  VIDEO15_EMERGENCY_FUND_DURATION_IN_FRAMES,
  Video15_EmergencyFund,
} from "./Video15_EmergencyFund";
import {
  VIDEO16_CASH_VS_FINANCE_DURATION_IN_FRAMES,
  Video16_CashVsFinance,
} from "./Video16_CashVsFinance";
import {
  VIDEO27_PAYCHECK_BELT_DURATION_IN_FRAMES,
  Video27_PaycheckBelt,
} from "./Video27_PaycheckBelt";
import {
  VIDEO28_WAGE_VS_BREAD_DURATION_IN_FRAMES,
  Video28_WageVsBread,
} from "./Video28_WageVsBread";
import {
  VIDEO29_SAME_SALARY_TAX_DURATION_IN_FRAMES,
  Video29_SameSalaryTax,
} from "./Video29_SameSalaryTax";
import {
  VIDEO30_DEBT_RATES_DURATION_IN_FRAMES,
  Video30_DebtRates,
} from "./Video30_DebtRates";
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
        id="Video10-StartToday"
        component={Video10_StartToday}
        durationInFrames={VIDEO10_START_TODAY_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video11-TackleOrIgnore"
        component={Video11_TackleOrIgnore}
        durationInFrames={VIDEO11_TACKLE_OR_IGNORE_DURATION_IN_FRAMES}
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
      <Composition
        id="Video15-EmergencyFund"
        component={Video15_EmergencyFund}
        durationInFrames={VIDEO15_EMERGENCY_FUND_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video16-CashVsFinance"
        component={Video16_CashVsFinance}
        durationInFrames={VIDEO16_CASH_VS_FINANCE_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video27-PaycheckBelt"
        component={Video27_PaycheckBelt}
        durationInFrames={VIDEO27_PAYCHECK_BELT_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video28-WageVsBread"
        component={Video28_WageVsBread}
        durationInFrames={VIDEO28_WAGE_VS_BREAD_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video29-SameSalaryTax"
        component={Video29_SameSalaryTax}
        durationInFrames={VIDEO29_SAME_SALARY_TAX_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video30-DebtRates"
        component={Video30_DebtRates}
        durationInFrames={VIDEO30_DEBT_RATES_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
    </>
  );
};
