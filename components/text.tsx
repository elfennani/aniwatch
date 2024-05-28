import theme from "@/constants/theme";
import { useTheme } from "@/ctx/theme-provider";
import cn from "@/utils/cn";
import { Text as TextBase, TextProps } from "react-native";

interface Props extends TextProps {}

export default function Text({ className, ...props }: Props) {
  const theme = useTheme();
  return (
    <TextBase
      {...props}
      className={cn("text-zinc-900 font-regular dark:text-zinc-50", className)}
    />
  );
}
