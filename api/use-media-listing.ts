import useAniListClient from "@/hooks/use-anilist-client";
import Media from "@/interfaces/Media";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { graphql, VariablesOf } from "gql.tada";
import { GraphQLClient } from "graphql-request";
import MediaStatus from "@/interfaces/MediaStatus";
import { Clipboard } from "react-native";

type Params = VariablesOf<typeof media_query>;
type QueryParams = Omit<Params, "chunk" | "perChunk">

type Listing = Partial<Record<MediaStatus, Media[]>>

const useMediaListing = (params: QueryParams, disabled = false) => {
  const client = useAniListClient();

  return useInfiniteQuery({
    queryKey: ["show", "media", "status", params],
    queryFn: ({ pageParam }) => fetchMediaByStatus({ ...params, chunk: pageParam, perChunk: 10 }, client),
    initialPageParam: 1,
    getNextPageParam: (_, __, lastPageParam) => lastPageParam + 1,
    enabled: !disabled,
    select: (data) => {
      return data.pages.flat()
    }
  })
}

export default useMediaListing;

const fetchMediaByStatus = async (params: Params, client: GraphQLClient) => {
  const result = await client.request(media_query, params);

  return result.collection?.lists?.[0]?.entries?.map((entry): Media => ({
    id: entry?.media?.id!,
    title: entry?.media?.title?.userPreferred!,
    episodes: entry?.media?.episodes ?? NaN,
    progress: entry?.media?.mediaListEntry?.progress ?? 0,
    cover: entry?.media?.coverImage?.medium!,
    hdCover: entry?.media?.coverImage?.extraLarge ?? undefined,
    status: entry?.media?.mediaListEntry?.status ?? undefined
  })) ?? []
}

const media_query = graphql(`
  query CompletedQuery($userId: Int!,$status: MediaListStatus!, $sort: [MediaListSort]!, $chunk:Int, $perChunk: Int) {
    collection:MediaListCollection(
      userId: $userId
      type: ANIME
      status: $status,
      sort: $sort,
      chunk: $chunk,
      perChunk: $perChunk,
      forceSingleCompletedList: false,
    ) {
      lists {
        status
        entries {
          media {
            id
            title {
              userPreferred
            }
            episodes
            coverImage {
              extraLarge
              medium
            }
            mediaListEntry{
              progress
              status
            } 
          }
        }
      }
    }
  }
`);