import {
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { graphql } from "gql.tada";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import useGraphQLClient from "@/hooks/useGraphQLClient";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

type Props = {
  userId: number;
};

const GET_WATCHING = graphql(`
  query Watching($page: Int) {
    popular: Page(page: $page, perPage: 6) {
      media(
        sort: POPULARITY_DESC
        type: ANIME
        seasonYear: 2024
        season: WINTER
      ) {
        ...media
      }
    }
  }

  fragment media on Media {
    id
    title {
      userPreferred
    }
    coverImage {
      large
    }
  }
`);

const CurrentlyWatching = ({ userId }: Props) => {
  const client = useGraphQLClient();
  const { data, error, fetchNextPage } = useInfiniteQuery({
    queryKey: ["watching"],
    queryFn: async ({ pageParam: page }) =>
      client.request(GET_WATCHING, { page }),
    getNextPageParam: (_, allPages) => (allPages?.length ?? 0) + 1,
    initialPageParam: 1,
  });

  return (
    <View>
      <Text style={{ padding: 16, paddingTop: 0 }}>Popular Anime:</Text>
      <FlatList
        data={data?.pages.flat().flatMap((page) => page?.popular?.media)}
        horizontal
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
        onEndReached={() => fetchNextPage()}
        renderItem={({ item: media }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push(`/show/${media?.id}`)}
          >
            <ImageBackground
              style={styles.cover}
              source={{ uri: media?.coverImage?.large!! }}
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.5)"]}
                style={styles.coverGradient}
              >
                <Text style={styles.coverTitle}>
                  {media?.title?.userPreferred}
                </Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CurrentlyWatching;

const styles = StyleSheet.create({
  cover: {
    aspectRatio: 0.69,
    width: 150,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  coverTitle: {
    color: "white",
    fontWeight: "500",
    fontSize: 12,
  },
  coverGradient: {
    padding: 8,
  },
});
