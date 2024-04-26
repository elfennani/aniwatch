import useAniListClient from "@/hooks/use-anilist-client";
import { useMutation } from "@tanstack/react-query";
import { graphql } from "gql.tada"

interface Params {
  episode: number
  showId: number
}

const mutation = graphql(`
  mutation UPDATE_PROGRESS($progress:Int,$mediaId:Int){
    SaveMediaListEntry(mediaId: $mediaId, progress: $progress){
      id
    }
  }
`);

const useWatchedMutation = (params: Params) => {
  const { episode, showId } = params
  const client = useAniListClient();

  return useMutation({
    mutationKey: ["anilist", "watch", showId],
    mutationFn: async () => {
      await client.request(mutation, { mediaId: showId, progress: episode })
    },
  })
}

export default useWatchedMutation