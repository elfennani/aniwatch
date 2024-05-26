import React, { useMemo } from "react";
import useShowQuery from "@/api/use-show-query";
import { useLocalSearchParams } from "expo-router";
import Text from "@/components/text";
import MediaDetailsSkeleton from "@/components/skeletons/media-details";
import MediaEpisodesScreen from "@/components/screens/media-episodes-screen";

const MediaById = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: media,
    refetch,
    isRefetching,
    isPending,
    isError,
  } = useShowQuery({ id: Number(id) });

  const episodes = useMemo(
    () => media?.episodes?.sort((a, b) => a.number - b.number),
    [media]
  );

  if (isPending) return <MediaDetailsSkeleton />;
  if (isError && !media) return <Text color="failure">Error</Text>;

  return (
    <MediaEpisodesScreen
      episodes={episodes ?? []}
      media={media}
      onRefresh={refetch}
      refreshing={isRefetching}
    />
  );
};

export default MediaById;
