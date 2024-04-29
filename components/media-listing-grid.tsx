import Media from "@/interfaces/Media";
import MediaItem from "./media-item";
import useMediaByStatusQuery from "@/api/use-media-by-status-query";
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import zinc from "@/utils/zinc";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import { useMemo } from "react";
import Text from "./text";
import AntDesign from "@expo/vector-icons/AntDesign";
import Skeleton from "./skeleton";

interface Props extends Omit<FlashListProps<Media>, "renderItem" | "data"> {
  viewerId: number;
  listing: "watching" | "completed";
}

const MediaListingGrid = ({ viewerId, listing, ...props }: Props) => {
  const { data: shows, isPending } = useMediaByStatusQuery({
    viewer: viewerId,
    status: listing,
  });

  if (isPending) {
    return (
      <View style={{ padding: 16 }}>
        <ScrollView horizontal contentContainerStyle={{ gap: 16 }}>
          <Skeleton width={129} style={{ aspectRatio: 0.69 }} />
          <Skeleton width={129} style={{ aspectRatio: 0.69 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <FlashList
      {...props}
      horizontal
      data={shows?.pages.flat()}
      estimatedItemSize={192 * 0.69}
      ListEmptyComponent={EmptyListing}
      ItemSeparatorComponent={() => (
        <View style={{ height: 192 * 0.69, width: 16 }} />
      )}
      renderItem={({ item }) => {
        return <MediaItem type="grid" key={item.id} media={item} />;
      }}
    />
  );
};

const EmptyListing = () => {
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        height: 192,
        width: width - 32,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <AntDesign name="meho" color={zinc[500]} size={32} />
      <Text style={{ color: zinc[500] }}>Nothing to see</Text>
    </View>
  );
};

export default MediaListingGrid;
