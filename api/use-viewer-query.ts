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
      unreadNotificationCount
    }
  }
`);

export async function fetchViewer(client: GraphQLClient) {
  const res = await client.request(view_query);

  if (!res.user) {
    throw new Error("Viewer not found")
  }

  const { about, avatar, id, name } = res.user
  const viewer: Viewer = {
    id,
    name,
    about: about ?? undefined,
    avatar: avatar?.medium ?? undefined,
    notifications: res.user.unreadNotificationCount ?? 0
  }

  return viewer
}

const useViewerQuery = () => {
  const client = useAniListClient()

  return useQuery({
    queryKey: ["anilist", "viewer"],
    queryFn: () => fetchViewer(client),
  })
}

export default useViewerQuery