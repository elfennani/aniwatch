import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import useUserQuery from "@/api/use-user-query";
import Text from "@/components/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, ImageBackground } from "expo-image";
import Section from "@/components/section";
import RenderHTML from "react-native-render-html";
import Skeleton from "@/components/skeleton";
import Banner from "@/components/banner";
import { useTheme } from "@/ctx/theme-provider";
import Stats from "@/components/stats";
import Box from "@/components/box";

type Params = {
  userId: string;
};

const UserById = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const { userId } = useLocalSearchParams<Params>();
  const {
    data: user,
    isPending,
    isError,
    error,
    isRefetching,
    refetch,
  } = useUserQuery({
    id: Number(userId),
  });

  if (isPending)
    return (
      <View>
        <View style={{ padding: 32, paddingTop: 32 + top, gap: 16 }}>
          <View
            style={{ flexDirection: "row", alignItems: "flex-end", gap: 16 }}
          >
            <Skeleton style={styles.cover} />
            <View style={{ flex: 1, gap: 8, paddingVertical: 16 }}>
              <Skeleton height={32} style={{ maxWidth: 175 }} />
            </View>
          </View>
        </View>
        <Skeleton height={1} radius={0} />
        <View style={{ padding: 32, gap: 16 }}>
          <Skeleton height={24} width={60} />
          <View style={{ gap: 8 }}>
            <Skeleton height={18} />
            <Skeleton height={18} />
            <Skeleton height={18} width="70%" />
          </View>
        </View>
      </View>
    );
  if (isError) return <Text>Error: {error.message}</Text>;

  return (
    <ScrollView
      style={{ paddingBottom: bottom }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          progressViewOffset={top}
        />
      }
    >
      <ImageBackground
        cachePolicy="memory-disk"
        source={{ uri: user.banner ?? undefined }}
        contentFit="cover"
        style={{ backgroundColor: theme.colors.card }}
      >
        <Banner>
          <Box row gap="lg">
            <Image
              cachePolicy="memory-disk"
              style={[styles.cover, { backgroundColor: theme.colors.card }]}
              source={{ uri: user.avatar }}
              contentFit="cover"
            />
            <View style={styles.info}>
              <Text style={{ fontSize: 18 }}>{user.name}</Text>
            </View>
          </Box>
        </Banner>
      </ImageBackground>
      {user.about && (
        <Section title="About">
          <RenderHTML
            contentWidth={width - 64}
            systemFonts={["regular"]}
            baseStyle={{
              fontFamily: "regular",
              color: theme.colors.foreground,
              fontSize: 12,
              lineHeight: 19.25,
            }}
            source={{ html: user.about }}
          />
        </Section>
      )}
      <Section verticalPadding={16} title="Anime">
        <Stats>
          <Stats.Stat label="Total Anime" value={user.totalAnime} />
          <Stats.Stat
            label="Days Watched"
            value={user.daysWatched?.toFixed(2)}
          />
          <Stats.Stat label="Mean Score" value={user.meanScore} />
        </Stats>
      </Section>
      <Section verticalPadding={16} title="Manga">
        <Stats>
          <Stats.Stat label="Total Manga" value={user.totalManga} />
          <Stats.Stat label="Chapters Read" value={user.chaptersRead} />
          <Stats.Stat label="Mean Score" value={user.mangaMeanScore} />
        </Stats>
      </Section>
    </ScrollView>
  );
};

export default UserById;

const styles = StyleSheet.create({
  cover: {
    width: 128,
    height: 128,
    borderRadius: 128,
  },
  info: {
    justifyContent: "flex-end",
    gap: 4,
    flex: 1,
    paddingVertical: 16,
  },
  gradient: {
    padding: 32,
    backgroundColor: "rgba(39, 39, 42, 0.2)",
  },
});
