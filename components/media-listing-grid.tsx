import Media from "@/interfaces/Media";
import MediaItem from "./media-item";
import useMediaByStatusQuery from "@/api/use-media-by-status-query";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import Text from "./text";
import AntDesign from "@expo/vector-icons/AntDesign";
import Skeleton from "./skeleton";
import { useTheme } from "@/ctx/theme-provider";

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
  const {
    colors: { secondary },
  } = useTheme();
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
      <AntDesign name="meho" color={secondary} size={32} />
      <Text color="secondary">Nothing to see</Text>
    </View>
  );
};

export default MediaListingGrid;
