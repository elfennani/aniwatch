import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useViewerQuery from "@/api/use-viewer-query";
import MediaListingGrid from "@/components/media-listing-grid";
import SectionTitle from "@/components/section-title";
import zinc from "@/utils/zinc";
import { AntDesign } from "@expo/vector-icons";
import Text from "@/components/text";
import { Link } from "expo-router";
import MediaListingList from "@/components/media-listing-list";

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
      <View style={{ padding: 16, paddingTop: 0 }}>
        <Link href={`/search`} asChild>
          <TouchableOpacity activeOpacity={0.8} style={styles.search}>
            <AntDesign name="search1" size={24} color={zinc[400]} />
            <Text style={{ color: zinc[400] }}>
              Attack on Titan Season 2...
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      <SectionTitle style={{ paddingHorizontal: 16 }}>
        Currently Watching
      </SectionTitle>
      <MediaListingList
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
  search: {
    backgroundColor: zinc[800],
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    alignItems: "center",
    borderRadius: 6,
  },
});

export default HomePage;
