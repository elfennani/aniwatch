import theme from "@/constants/theme";
import { useTheme } from "@/ctx/theme-provider";
import { Text as TextBase, TextProps } from "react-native";

interface Props extends TextProps {
  variant?: keyof typeof theme.textVariants;
  color?: keyof typeof theme.colors;
}

export default function Text({
  variant = "body",
  color = "foreground",
  ...props
}: Props) {
  const theme = useTheme();
  return (
    <TextBase
      {...props}
      style={[
        theme.textVariants[variant],
        { color: theme.colors[color] },
        props.style,
      ]}
    />
  );
}
