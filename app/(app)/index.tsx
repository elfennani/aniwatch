import {
  Modal,
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
import AntDesign from "@expo/vector-icons/AntDesign";
import Text from "@/components/text";
import { Link } from "expo-router";
import MediaListingList from "@/components/media-listing-list";
import { Image } from "expo-image";
import Skeleton from "@/components/skeleton";

type Props = {};

const HomePage = (props: Props) => {
  const { top } = useSafeAreaInsets();
  const { data: viewer, isError, isPending } = useViewerQuery();

  if (isPending) {
    return (
      <ScrollView
        contentContainerStyle={{
          paddingTop: top + 16,
          paddingHorizontal: 16,
          gap: 16,
        }}
      >
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Skeleton height={48} style={{ flex: 1 }} />
          <Skeleton width={48} height={48} />
        </View>
        <Skeleton height={32} width="59%" />
        <Skeleton height={129} />
        <Skeleton height={32} width="66%" />
        <ScrollView horizontal contentContainerStyle={{ gap: 16 }}>
          <Skeleton width={129} style={{ aspectRatio: 0.69 }} />
          <Skeleton width={129} style={{ aspectRatio: 0.69 }} />
        </ScrollView>
      </ScrollView>
    );
  }

  if (isError) {
    return <View></View>;
  }

  return (
    <ScrollView contentContainerStyle={{ paddingTop: top + 16 }}>
      <View style={styles.header}>
        <Link href={`/search`} asChild style={{ flex: 1 }}>
          <TouchableOpacity activeOpacity={0.8} style={styles.search}>
            <AntDesign name="search1" size={24} color={zinc[400]} />
            <Text style={{ color: zinc[400] }}>
              Attack on Titan Season 2...
            </Text>
          </TouchableOpacity>
        </Link>
        <Link href={`/user/${viewer.id}`} asChild>
          <TouchableOpacity>
            <Image source={{ uri: viewer.avatar }} style={styles.avatar} />
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
  header: {
    padding: 16,
    paddingTop: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: zinc[800],
  },
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
