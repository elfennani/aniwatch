import useAniListClient from "@/hooks/use-anilist-client";
import Media from "@/interfaces/Media";
import { useQuery } from "@tanstack/react-query";
import { graphql, VariablesOf } from "gql.tada";
import { GraphQLClient } from "graphql-request";

type Params = VariablesOf<typeof home_query>;

const useHomeMedia = (params: Params, disabled = false) => {
  const client = useAniListClient();

  return useQuery({
    queryKey: ["home", "media", params],
    queryFn: ({ pageParam }) => fetchHomeMedia(params, client),
    enabled: !disabled,
  })
}

export default useHomeMedia;

const fetchHomeMedia = async (params: Params, client: GraphQLClient) => {
  const result = await client.request(home_query, params)
  type ResultKey = (keyof typeof result)

  return (Object.keys(result)).reduce((prev, page) => {
    return {
      ...prev, [page]: result[page as ResultKey]?.mediaList?.map((entry): Media => ({
        id: entry?.media?.id!,
        title: entry?.media?.title?.userPreferred!,
        episodes: entry?.media?.episodes ?? NaN,
        progress: entry?.media?.mediaListEntry?.progress ?? 0,
        cover: entry?.media?.coverImage?.medium!,
        hdCover: entry?.media?.coverImage?.extraLarge ?? undefined,
      }))
    }
  }, {} as Record<ResultKey, Media[]>)
}

const home_query = graphql(`
  query CompletedQuery($userId: Int!) {
    Watching: Page(perPage: 100){
      mediaList(userId: $userId, type: ANIME, status_in: [CURRENT, REPEATING], sort: UPDATED_TIME_DESC){
        media {
          ...SimpleMedia
        }
      }
    }

    Completed: Page(perPage: 10){
      mediaList(userId: $userId, type: ANIME, status: COMPLETED, sort: [FINISHED_ON,UPDATED_TIME_DESC]){
        media {
          ...SimpleMedia
        }
      }
    }
    
    Planned: Page(perPage: 10){
      mediaList(userId: $userId, type: ANIME, status: PLANNING, sort: ADDED_TIME_DESC){
        media {
          ...SimpleMedia
        }
      }
    }
  }

  fragment SimpleMedia on Media{
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
    } 
  }
`);