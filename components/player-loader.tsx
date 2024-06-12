import { StyleSheet } from "react-native";
import React from "react";
import useLinkQuery from "@/api/use-link-query";
import { ShowDetails } from "@/interfaces/ShowDetails";
import { useMMKVString } from "react-native-mmkv";
import Player from "./player";
import { PlayerData, PlayerDataContext } from "@/ctx/player-data";
import * as keys from "@/constants/keys";
import useUpdateEntry from "@/hooks/use-update-entry";

export type PlayerLoaderProps = {
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
}: PlayerLoaderProps) => {
  const [translation, setTranslation] = useMMKVString(keys.translationKey);
  const [quality, setQuality] = useMMKVString(keys.qualityKey);
  const updateEntry = useUpdateEntry(episode, aniListId, media);

  const type = dubbed ? (translation as Translation) ?? "sub" : "sub";
  const params = { episode: "" + episode, allAnimeId, type };
  const { data } = useLinkQuery(params);

  let uri =
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

export default PlayerLoader;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "black",
    width: "100%",
    height: "100%",
  },
});
