import { StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import useLinkQuery from "@/api/use-link-query";
import useWatchedMutation from "@/api/use-watched-mutation";
import { ShowDetails } from "@/interfaces/ShowDetails";
import { useMMKVString } from "react-native-mmkv";
import { Video } from "expo-av";
import Player from "./player";
import MediaStatus from "@/interfaces/MediaStatus";
import { PlayerData, PlayerDataContext } from "@/ctx/player-data";
import * as keys from "@/constants/keys";

type Props = {
  aniListId: number;
  allAnimeId: string;
  episode: number;
  dubbed: boolean;
  watched: boolean;
  media: ShowDetails;
};

type Translation = "sub" | "dub";

const PlayerLoader = ({
  allAnimeId,
  episode,
  dubbed,
  watched,
  aniListId,
  media,
}: Props) => {
  const [translation, setTranslation] = useMMKVString(keys.translationKey);
  const [quality, setQuality] = useMMKVString(keys.qualityKey, undefined);
  const updateEntry = useUpdateEntry(episode, aniListId, media);

  const type = dubbed ? (translation as Translation) ?? "sub" : "sub";
  const params = { episode: "" + episode, allAnimeId, type };
  const { data } = useLinkQuery(params);

  const uri =
    data?.find((level) => level.name == (quality ?? "auto"))?.url ||
    data?.find((level) => level.name == "auto")?.url;

  const metadata: PlayerData = {
    title: media.title.default!,
    episode,
    nextEpisode: media.episodes?.find((ep) => ep.number == episode + 1),
    id: media.id,
    qualities: data?.map((res) => res.name),
    dubbed,
  };

  return (
    <PlayerDataContext.Provider value={metadata}>
      <Player
        url={uri ?? ""}
        threshold={0.8}
        onOverThreshold={() => updateEntry()}
      />
    </PlayerDataContext.Provider>
  );
};

const useUpdateEntry = (episode: number, id: number, media: ShowDetails) => {
  const updatedEntry = useRef(false);
  const { mutate, isPending, isSuccess } = useWatchedMutation(
    { episode, showId: id },
    media.status != "COMPLETED",
    () => updatedEntry.current == true
  );

  function update() {
    if (
      updatedEntry.current ||
      media.status == "COMPLETED" ||
      (media.progress ?? 0) >= episode ||
      isPending ||
      isSuccess
    )
      return;
    mutate();
  }

  return update;
};

export default PlayerLoader;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "black",
    width: "100%",
    height: "100%",
  },
});
