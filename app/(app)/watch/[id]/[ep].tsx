import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import useShowQuery from "@/api/use-show-query";
import { Stack, useLocalSearchParams } from "expo-router";
import Text from "@/components/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PlayerLoader from "@/components/player-loader";
import { StatusBar, setStatusBarHidden } from "expo-status-bar";

type Props = {};

const WatchByEp = (props: Props) => {
  const { id, ep } = useLocalSearchParams<{ id: string; ep: string }>();
  const { top } = useSafeAreaInsets();
  const { data: media, isPending, isError } = useShowQuery({ id: Number(id) });

  if (isPending) return <Text>Loading...</Text>;
  if (isError || !media.allanimeId) return <Text>Error</Text>;

  return (
    <>
      <StatusBar hidden />
      <Stack.Screen
        options={{
          navigationBarHidden: true,
          orientation: "landscape",
          // presentation: "fullScreenModal",
        }}
      />
      <PlayerLoader allAnimeId={media.allanimeId} episode={Number(ep)} />
    </>
  );
};

export default WatchByEp;

const styles = StyleSheet.create({});
