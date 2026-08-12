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
  VIDEO12_RENT_VS_BUY_20_DURATION_IN_FRAMES,
  Video12_RentVsBuy20,
} from "./Video12_RentVsBuy20";
import {
  VIDEO13_REAL_HOURLY_DURATION_IN_FRAMES,
  Video13_RealHourly,
} from "./Video13_RealHourly";
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
import {
  VIDEO31_SALARY_SLICED_DURATION_IN_FRAMES,
  Video31_SalarySliced,
} from "./Video31_SalarySliced";
import {
  VIDEO32_BONUS_PEELED_DURATION_IN_FRAMES,
  Video32_BonusPeeled,
} from "./Video32_BonusPeeled";
import {
  VIDEO33_BANK_FEES_DURATION_IN_FRAMES,
  Video33_BankFees,
} from "./Video33_BankFees";
import {
  VIDEO34_JUST_THIS_ONCE_DURATION_IN_FRAMES,
  Video34_JustThisOnce,
} from "./Video34_JustThisOnce";
import {
  VIDEO35_TAX_REFUND_DURATION_IN_FRAMES,
  Video35_TaxRefund,
} from "./Video35_TaxRefund";
import {
  VIDEO36_EMERGENCY_COUNTDOWN_DURATION_IN_FRAMES,
  Video36_EmergencyCountdown,
} from "./Video36_EmergencyCountdown";
import {
  VIDEO37_TRIAL_COUNTDOWN_DURATION_IN_FRAMES,
  Video37_TrialCountdown,
} from "./Video37_TrialCountdown";
import {
  VIDEO38_COFFEE_GRID_DURATION_IN_FRAMES,
  Video38_CoffeeGrid,
} from "./Video38_CoffeeGrid";
import {
  VIDEO39_HOURS_FOR_RENT_DURATION_IN_FRAMES,
  Video39_HoursForRent,
} from "./Video39_HoursForRent";
import {
  VIDEO40_TAKEOUT_GRID_DURATION_IN_FRAMES,
  Video40_TakeoutGrid,
} from "./Video40_TakeoutGrid";
import {
  VIDEO41_LATE_FEE_CASCADE_DURATION_IN_FRAMES,
  Video41_LateFeeCascade,
} from "./Video41_LateFeeCascade";
import {
  VIDEO42_SKIPPED_DEPOSIT_DURATION_IN_FRAMES,
  Video42_SkippedDeposit,
} from "./Video42_SkippedDeposit";
import {
  VIDEO44_EMERGENCY_JAR_DURATION_IN_FRAMES,
  Video44_EmergencyJar,
} from "./Video44_EmergencyJar";
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
        id="Video12-RentVsBuy20"
        component={Video12_RentVsBuy20}
        durationInFrames={VIDEO12_RENT_VS_BUY_20_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video13-RealHourly"
        component={Video13_RealHourly}
        durationInFrames={VIDEO13_REAL_HOURLY_DURATION_IN_FRAMES}
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
      <Composition
        id="Video31-SalarySliced"
        component={Video31_SalarySliced}
        durationInFrames={VIDEO31_SALARY_SLICED_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video32-BonusPeeled"
        component={Video32_BonusPeeled}
        durationInFrames={VIDEO32_BONUS_PEELED_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video33-BankFees"
        component={Video33_BankFees}
        durationInFrames={VIDEO33_BANK_FEES_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video34-JustThisOnce"
        component={Video34_JustThisOnce}
        durationInFrames={VIDEO34_JUST_THIS_ONCE_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video35-TaxRefund"
        component={Video35_TaxRefund}
        durationInFrames={VIDEO35_TAX_REFUND_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video36-EmergencyCountdown"
        component={Video36_EmergencyCountdown}
        durationInFrames={VIDEO36_EMERGENCY_COUNTDOWN_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video37-TrialCountdown"
        component={Video37_TrialCountdown}
        durationInFrames={VIDEO37_TRIAL_COUNTDOWN_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video38-CoffeeGrid"
        component={Video38_CoffeeGrid}
        durationInFrames={VIDEO38_COFFEE_GRID_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video39-HoursForRent"
        component={Video39_HoursForRent}
        durationInFrames={VIDEO39_HOURS_FOR_RENT_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video40-TakeoutGrid"
        component={Video40_TakeoutGrid}
        durationInFrames={VIDEO40_TAKEOUT_GRID_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video41-LateFeeCascade"
        component={Video41_LateFeeCascade}
        durationInFrames={VIDEO41_LATE_FEE_CASCADE_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video42-SkippedDeposit"
        component={Video42_SkippedDeposit}
        durationInFrames={VIDEO42_SKIPPED_DEPOSIT_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <Composition
        id="Video44-EmergencyJar"
        component={Video44_EmergencyJar}
        durationInFrames={VIDEO44_EMERGENCY_JAR_DURATION_IN_FRAMES}
        fps={30}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
    </>
  );
};
