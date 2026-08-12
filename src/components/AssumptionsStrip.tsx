import React from "react";
import { COLORS } from "../theme";

type AssumptionsStripProps = {
  year: number;
  ratePerYear: string;
};

export const AssumptionsStrip: React.FC<AssumptionsStripProps> = ({
  year,
  ratePerYear,
}) => (
  <div
    style={{
      marginTop: 16,
      fontSize: 30,
      letterSpacing: "0.06em",
      color: COLORS.brown,
      fontWeight: 600,
      textTransform: "uppercase",
    }}
  >
    Year <span style={{ color: COLORS.cream }}>{year}</span>{" "}
    &nbsp;&middot;&nbsp; {ratePerYear} a year
  </div>
);
