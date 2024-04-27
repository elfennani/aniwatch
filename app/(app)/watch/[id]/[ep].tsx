import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import useShowQuery from "@/api/use-show-query";
import { Stack, useLocalSearchParams } from "expo-router";
import Text from "@/components/text";
import PlayerLoader from "@/components/player-loader";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { useKeepAwake } from "expo-keep-awake";

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
        aniListId={media.id}
        allAnimeId={media.allanimeId}
        watched={(media.progress ?? 0) >= Number(ep)}
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
