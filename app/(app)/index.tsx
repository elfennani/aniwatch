import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import React, { Suspense } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useViewerQuery from "@/api/use-viewer-query";
import MediaListingGrid from "@/components/media-listing-grid";
import SectionTitle from "@/components/section-title";
import Text from "@/components/text";
import zinc from "@/utils/zinc";
import AntDesign from "@expo/vector-icons/AntDesign";

type Props = {};

const HomePage = (props: Props) => {
  const { top, bottom } = useSafeAreaInsets();
  const { data: viewer, isError, isPending, refetch } = useViewerQuery();
  const { width } = useWindowDimensions();

  if (isPending) {
    return <View></View>;
  }

  if (isError) {
    return <View></View>;
  }

  return (
    <View style={{ flex: 1, paddingTop: top + 16 }}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    gap: 16,
  },
});

export default HomePage;
