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
  type: "sub" | "dub",
  mp4?: boolean
}

const m3u8_providers = ["Luf-mp4", "Default"];
const mp4_providers = ["S-mp4", "Kir", "Sak"];

const useLinkQuery = (params: Params, enabled = true) => {
  const client = useAllAnimeClient();

  return useQuery({
    queryKey: ["show", "link", params],
    queryFn: () => fetchLink(params, client),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled
  })
}

export default useLinkQuery

type FetchLinkReturn = Promise<{ name: string | "auto"; url: any; }[]>

export const fetchLink = async (params: Params, client: GraphQLClient): FetchLinkReturn => {
  const { allAnimeId, episode, type, mp4 = false } = params

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


    const res = await Promise.any(
      Object
        .keys(providers)
        .filter(provider =>
          mp4 ?
            mp4_providers.includes(provider) :
            m3u8_providers.includes(provider)
        )
        .map(provider => fetch(providers[provider], { headers }))
    );

    const json = await res.json();
    const link = json.links[0].link;

    return link
  }, { retries: 3 });

  if (mp4) {
    return [{
      name: "auto",
      url: link
    }]
  }

  const hlsRes = await fetch(link)
  const hls = parse(await hlsRes.text()) as MasterPlaylist


  const urlStart = link.split("/").slice(0, -1).join("/") + "/";

  return [...hls.variants.filter(v => !v.isIFrameOnly).map((variant) => ({
    name: `${variant.resolution?.height}p`,
    url: variant.uri.startsWith("http") ? variant.uri : urlStart + variant.uri,
  })), {
    name: "auto",
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