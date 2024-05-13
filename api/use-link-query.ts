import useAllAnimeClient from "@/hooks/use-allanime-client";
import dycrept from "@/utils/decrypt";
import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { parse } from "hls-parser";
import { MasterPlaylist } from "hls-parser/types";
import { retry } from "ts-retry-promise";

interface Params {
  allAnimeId: string,
  episode: string,
  type: "sub" | "dub"
}

const m3u8_providers = ["Luf-mp4", "Default"];
const mp4_providers = ["S-mp4", "Kir", "Sak"];

const useLinkQuery = (params: Params) => {
  const client = useAllAnimeClient();

  return useQuery({
    queryKey: ["show", "link", params],
    queryFn: () => fetchLink(params, client),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}

export default useLinkQuery

const fetchLink = async ({ allAnimeId, episode, type }: Params, client: GraphQLClient) => {

  const response: QueryEpisode = await retry(
    () => client.request(query_episode, {
      showId: allAnimeId,
      episodeString: episode,
      translationType: type,
    }),
    { retries: 3 }
  );


  const providers = response.episode.sourceUrls
    .filter((url) => [...m3u8_providers, ...mp4_providers].includes(url.sourceName))
    .reduce(
      (prev, url) => ({
        ...prev,
        [url.sourceName]:
          "https://allanime.day" +
          url.sourceUrl.replace("--", "").match(/.{1,2}/g)?.map(dycrept).join("").replace("clock", "clock.json"),
      }),
      {} as Record<string, string>
    );


  const link = await retry(async () => {
    const headers = new Headers();
    headers.append("Referer", "https://allanime.to")
    headers.append("Agent", 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0')

    const res = await Promise.any([fetch(providers["Luf-mp4"], { headers }), fetch(providers["Default"], { headers })]);
    const json = await res.json();
    const link = json.links[0].link;

    return link
  }, { retries: 3 });

  const hlsRes = await fetch(link)
  const hls = parse(await hlsRes.text()) as MasterPlaylist


  const urlStart = link.split("/").slice(0, -1).join("/") + "/";

  return [...hls.variants.map((variant) => ({
    name: `${variant.resolution?.height}p`,
    url: variant.uri.startsWith("http") ? variant.uri : urlStart + variant.uri,
  })), {
    name: "auto" as const,
    url: link as string
  }];

}


interface QueryEpisode {
  episode: {
    episodeString: string;
    sourceUrls: { sourceUrl: string; sourceName: string }[];
  };
}

const query_episode = `
  query ($showId: String!, $translationType: VaildTranslationTypeEnumType!, $episodeString: String!) {
    episode(
      showId: $showId
      translationType: $translationType
      episodeString: $episodeString
    ) {
      episodeString
      translationType
      sourceUrls
    }
  }
`;