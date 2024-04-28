import { ReactNode } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import Text from "./text";

interface SectionProps extends ViewProps {
  title: string;
  tailing?: ReactNode;
}

const Section = ({ title, tailing, ...props }: SectionProps) => (
  <View style={{ padding: 32 }}>
    <View style={styles.header}>
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
