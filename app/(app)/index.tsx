import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useViewerQuery from "@/api/use-viewer-query";
import MediaListingGrid from "@/components/media-listing-grid";
import SectionTitle from "@/components/section-title";
import MediaListingList from "@/components/media-listing-list";
import HomeSkeleton from "@/components/skeletons/home";
import useMediaByStatusQuery from "@/api/use-media-by-status-query";
import MediaStatus from "@/interfaces/MediaStatus";
import useBackgroundNotifications from "@/hooks/use-background-notifications";
import HomeHeader from "@/components/home-header";
import ErrorScreen from "@/components/error-screen";
import useSavedShows from "@/hooks/use-saved-shows";
import { ShowDetails } from "@/interfaces/ShowDetails";
import Media from "@/interfaces/Media";
import Button from "@/components/button";
import { storage } from "@/utils/mmkv";
import * as FileSystem from "expo-file-system";
import { SHOWS_DIR, TEMP_DIR } from "@/constants/values";
import { router } from "expo-router";

const status: MediaStatus[] = ["COMPLETED", "CURRENT"];

const HomePage = () => {
  useBackgroundNotifications();
  const { top } = useSafeAreaInsets();
  const [savedShows] = useSavedShows();
  const {
    data: viewer,
    isError: isViewerError,
    isPending: isViewerPending,
    isRefetching: isViewerRefetching,
    refetch: refetchViewer,
    error: viewerError,
  } = useViewerQuery();
  const {
    data: media,
    isError: isMediaError,
    isPending: isMediaPending,
    isRefetching: isMediaRefetching,
    refetch: refetchMedia,
    error: mediaError,
  } = useMediaByStatusQuery(
    { viewer: viewer?.id!, status, infinite: false, max: 10 },
    !viewer
  );

  const saved: Media[] = useMemo(() => {
    const saved: ShowDetails[] = [];

    savedShows?.forEach((savedShow) => {
      if (saved.findIndex((saved) => saved.id == savedShow.show.id) == -1) {
        saved.push(savedShow.show);
      }
    });

    const savedToMediaList = saved.map(
      (show): Media => ({
        id: show.id,
        cover: show.cover!,
        episodes: show.episodesCount ?? NaN,
        progress: show.progress ?? NaN,
        title:
          show.title.default ??
          show.title.english ??
          show.title.native ??
          show.title.romaji!,
      })
    );

    return savedToMediaList;
  }, [savedShows]);

  function refetch() {
    refetchMedia();
    refetchViewer();
  }

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={isMediaRefetching || isViewerRefetching}
        onRefresh={refetch}
      />
    ),
    [isMediaRefetching, isViewerRefetching]
  );

  if (isViewerPending || isMediaPending) {
    return <HomeSkeleton />;
  }

  if (!viewer && isViewerError)
    return (
      <ErrorScreen
        error={viewerError}
        isRetrying={isViewerPending || isViewerRefetching}
        onRetry={refetchViewer}
      />
    );

  if (!media && isMediaError)
    return (
      <ErrorScreen
        error={mediaError}
        isRetrying={isMediaPending || isMediaRefetching}
        onRetry={refetchMedia}
      />
    );

  const deleteAll = async () => {
    storage.delete("saved-shows");
    storage.delete("downloads");
    storage.delete("current-download");

    await FileSystem.deleteAsync(TEMP_DIR);
    await FileSystem.deleteAsync(SHOWS_DIR);
    ToastAndroid.show("Deleted everything", ToastAndroid.SHORT);
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: top + 16 }}
      refreshControl={refreshControl}
    >
      <HomeHeader viewer={viewer} />

      {process.env.NODE_ENV == "development" && (
        <>
          <Button
            label="Check Files"
            onPress={() =>
              router.push({
                pathname: "/file-browser/[path]",
                params: { path: FileSystem.documentDirectory },
              })
            }
          />
          <Button label="Delete All" onPress={deleteAll} />
        </>
      )}

      <SectionTitle style={styles.section}>Currently Watching</SectionTitle>
      <MediaListingList
        data={media.CURRENT}
        contentContainerStyle={{ padding: 16 }}
      />

      <SectionTitle style={styles.section}>Recently Completed</SectionTitle>
      <MediaListingGrid
        data={media.COMPLETED}
        contentContainerStyle={{ padding: 16 }}
      />

      {!!saved.length && (
        <>
          <SectionTitle style={styles.section}>Downloaded Shows</SectionTitle>
          <MediaListingGrid
            data={saved}
            contentContainerStyle={{ padding: 16 }}
            local
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: { padding: 32, gap: 16 },
  section: { paddingHorizontal: 16 },
});

export default HomePage;
