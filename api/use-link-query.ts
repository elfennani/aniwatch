import useAllAnimeClient from "@/hooks/use-allanime-client";
import dycrept from "@/utils/decrypt";
import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
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
    queryFn: () => fetchLink(params, client)
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
    .filter((url) => m3u8_providers.includes(url.sourceName))
    .reduce(
      (prev, url) => ({
        ...prev,
        [url.sourceName]:
          "https://allanime.day" +
          url.sourceUrl
            .replace("--", "")
            .match(/.{1,2}/g)
            ?.map(dycrept)
            .join("")
            .replace("clock", "clock.json"),
      }),
      {} as Record<string, string>
    );

  const link = await retry(async () => {
    const res = await fetch(providers["Luf-mp4"]);
    const json = await res.json();
    const link = json.links[0].link;

    return link
  }, { retries: 3 });

  return link as string
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
      sourceUrls
    }
  }
`;