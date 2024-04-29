import { ReactNode } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import Text from "./text";

interface SectionProps extends ViewProps {
  title: string;
  tailing?: ReactNode;
  titlePaddingOnly?: boolean;
  verticalPadding?: number;
}

const Section = ({
  title,
  tailing,
  titlePaddingOnly,
  verticalPadding = 32,
  ...props
}: SectionProps) => (
  <View
    style={[
      !titlePaddingOnly && { paddingHorizontal: 32 },
      { paddingVertical: verticalPadding },
    ]}
  >
    <View
      style={[styles.header, titlePaddingOnly && { paddingHorizontal: 32 }]}
    >
      <Text weight="semibold" style={styles.title}>
        {title}
      </Text>
      {tailing}
    </View>
    <View {...props} />
  </View>
);

export default Section;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: { fontSize: 14 },
});
