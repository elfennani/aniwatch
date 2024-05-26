import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo } from "react";
import useSavedShow from "@/hooks/use-saved-show";
import { router, useLocalSearchParams } from "expo-router";
import MediaEpisodesScreen from "@/components/screens/media-episodes-screen";
import useSavedShows from "@/hooks/use-saved-shows";
import { Episode } from "@/interfaces/Episode";

type Props = {};

const OfflineMedia = (props: Props) => {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Number(params.id);
  const [savedShows] = useSavedShows();
  const saved = useSavedShow(id);

  useEffect(() => {
    if (!saved) router.canGoBack() && router.back();
  }, [saved]);

  const episodes = useMemo(() => {
    const episodesSaved = savedShows?.filter((saved) => saved.show.id == id);
    const episodesSavedNumbers = episodesSaved?.map(
      (savedEp) => savedEp.episode
    );

    const eps = saved?.show.episodes?.filter((ep) =>
      episodesSavedNumbers?.includes(ep.number)
    );
    return (
      eps?.map((ep) => ({
        ...ep,
        downloadTranslation: episodesSaved?.find(
          (saved) => saved.episode == ep.number
        )?.type,
      })) ?? []
    );
  }, [id, savedShows]);

  if (!saved) return;

  return <MediaEpisodesScreen media={saved.show} episodes={episodes} local />;
};

export default OfflineMedia;

const styles = StyleSheet.create({});
