import Media from "@/interfaces/Media";
import MediaItem from "./media-item";
import { View, useWindowDimensions } from "react-native";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import Text from "./text";
import { useTheme } from "@/ctx/theme-provider";
import { Iconify } from "react-native-iconify";

interface Props extends Omit<FlashListProps<Media>, "renderItem" | "data"> {
  data?: Media[];
}

const MediaListingGrid = (props: Props) => {
  const { width } = useWindowDimensions();

  return (
    <FlashList
      {...props}
      horizontal
      fadingEdgeLength={75}
      estimatedItemSize={192 * 0.69}
      estimatedListSize={{ width, height: 192 }}
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
      <Iconify
        icon="material-symbols-light:error-outline"
        color={secondary}
        size={24}
      />
      <Text color="secondary">Nothing to see</Text>
    </View>
  );
};

export default MediaListingGrid;
