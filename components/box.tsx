import theme from "@/constants/theme";
import { useTheme } from "@/ctx/theme-provider";
import { View, ViewProps } from "react-native";

type Spacing = keyof typeof theme.spacing;
type Color = keyof typeof theme.colors;

export interface BoxProps extends ViewProps {
  height?: Spacing;
  width?: Spacing;
  padding?: Spacing;
  paddingVertical?: Spacing;
  paddingHorizontal?: Spacing;
  margin?: Spacing;
  gap?: Spacing;
  background?: Color;
  rounding?: Spacing | "full";
  row?: boolean;
  wrap?: boolean;
  flex?: boolean;
}

const Box = ({
  width,
  height,
  padding,
  paddingHorizontal,
  paddingVertical,
  margin,
  background,
  row,
  rounding,
  gap,
  wrap,
  flex,
  ...props
}: BoxProps) => {
  const theme = useTheme();
  return (
    <View
      {...props}
      style={[
        {
          width: width && theme.spacing[width],
          height: height && theme.spacing[height],
          padding: padding && theme.spacing[padding],
          paddingHorizontal:
            paddingHorizontal && theme.spacing[paddingHorizontal],
          paddingVertical: paddingVertical && theme.spacing[paddingVertical],
          margin: margin && theme.spacing[margin],
          borderRadius:
            rounding == "full" ? 1000 : rounding && theme.spacing[rounding],
          gap: gap && theme.spacing[gap],
          backgroundColor: background && theme.colors[background],
          flexDirection: (row && "row") || undefined,
          flexWrap: wrap ? "wrap" : "nowrap",
          flex: (flex && 1) || undefined,
        },
        props.style,
      ]}
    />
  );
};

export default Box;
