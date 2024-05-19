import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import Box from "./box";
import { Iconify } from "react-native-iconify";
import { Image } from "expo-image";
import Viewer from "@/interfaces/Viewer";
import { useTheme } from "@/ctx/theme-provider";
import Text from "./text";

type Props = {
  viewer: Viewer;
};

const HomeHeader = ({ viewer }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <Link href={`/search`} asChild style={{ flex: 1 }}>
        <TouchableOpacity activeOpacity={0.8}>
          <Box
            row
            paddingHorizontal="md"
            gap="md"
            rounding="3xl"
            background="card"
            style={{ alignItems: "center", height: 40 }}
          >
            <Iconify
              icon="material-symbols-light:search"
              size={24}
              color={colors.secondary}
            />
            <Text color="secondary">Attack on Titan Season 2...</Text>
          </Box>
        </TouchableOpacity>
      </Link>
      <Link href={`/notifications`} asChild>
        <TouchableOpacity>
          <Box style={styles.notificationContainer} background="card">
            <Iconify
              icon="material-symbols-light:notifications-outline"
              size={24}
              color={colors.secondary}
            />
            {!!viewer.notifications && (
              <Box background="failure" style={styles.notifications}>
                <Text variant="small" color="white" style={{ lineHeight: 12 }}>
                  {viewer.notifications}
                </Text>
              </Box>
            )}
          </Box>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity onPress={() => router.push(`/user/${viewer.id}`)}>
        <Image
          cachePolicy="memory-disk"
          source={{ uri: viewer.avatar }}
          style={[styles.avatar, { backgroundColor: colors.card }]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  notifications: {
    padding: 2,
    position: "absolute",
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    position: "relative",
  },
  header: {
    padding: 16,
    paddingTop: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
});
