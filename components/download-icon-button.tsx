import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Iconify } from "react-native-iconify";
import { purple } from "tailwindcss/colors";
import useSavedQueue from "@/hooks/use-saved-queue";
import useSavedCurrent from "@/hooks/use-saved-current";
import useSavedShows from "@/hooks/use-saved-shows";
import { Episode } from "@/interfaces/Episode";
import DownloadItem from "@/interfaces/DownloadItem";

type Props = {
  mediaId: number;
  episode: Episode;
  onPress: () => void;
};

const DownloadIconButton = ({ onPress, episode, mediaId }: Props) => {
  const [queue] = useSavedQueue();
  const [current] = useSavedCurrent();
  const [saved, setSavedShows] = useSavedShows();

  const compare = (item: DownloadItem) =>
    item.mediaId == mediaId && item.episode == episode.number;

  const inQueue = queue?.some(compare);
  const isCurrent = current ? compare(current) : false;
  const inSaved = saved?.some(compare);
  if (inQueue || isCurrent || inSaved)
    return (
      <Iconify
        icon="material-symbols-light:downloading"
        size={24}
        color={purple[400]}
      />
    );

  if (inSaved)
    return (
      <Iconify
        icon="material-symbols-light:download-done"
        size={24}
        color={purple[400]}
      />
    );

  return (
    <TouchableOpacity hitSlop={16} onPress={onPress}>
      <Iconify
        icon="material-symbols-light:download"
        size={24}
        color={purple[400]}
      />
    </TouchableOpacity>
  );
};

export default DownloadIconButton;
