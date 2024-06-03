import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Player from "@/components/player";
import useUpdateEntry from "@/hooks/use-update-entry";
import useShowQuery from "@/api/use-show-query";

type Params = { uri: string; id: string; ep: string };

const OfflineWatchPage = () => {
  const { uri, ep, id } = useLocalSearchParams<Params>();
  const { data: media } = useShowQuery({ id: Number(id) });
  const updateEntry = useUpdateEntry(Number(ep), Number(ep), media!);

  return (
    <>
      <StatusBar hidden />
      <Stack.Screen
        options={{
          navigationBarHidden: true,
          orientation: "landscape",
        }}
      />
      <Player
        url={uri ?? ""}
        threshold={0.8}
        onOverThreshold={() => updateEntry()}
      />
    </>
  );
};

export default OfflineWatchPage;
