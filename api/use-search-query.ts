import useAniListClient from "@/hooks/use-anilist-client";
import Media from "@/interfaces/Media";
import { useQuery } from "@tanstack/react-query";
import { graphql, readFragment } from "gql.tada";
import { GraphQLClient } from "graphql-request";

interface Params {
  query: string
}

const useSearchQuery = (params: Params) => {
  const client = useAniListClient();

  return useQuery({
    queryKey: ["show", "search", params.query],
    queryFn: () => fetchShowsBySearch(params, client)
  })
}

export default useSearchQuery;

const fetchShowsBySearch = async ({ query }: Params, client: GraphQLClient) => {
  if (!query)
    throw new Error("`query` can't be empty")

  const result = await client.request(search_query, { query })
  const media: Media[] = result.anime?.media?.map(show => {
    return ({
      id: show?.id!,
      cover: show?.coverImage?.large!,
      episodes: show?.episodes!,
      progress: show?.mediaListEntry?.progress!,
      title: show?.title?.userPreferred!
    });
  }) ?? []

  return media
}

const search_query = graphql(`
  query SeachQuery($query: String) {
    anime: Page(perPage: 8) {
      media(
        type: ANIME,
        search: $query,
        isAdult: false,
        sort: POPULARITY_DESC
      ) {
        id
        title {
          userPreferred
        }
        episodes
        coverImage {
          large
        }
        mediaListEntry{
          progress
        } 
      }
    }
  }
`);