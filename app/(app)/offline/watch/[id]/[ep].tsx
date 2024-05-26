import { StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useKeepAwake } from "expo-keep-awake";
import { PlayerData, PlayerDataContext } from "@/ctx/player-data";
import Player from "@/components/player";
import useUpdateEntry from "@/hooks/use-update-entry";
import useSavedShow from "@/hooks/use-saved-show";
import useSavedShows from "@/hooks/use-saved-shows";

type Params = {
  id: string;
  ep: string;
};

const WatchByEp = () => {
  useKeepAwake();
  const params = useLocalSearchParams<Params>();
  const id = Number(params.id);
  const ep = Number(params.ep);
  const saved = useSavedShow(id);
  const [savedShows] = useSavedShows();
  const updateEntry = useUpdateEntry(ep, id, saved?.show!);

  const episodes = useMemo(() => {
    const episodes = savedShows
      ?.filter((saved) => saved.show.id == id)
      .map((savedEp) => savedEp.episode);

    const eps = saved?.show.episodes?.filter((ep) =>
      episodes?.includes(ep.number)
    );
    return eps ?? [];
  }, [id]);

  const episodeSaved = useMemo(() => {
    return savedShows?.find(
      (saved) => saved.episode == ep && saved.show.id == id
    )!;
  }, [episodes, ep]);

  const metadata: PlayerData = {
    title: saved?.show.title.default!,
    episode: ep,
    nextEpisode: episodes?.find((episode) => episode.number == ep + 1),
    id,
    dubbed: episodeSaved?.type == "dub",
  };

  return (
    <PlayerDataContext.Provider value={metadata}>
      <StatusBar hidden />
      <Stack.Screen
        options={{
          navigationBarHidden: true,
          orientation: "landscape",
        }}
      />
      <Player
        url={episodeSaved?.uri}
        threshold={0.8}
        onOverThreshold={() => updateEntry()}
      />
    </PlayerDataContext.Provider>
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
