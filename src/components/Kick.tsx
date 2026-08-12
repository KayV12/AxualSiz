import React from "react";
import { COLORS } from "../theme";

type KickProps = {
  children: React.ReactNode;
};

export const Kick: React.FC<KickProps> = ({ children }) => (
  <div
    style={{
      fontSize: 26,
      letterSpacing: "0.26em",
      textTransform: "uppercase",
      color: COLORS.brown,
      fontWeight: 600,
    }}
  >
    {children}
  </div>
);
