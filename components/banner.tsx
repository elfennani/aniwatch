import React, { ReactNode, useMemo } from "react";
import { useTheme } from "@/ctx/theme-provider";
import chroma from "chroma-js";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: ReactNode | ReactNode[];
};

const Banner = (props: Props) => {
  const { top } = useSafeAreaInsets();
  const theme = useTheme();
  const headerGradient = useMemo(
    () => [
      chroma(theme.colors.background).alpha(0).css(),
      theme.colors.background,
    ],
    [theme]
  );

  return (
    <LinearGradient
      colors={headerGradient}
      locations={[0.25, 0.95]}
      style={{
        padding: 32,
        paddingTop: 32 + top,
        backgroundColor: chroma(theme.colors.background).alpha(0.2).css(),
      }}
    >
      {props.children}
    </LinearGradient>
  );
};

export default Banner;
