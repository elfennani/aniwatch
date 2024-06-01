import useAniListClient from "@/hooks/use-anilist-client"
import User from "@/interfaces/User";
import { useQuery } from "@tanstack/react-query";
import { graphql } from "gql.tada"
import { GraphQLClient } from "graphql-request";

interface Params {
  id: number
}

const useUserQuery = (params: Params) => {
  const client = useAniListClient();

  return useQuery({
    queryKey: ["user", params],
    queryFn: () => fetchUser(params, client),
  })
}

export default useUserQuery

async function fetchUser(params: Params, client: GraphQLClient): Promise<User> {
  const user = (await client.request(query, params)).user

  if (!user)
    throw new Error("User not found");

  return {
    id: user.id,
    name: user.name,
    about: user.about ?? undefined,
    avatar: user.avatar?.large ?? undefined,
    banner: user.bannerImage ?? undefined,
    chaptersRead: user.statistics?.manga?.chaptersRead,
    completedAnime: user.statistics?.anime?.statuses?.find(status => status?.status == "COMPLETED")?.count,
    completedManga: user.statistics?.manga?.statuses?.find(status => status?.status == "COMPLETED")?.count,
    episodesWatched: user.statistics?.anime?.episodesWatched,
    daysWatched: user.statistics?.anime?.minutesWatched && user.statistics.anime.minutesWatched / (24 * 60),
    totalAnime: user.statistics?.anime?.count,
    totalManga: user.statistics?.manga?.count,
    meanScore: user.statistics?.anime?.meanScore,
    mangaMeanScore: user.statistics?.manga?.meanScore,
    volumesRead: user.statistics?.manga?.volumesRead,
  }
}


const query = graphql(`
  query GetUserById($id:Int!){
    user:User(id:$id){
      id
      name
      bannerImage
      about(asHtml: true)
      avatar{
        large
      }
      statistics{
        anime{
          count
          meanScore
          episodesWatched
          minutesWatched
          statuses{
            count
            status
          }
        }
        manga{
          count
          meanScore
          chaptersRead
          volumesRead
          statuses{
            count
            status
          }
        }
      }
    }
  }
`)

