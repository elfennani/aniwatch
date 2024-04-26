import { useSession } from "@/ctx/session";
import { GraphQLClient } from "graphql-request";
import { useMemo } from "react";

const useAniListClient = () => {
  const { session } = useSession()
  const token = session?.access_token

  const client = useMemo(() => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);

    const client = new GraphQLClient("https://graphql.anilist.co", { headers });
    return client
  }, [token])

  return client
}

export default useAniListClient