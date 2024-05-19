import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useCallback } from "react";
import ShowRelation from "@/interfaces/ShowRelation";
import Section from "./section";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { Link } from "expo-router";
import { ImageBackground } from "expo-image";
import Text from "./text";
import { useTheme } from "@/ctx/theme-provider";

type Props = {
  relations: ShowRelation[];
};

const MediaRelations = ({ relations }: Props) => {
  const { width } = useWindowDimensions();

  const renderItem: ListRenderItem<ShowRelation> = useCallback(
    ({ item }) => <MediaRelationItem relation={item} />,
    []
  );

  const separator = useCallback(
    () => <View style={{ width: 16, height: 16 }} />,
    []
  );

  return (
    <Section title="Relations" titlePaddingOnly>
      <FlashList
        data={relations}
        horizontal
        contentContainerStyle={{ paddingHorizontal: 32 }}
        fadingEdgeLength={75}
        estimatedItemSize={132.48}
        estimatedListSize={{ height: 192, width }}
        ItemSeparatorComponent={separator}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </Section>
  );
};

const MediaRelationItem = ({
  relation: { title, cover, id, relationType, type },
}: {
  relation: ShowRelation;
}) => {
  const {
    colors: { card },
  } = useTheme();
  return (
    <Link href={`/media/${id}` as any} asChild>
      <TouchableOpacity activeOpacity={0.8}>
        <ImageBackground
          cachePolicy="memory-disk"
          recyclingKey={id.toString()}
          source={{ uri: cover }}
          style={[styles.gridThumbnail, { backgroundColor: card }]}
          contentFit="cover"
        >
          <View style={styles.gridInfo}>
            <Text numberOfLines={3} variant="label" style={{ color: "white" }}>
              {title}
            </Text>
            <Text variant="small" color="primary">
              {type}
            </Text>
            <Text variant="small" color="primary">
              {relationType}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Link>
  );
};

export default MediaRelations;

const styles = StyleSheet.create({
  gridInfo: { backgroundColor: "rgba(0,0,0,0.66)", padding: 8, gap: 4 },
  gridThumbnail: {
    aspectRatio: 0.69,
    height: 192,
    borderRadius: 6,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
});
