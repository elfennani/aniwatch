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
import { LinearGradient } from "expo-linear-gradient";
import zinc from "@/utils/zinc";
import Section from "@/components/section";
import RenderHTML from "react-native-render-html";
import purple from "@/utils/purple";
import Skeleton from "@/components/skeleton";

type Params = {
  userId: string;
};

const UserById = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
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
        source={{ uri: user.banner ?? undefined }}
        contentFit="cover"
        style={{ backgroundColor: zinc[800] }}
      >
        <LinearGradient
          colors={["rgba(39, 39, 42, 0)", zinc[900]]}
          locations={[0.25, 0.95]}
          style={[styles.gradient, { paddingTop: 32 + top }]}
        >
          <View style={styles.header}>
            <Image
              style={styles.cover}
              source={{ uri: user.avatar }}
              contentFit="cover"
            />
            <View style={styles.info}>
              <Text style={{ fontSize: 18 }}>{user.name}</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
      {user.about && (
        <Section title="About">
          <RenderHTML
            contentWidth={width - 64}
            systemFonts={["regular"]}
            baseStyle={{
              fontFamily: "regular",
              color: zinc[100],
              fontSize: 12,
              lineHeight: 19.25,
            }}
            source={{ html: user.about }}
          />
        </Section>
      )}
      <Section verticalPadding={16} title="Anime">
        <View style={styles.statContainer}>
          <View style={styles.statItem}>
            <Text style={styles.stat} weight="semibold">
              {user.totalAnime}
            </Text>
            <Text style={styles.statLabel}>Total Anime</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.stat} weight="semibold">
              {user.daysWatched?.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Days Watched</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.stat} weight="semibold">
              {user.meanScore}
            </Text>
            <Text style={styles.statLabel}>Mean Score</Text>
          </View>
        </View>
      </Section>
      <Section verticalPadding={16} title="Manga">
        <View style={styles.statContainer}>
          <View style={styles.statItem}>
            <Text style={styles.stat} weight="semibold">
              {user.totalManga}
            </Text>
            <Text style={styles.statLabel}>Total Manga</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.stat} weight="semibold">
              {user.chaptersRead}
            </Text>
            <Text style={styles.statLabel}>Chapters Read</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.stat} weight="semibold">
              {user.mangaMeanScore}
            </Text>
            <Text style={styles.statLabel}>Mean Score</Text>
          </View>
        </View>
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
    backgroundColor: zinc[800],
  },
  info: {
    justifyContent: "flex-end",
    gap: 4,
    flex: 1,
    paddingVertical: 16,
  },
  header: {
    flexDirection: "row",
    gap: 16,
  },
  gradient: {
    padding: 32,
    backgroundColor: "rgba(39, 39, 42, 0.2)",
  },
  statContainer: {
    backgroundColor: zinc[800],
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statLabel: {
    fontSize: 10,
    color: zinc[400],
  },
  stat: {
    color: purple[500],
  },
});
