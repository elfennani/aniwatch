import useAniListClient from "@/hooks/use-anilist-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

const useWatchedMutation = (params: Params, onSuccess?: () => void) => {
  const { episode, showId } = params
  const client = useAniListClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["anilist", "watch", showId],
    mutationFn: async () => {
      await client.request(mutation, { mediaId: showId, progress: episode })
    },
    onSuccess: () => {
      onSuccess?.()
      queryClient.refetchQueries({
        predicate: ({ queryKey }) => queryKey.includes("show")
      })
    }
  })
}

export default useWatchedMutation