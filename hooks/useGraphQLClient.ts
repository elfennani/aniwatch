import { useSession } from "@/ctx/session"
import { GraphQLClient } from "graphql-request"

const useGraphQLClient = () => {
  const { session } = useSession()
  const headers = new Headers()
  headers.append("Authorization", `Bearer ${session?.access_token}`)

  return new GraphQLClient("https://graphql.anilist.co", {
    headers
  })
}

export default useGraphQLClient