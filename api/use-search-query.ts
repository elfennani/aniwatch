import useAniListClient from "@/hooks/use-anilist-client";
import Media from "@/interfaces/Media";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { graphql, readFragment } from "gql.tada";
import { GraphQLClient } from "graphql-request";

interface Params {
  query: string
}

const useSearchQuery = (params: Params) => {
  const client = useAniListClient();

  return useInfiniteQuery({
    queryKey: ["media", "search", params.query],
    queryFn: ({ pageParam }) => fetchShowsBySearch(params, pageParam, client),
    initialPageParam: 1,
    getNextPageParam: (_, __, param) => param + 1
  })
}

export default useSearchQuery;

const fetchShowsBySearch = async ({ query }: Params, page: number, client: GraphQLClient) => {
  if (!query)
    throw new Error("`query` can't be empty")

  const result = await client.request(search_query, { query, page })
  const media: Media[] = result.anime?.media?.map(show => {
    return ({
      id: show?.id!,
      cover: show?.coverImage?.large!,
      episodes: show?.episodes!,
      progress: show?.mediaListEntry?.progress!,
      title: show?.title?.userPreferred!,
      status: show?.mediaListEntry?.status ?? undefined
    });
  }) ?? []

  return media
}

const search_query = graphql(`
  query SeachQuery($query: String!, $page: Int!) {
    anime: Page(perPage: 8, page: $page) {
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
          status
        } 
      }
    }
  }
`);