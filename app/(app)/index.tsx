import { RefreshControl, ScrollView, StyleSheet } from "react-native";
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

const status: MediaStatus[] = ["COMPLETED", "CURRENT"];

const HomePage = () => {
  useBackgroundNotifications();
  const { top } = useSafeAreaInsets();
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

  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: top + 16 }}
      refreshControl={refreshControl}
    >
      <HomeHeader viewer={viewer} />

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: { padding: 32, gap: 16 },
  section: { paddingHorizontal: 16 },
});

export default HomePage;
