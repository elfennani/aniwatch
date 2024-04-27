import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import useShowQuery from "@/api/use-show-query";
import { Stack, useLocalSearchParams } from "expo-router";
import Text from "@/components/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PlayerLoader from "@/components/player-loader";
import { StatusBar, setStatusBarHidden } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { useKeepAwake } from "expo-keep-awake";
import MusicControl from "react-native-music-control";

type Props = {};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowAlert: false,
  }),
});

const WatchByEp = (props: Props) => {
  const { id, ep } = useLocalSearchParams<{ id: string; ep: string }>();
  const { top } = useSafeAreaInsets();
  const { data: media, isPending, isError } = useShowQuery({ id: Number(id) });
  useKeepAwake();

  useEffect(() => {
    setupPlayer();
  }, []);

  async function setupPlayer() {}

  if (isPending) return <Text>Loading...</Text>;
  if (isError || !media.allanimeId) return <Text>Error</Text>;

  return (
    <>
      <StatusBar hidden />
      <Stack.Screen
        options={{
          navigationBarHidden: true,
          orientation: "landscape",
        }}
      />
      <PlayerLoader
        allAnimeId={media.allanimeId}
        episode={Number(ep)}
        dubbed={
          media.episodes?.some(
            (episode) => episode.number == Number(ep) && episode.dub
          ) ?? false
        }
      />
    </>
  );
};

export default WatchByEp;

const styles = StyleSheet.create({});
