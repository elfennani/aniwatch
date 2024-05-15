import useAniListClient from '@/hooks/use-anilist-client';
import MediaDate from '@/interfaces/MediaDate';
import MediaStatus from '@/interfaces/MediaStatus';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { graphql } from 'gql.tada';
import { GraphQLClient } from 'graphql-request';

interface StatusMutationParams {
  status: MediaStatus | undefined;
  score: number | undefined;
  progress: number | undefined;
  start: MediaDate | undefined;
  end: MediaDate | undefined;
}

const mutation = graphql(`
  mutation UPDATE_STATUS(
    $progress:Int,
    $mediaId:Int!, 
    $status: MediaListStatus, 
    $score:Float, 
    $startedAt: FuzzyDateInput, 
    $completedAt: FuzzyDateInput
  ){
    SaveMediaListEntry(
      mediaId: $mediaId, 
      progress: $progress, 
      status: $status,
      score: $score, 
      startedAt: $startedAt, 
      completedAt: $completedAt
    ){
      id
    }
  }
`);

const useStatusMutation = (mediaId: number) => {
  const client = useAniListClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["status", "update", mediaId],
    mutationFn: (params: StatusMutationParams) => updateStatus(mediaId, params, client),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey.includes(mediaId)
      })
    }
  })
}

async function updateStatus(mediaId: number, params: StatusMutationParams, client: GraphQLClient) {
  const { end, progress, start, score, status } = params
  await client.request(mutation, {
    mediaId: mediaId,
    status: status,
    score: score,
    progress,
    startedAt: start,
    completedAt: end,
  })
}

export default useStatusMutation