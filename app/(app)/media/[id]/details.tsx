import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React, { useEffect } from "react";
import useShowQuery from "@/api/use-show-query";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/text";
import RenderHtml from "react-native-render-html";
import Section from "@/components/section";
import TagsGrid from "@/components/tags-grid";
import MediaRelations from "@/components/media-relations";
import { useTheme } from "@/ctx/theme-provider";
import CharactersSection from "@/components/characters-section";
import MediaHeading from "@/components/media-heading";
import MediaDetailsSkeleton from "@/components/skeletons/media-details";

type Props = {};

const MediaById = (props: Props) => {
  const { top } = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: media,
    refetch,
    isRefetching,
    isPending,
    isError,
    error,
  } = useShowQuery({ id: Number(id) });
  const { width } = useWindowDimensions();
  const theme = useTheme();

  useEffect(() => {
    error && console.log(error);
  }, [error]);

  if (isPending) return <MediaDetailsSkeleton />;
  if (isError) return <Text color="failure">Error</Text>;

  return (
    <ScrollView
      nestedScrollEnabled
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          progressViewOffset={top}
        />
      }
    >
      <MediaHeading media={media} />
      {media.description && (
        <Section title="Synopsis">
          <RenderHtml
            contentWidth={width - 64}
            systemFonts={["regular"]}
            baseStyle={{
              fontFamily: "regular",
              color: theme.colors.foreground,
              fontSize: 12,
              lineHeight: 19.25,
            }}
            source={{ html: media.description }}
          />
        </Section>
      )}
      <CharactersSection mediaId={media.id} characters={media.mainCharacters} />
      {!!media.relations.length && (
        <MediaRelations relations={media.relations} />
      )}
      {media.tags && <TagsGrid tags={media.tags} />}
    </ScrollView>
  );
};

export default MediaById;

const styles = StyleSheet.create({});
