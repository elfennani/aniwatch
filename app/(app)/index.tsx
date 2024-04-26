import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useViewerQuery from "@/api/use-viewer-query";
import MediaListingGrid from "@/components/media-listing-grid";
import SectionTitle from "@/components/section-title";

type Props = {};

const HomePage = (props: Props) => {
  const { top } = useSafeAreaInsets();
  const { data: viewer, isError, isPending } = useViewerQuery();

  if (isPending) {
    return <View></View>;
  }

  if (isError) {
    return <View></View>;
  }

  return (
    <ScrollView contentContainerStyle={{ paddingTop: top + 16 }}>
      <SectionTitle style={{ paddingHorizontal: 16 }}>
        Currently Watching
      </SectionTitle>
      <MediaListingGrid
        listing="watching"
        viewerId={viewer.id}
        contentContainerStyle={{
          padding: 16,
        }}
      />

      <SectionTitle style={{ paddingHorizontal: 16 }}>
        Recently Completed
      </SectionTitle>
      <MediaListingGrid
        listing="completed"
        viewerId={viewer.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    gap: 16,
  },
});

export default HomePage;
