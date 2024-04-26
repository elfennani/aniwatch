import zinc from "@/utils/zinc";
import { Text as TextBase, TextProps } from "react-native";

interface Props extends TextProps {
  weight?: "regular" | "medium" | "semibold";
}

export default function Text({ weight = "regular", ...props }: Props) {
  return (
    <TextBase
      {...props}
      style={[{ fontFamily: weight, color: zinc[100] }, props.style]}
    />
  );
}
