import useAniListClient from "@/hooks/use-anilist-client";
import Media from "@/interfaces/Media";
import { useInfiniteQuery, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { graphql } from "gql.tada";
import { GraphQLClient } from "graphql-request";
import { setStringAsync } from 'expo-clipboard'

interface Params {
  viewer: number,
  status: "watching" | "completed"
}

const useMediaByStatusQuery = (params: Params) => {
  const client = useAniListClient();
  return useInfiniteQuery({
    queryKey: ["show", "media", params],
    queryFn: ({ pageParam }) => fetchMediaByStatus(params, pageParam, client),
    initialPageParam: 1,
    getNextPageParam: (_, __, lastPageParam) => lastPageParam + 1
  })
}

export default useMediaByStatusQuery;

const fetchMediaByStatus = async ({ status, viewer }: Params, page: number, client: GraphQLClient) => {
  const statusMapped = {
    watching: "CURRENT",
    completed: "COMPLETED"
  } as const

  const response = await client.request(completed_query, {
    userId: viewer,
    status: statusMapped[status],
    chunk: page,
    perChunk: 10
  });


  const shows: Media[] = response.collection?.lists?.[0]?.entries?.map((entry) => {
    const media = entry?.media
    return ({
      id: media?.id!,
      title: media?.title?.userPreferred!,
      cover: media?.coverImage?.large!,
      progress: media?.mediaListEntry?.progress!,
      episodes: media?.episodes!
    });
  })!

  return shows ?? []
}

const completed_query = graphql(`
  query CompletedQuery($userId: Int!,$status: MediaListStatus!, $chunk:Int!, $perChunk: Int!) {
    collection:MediaListCollection(
      userId: $userId
      type: ANIME
      status_in: [$status]
      sort: [FINISHED_ON_DESC],
      chunk: $chunk,
      perChunk: $perChunk
    ) {
      lists {
        name
        entries {
          media {
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
    }
  }
`);