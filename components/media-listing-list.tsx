import Media from "@/interfaces/Media";
import MediaItem from "./media-item";
import useMediaByStatusQuery from "@/api/use-media-by-status-query";
import {
  StyleSheet,
  TouchableNativeFeedbackBase,
  View,
  useWindowDimensions,
} from "react-native";
import zinc from "@/utils/zinc";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import { useMemo } from "react";
import Text from "./text";
import AntDesign from "@expo/vector-icons/AntDesign";

interface Props extends Omit<FlashListProps<Media>, "renderItem" | "data"> {
  viewerId: number;
  listing: "watching" | "completed";
}

const MediaListingList = ({ viewerId, listing, ...props }: Props) => {
  const { data: shows, isPending } = useMediaByStatusQuery({
    viewer: viewerId,
    status: listing,
  });

  return (
    <View style={{ minHeight: 128 }}>
      <FlashList
        {...props}
        data={shows?.pages.flat()}
        estimatedItemSize={192 * 0.69}
        ListEmptyComponent={EmptyListing}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        scrollEnabled={false}
        renderItem={({ item }) => {
          return (
            <MediaItem type="list" key={item.id} media={item} canContinue />
          );
        }}
      />
    </View>
  );
};

const EmptyListing = () => {
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        height: 128,
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

export default MediaListingList;
