import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { graphql } from "gql.tada";
import { useQuery } from "@tanstack/react-query";
import { Stack, router, useLocalSearchParams } from "expo-router";
import useGraphQLClient from "@/hooks/useGraphQLClient";
import { LinearGradient } from "expo-linear-gradient";
import useScrapeGraphQLClient from "@/hooks/useScrapeGraphQLClient";
import { Episode, ShowsConnection } from "@/all-anime";

type Props = {};

interface SourceUrl {
  sourceUrl: string;
  priority: number;
  sourceName: string;
  type: string;
  className: string;
  streamerId: string;
  sandbox?: string;
  downloads?: {
    sourceName: string;
    downloadUrl: string;
  };
}

const mediaQuery = graphql(`
  query GetMedia($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      coverImage {
        large
      }
      bannerImage
      title {
        userPreferred
      }
      description
      episodes
    }
  }
`);

const epsQuery = `
  query($search: String) {
    shows(
        search: {
          query: $search
        }
        page: 1
      ) {
        edges {
          _id
          name
          availableEpisodesDetail
          thumbnail
          aniListId
        }
      }
  }
`;

const query_episode = `
  query ($showId: String!, $translationType: VaildTranslationTypeEnumType!, $episodeString: String!) {
    episode(
      showId: $showId
      translationType: $translationType
      episodeString: $episodeString
    ) {
      episodeString
      sourceUrls
    }
  }
`;

const m3u8_providers = ["Luf-mp4", "Default"];
const mp4_providers = ["S-mp4", "Kir", "Sak"];

const Show = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = useGraphQLClient();
  const animeClient = useScrapeGraphQLClient();

  const { data, error, isSuccess } = useQuery({
    queryKey: ["show", id],
    queryFn: () => client.request(mediaQuery, { id: Number(id) }),
  });

  const { data: anime, error: animeError } = useQuery({
    queryKey: ["epsiodes", id],
    queryFn: async () => {
      console.log("first");
      const res: { shows: ShowsConnection } = await animeClient.request(
        epsQuery,
        {
          search: data?.Media?.title?.userPreferred,
        }
      );
      const show = res.shows.edges?.find((show) => show.aniListId == id);

      if (!show) throw new Error("Show not found");

      return {
        eps: show.availableEpisodesDetail.sub as string[],
        showId: show._id,
      };
    },
    enabled: isSuccess,
  });

  if (!data || !data.Media) return <Text>Loading...</Text>;

  const handleShow = async (ep: string) => {
    const episode = {
      showId: anime?.showId,
      translationType: "sub",
      episodeString: ep,
    };

    const episodeData: { episode: Episode } = await animeClient.request(
      query_episode,
      episode
    );

    const providers = (episodeData.episode.sourceUrls as SourceUrl[])
      .filter((url) =>
        [...mp4_providers, ...m3u8_providers].includes(url.sourceName)
      )
      .reduce(
        (prev, url) => ({
          ...prev,
          [url.sourceName]:
            "https://allanime.day" +
            url.sourceUrl
              .replace("--", "")
              .match(/.{1,2}/g)
              ?.map(replaceToText)
              .join("")
              .replace("clock", "clock.json"),
        }),
        {} as Record<string, string>
      );
    console.log(providers);

    for (let i = 0; i < Object.keys(providers).length; i++) {
      try {
        const source = Object.keys(providers)[i];
        const provider = providers[source];
        const res = await fetch(provider);
        if (res.status != 200) throw new Error();

        const json = await res.json();
        const url = mp4_providers.includes(source)
          ? json.links[0].src
          : json.links[0].link;

        router.push(
          `/watch/${encodeURIComponent(url)}?hls=${!mp4_providers.includes(
            source
          )}`
        );
        break;
      } catch (error) {
        continue;
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: data.Media.title?.userPreferred || "Loading...",
        }}
      />
      <FlatList
        style={{ flex: 1 }}
        data={anime?.eps?.sort((a, b) => Number(a) - Number(b))}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ paddingHorizontal: 16, paddingVertical: 8 }}
            onPress={() => handleShow(item)}
          >
            <Text>Episode {item}</Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={() => (
          <ImageBackground
            source={{ uri: data.Media!.bannerImage || undefined }}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,1)"]}
              style={{ padding: 16 }}
            >
              <View style={{ gap: 16, flexDirection: "row" }}>
                <Image
                  style={{ aspectRatio: 0.69, width: 125, borderRadius: 8 }}
                  source={{ uri: data.Media!.coverImage?.large || undefined }}
                />
                <View style={{ flex: 1, paddingVertical: 8 }}>
                  <Text style={{ fontSize: 18, fontWeight: "500" }}>
                    {data.Media!.title?.userPreferred}
                  </Text>
                  <Text style={{ opacity: 0.75, fontSize: 12 }}>
                    {data.Media!.episodes} Episodes
                  </Text>
                  <Text style={{ fontSize: 12 }} numberOfLines={3}>
                    {data.Media!.description}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        )}
      />
    </View>
  );
};

export default Show;

const styles = StyleSheet.create({});

const replaceToText = (string: string) => {
  if (string == "01") return "9";
  if (string == "08") return "0";
  if (string == "05") return "=";
  if (string == "0a") return "2";
  if (string == "0b") return "3";
  if (string == "0c") return "4";
  if (string == "07") return "?";
  if (string == "00") return "8";
  if (string == "5c") return "d";
  if (string == "0f") return "7";
  if (string == "5e") return "f";
  if (string == "17") return "/";
  if (string == "54") return "l";
  if (string == "09") return "1";
  if (string == "48") return "p";
  if (string == "4f") return "w";
  if (string == "0e") return "6";
  if (string == "5b") return "c";
  if (string == "5d") return "e";
  if (string == "0d") return "5";
  if (string == "53") return "k";
  if (string == "1e") return "&";
  if (string == "5a") return "b";
  if (string == "59") return "a";
  if (string == "4a") return "r";
  if (string == "4c") return "t";
  if (string == "4e") return "v";
  if (string == "57") return "o";
  if (string == "51") return "i";
  return string;
};
