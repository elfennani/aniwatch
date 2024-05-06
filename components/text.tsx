import theme from "@/constants/theme";
import { useTheme } from "@/ctx/theme-provider";
import { Text as TextBase, TextProps } from "react-native";

interface Props extends TextProps {
  variant?: keyof typeof theme.textVariants;
  color?: keyof typeof theme.colors;
  flex?: boolean;
}

export default function Text({
  variant = "body",
  color = "foreground",
  flex = false,
  ...props
}: Props) {
  const theme = useTheme();
  return (
    <TextBase
      {...props}
      style={[
        theme.textVariants[variant],
        { color: theme.colors[color], flex: flex ? 1 : 0 },
        props.style,
      ]}
    />
  );
}
