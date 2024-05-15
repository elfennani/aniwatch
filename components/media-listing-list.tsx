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

const ITEM_SIZE = 192 * 0.69;

const MediaListingList = (props: Props) => {
  const { width } = useWindowDimensions();
  const height = props.data?.length
    ? props.data.length * (ITEM_SIZE + 16) - 16
    : 128;
  return (
    <View
      style={{
        minHeight: height,
      }}
    >
      <FlashList
        {...props}
        estimatedItemSize={ITEM_SIZE}
        ListEmptyComponent={EmptyListing}
        estimatedListSize={{
          width,
          height,
        }}
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
  const {
    colors: { secondary },
  } = useTheme();
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
      <Iconify
        icon="material-symbols-light:error-outline"
        color={secondary}
        size={24}
      />{" "}
      <Text color="secondary">Nothing to see</Text>
    </View>
  );
};

export default MediaListingList;
