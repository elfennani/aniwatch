import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import React from "react";
import useShowQuery from "@/api/use-show-query";
import { Stack, useLocalSearchParams } from "expo-router";
import PlayerLoader from "../../../../components/player-loader";
import { StatusBar } from "expo-status-bar";
import { useKeepAwake } from "expo-keep-awake";
import ErrorScreen from "@/components/error-screen";
import MediaEpisodesScreen from "../../media/[id]/episodes";

type Params = {
  id: string;
  ep: string;
};

const WatchByEp = () => {
  const { id, ep } = useLocalSearchParams<Params>();
  const {
    data: media,
    isPending,
    error,
    isError,
    refetch,
    isRefetching,
    isFetching,
  } = useShowQuery({ id: Number(id) });

  if (isPending || (media && !media.allanimeId))
    return (
      <View style={styles.background}>
        <ActivityIndicator size={40} color="white" />
      </View>
    );

  if (isError && !media) {
    return (
      <ErrorScreen
        error={error}
        isRetrying={isFetching || isFetching || isPending}
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <main className="container mx-auto py-8 flex gap-2 items-start">
        <div className="flex-1 flex flex-col gap-4">
          <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
            <PlayerLoader
              media={media}
              aniListId={media.id}
              allAnimeId={media.allanimeId!}
              watched={(media.progress ?? 0) >= Number(ep)}
              episode={Number(ep)}
              dubbed={
                media.episodes?.some(
                  (episode) => episode.number == Number(ep) && episode.dub
                ) ?? false
              }
            />
          </div>
          <h1 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
            {media.title.default} • Episode {ep}
          </h1>
        </div>
        <aside className="w-[500px]">
          <h1 className="text-2xl text-zinc-700 dark:text-zinc-300 font-semibold px-6 mb-8">
            Episodes
          </h1>
          <MediaEpisodesScreen dynamic />
        </aside>
      </main>
    </div>
  );
};

export default WatchByEp;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "black",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
