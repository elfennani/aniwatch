import useAniListClient from "@/hooks/use-anilist-client";
import Character from "@/interfaces/Character";
import Language from "@/interfaces/Language";
import { useInfiniteQuery } from "@tanstack/react-query";
import { graphql } from "gql.tada";
import { GraphQLClient } from "graphql-request";

interface Params {
  lang: Language
  mediaId: number;
}

const useCharactersQuery = (params: Params) => {
  const client = useAniListClient();

  return useInfiniteQuery({
    queryKey: ["media", "characters", params],
    queryFn: ({ pageParam }) => fetchCharacters(client, params, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, __, lastParam) => {
      if (lastPage.hasNextPage)
        return lastParam + 1;
    },
    select: (data) => data.pages.flatMap(p => p.characters),
  })
}

export default useCharactersQuery;

async function fetchCharacters(client: GraphQLClient, params: Params, page: number) {
  const result = await client.request(query, { ...params, page })
  const characters: Character[] = result.media?.characters?.edges?.map(ch => ({
    id: ch?.id!,
    fullName: ch?.node?.name?.userPreferred ?? ch?.node?.name?.full!,
    role: ch?.role!,
    image: ch?.node?.image?.large ?? undefined,
    actors: ch?.voiceActorRoles?.map(actor => ({
      id: actor?.voiceActor?.id!,
      role: actor?.roleNotes ?? undefined,
      name: actor?.voiceActor?.name?.userPreferred ?? actor?.voiceActor?.name?.full!,
      image: actor?.voiceActor?.image?.medium ?? undefined
    })) ?? []
  })) ?? []

  return { characters, hasNextPage: result.media?.characters?.pageInfo?.hasNextPage ?? true }
}

const query = graphql(`
  query GetCharacters($lang: StaffLanguage!, $mediaId: Int!, $page: Int!){
    media:Media(id: $mediaId){
      characters(page: $page, perPage: 20){
        pageInfo{
          hasNextPage
        }
        edges{
          id
          role
          voiceActorRoles(language: $lang){
            roleNotes
            voiceActor{
              id
              name{
                userPreferred
                full
              }
              image{
                medium
              }
            }
          }
          node{
            image{
              large
            }
            name{
              userPreferred
              full
            }
          }
        }
      }
    }
  }
`)