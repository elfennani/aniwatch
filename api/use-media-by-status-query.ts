import useAniListClient from "@/hooks/use-anilist-client";
import Media from "@/interfaces/Media";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { graphql } from "gql.tada";
import { GraphQLClient } from "graphql-request";
import MediaStatus from "@/interfaces/MediaStatus";

interface Params {
  viewer: number,
  status: MediaStatus[],
  infinite: boolean,
  max?: number;
}

type Shows = Partial<Record<MediaStatus, Media[]>>

const useMediaByStatusQuery = (params: Params, disabled = false) => {
  const client = useAniListClient();

  if (!params.infinite) {
    return useQuery({
      queryKey: ["show", "media", "finite", params],
      queryFn: () => fetchMediaByStatus(params, undefined, client),
    })
  }

  return useInfiniteQuery({
    queryKey: ["show", "media", params],
    queryFn: ({ pageParam }) => fetchMediaByStatus(params, pageParam, client),
    initialPageParam: 1,
    getNextPageParam: (_, __, lastPageParam) => lastPageParam + 1,
    enabled: !disabled,
    select: (data) => {
      const result: Shows = {};

      data.pages.flat().forEach(page => {
        Object.keys(page).forEach(status => {
          const key = status as MediaStatus;
          result[key] = !!result[key] ? result[key]!.concat(page[key]!) : page[key]!;
        });
      });

      return result
    }
  })
}



export default useMediaByStatusQuery;

const fetchMediaByStatus = async ({ status, viewer, infinite, max }: Params, page: number | undefined, client: GraphQLClient) => {
  let variables = {
    userId: viewer,
    status: status,
    chunk: 1,
    perChunk: 10
  }

  if (infinite) {
    variables = {
      userId: viewer,
      status: status,
      chunk: page ?? 1,
      perChunk: 40
    }
  }


  const responses = await Promise.all(status.map(status => client.request(completed_query, { ...variables, status: [status] })));
  const lists = responses.map(res => res.collection?.lists);

  let shows: Shows = {};

  lists.forEach(list => {
    const listItem = list?.[0]
    if (!listItem || !listItem.status) return;

    const { entries, status } = listItem

    const entriesMapped: Media[] = entries?.map((entry) => {
      const media = entry?.media
      return ({
        id: media?.id!,
        title: media?.title?.userPreferred!,
        cover: media?.coverImage?.large!,
        progress: media?.mediaListEntry?.progress!,
        episodes: media?.episodes!
      });
    }) ?? []

    shows[status] = [...(shows[status] ?? []), ...entriesMapped]
  })

  return shows
}

const completed_query = graphql(`
  query CompletedQuery($userId: Int!,$status: [MediaListStatus]!, $chunk:Int, $perChunk: Int) {
    collection:MediaListCollection(
      userId: $userId
      type: ANIME
      status_in: $status
      sort: [FINISHED_ON_DESC],
      chunk: $chunk,
      perChunk: $perChunk
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