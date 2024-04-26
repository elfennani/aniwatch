import useAniListClient from "@/hooks/use-anilist-client";
import Viewer from "@/interfaces/Viewer";
import { useQuery } from "@tanstack/react-query";
import { graphql } from "gql.tada";
import { GraphQLClient } from "graphql-request";

const view_query = graphql(`
  query ViewerQuery {
    user:Viewer {
      id
      avatar{medium}
      name
      about
    }
  }
`);

async function fetchUser(client: GraphQLClient) {
  await new Promise(res => setTimeout(res, 5000));
  const res = await client.request(view_query);

  if (!res.user) {
    throw new Error("Viewer not found")
  }

  const { about, avatar, id, name } = res.user
  const viewer: Viewer = {
    id,
    name,
    about: about ?? undefined,
    avatar: avatar?.medium ?? undefined
  }

  return viewer
}

const useViewerQuery = () => {
  const client = useAniListClient()

  return useQuery({
    queryKey: ["anilist", "viewer"],
    queryFn: () => fetchUser(client),
  })
}

export default useViewerQuery