import {
  View,
  useWindowDimensions,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useMemo, useRef } from "react";
import MediaHeading from "@/components/media-heading";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import useShowQuery from "@/api/use-show-query";
import { CollapsibleRef, Tabs } from "react-native-collapsible-tab-view";
import { Iconify } from "react-native-iconify";
import { purple } from "tailwindcss/colors";
import ListingItem from "@/components/listing-item";
import TagsGrid from "@/components/tags-grid";
import Text from "@/components/text";
import MediaCharacters from "@/components/media-characters";
import MediaRelations from "@/components/media-relations";
import MediaSynopsis from "@/components/media-synopsis";
import MediaActions from "@/components/media-actions";
import MediaStats from "@/components/media-stats";

const MediaById = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: media,
    refetch,
    isRefetching,
    isPending,
    isError,
  } = useShowQuery({ id: Number(id) });

  if (!media) return <Text>Loading...</Text>;

  return (
    <ScrollView className="bg-white dark:bg-black">
      <MediaHeading media={media!} />
      <View className="py-6 gap-8">
        <MediaStats
          score={media.score}
          season={media.season}
          year={media.year}
        />
        <MediaActions
          onWatch={() => router.push(`/media/${id}/episodes`)}
          onSetStatus={() => {}}
        />
        <MediaSynopsis description={media.description} />
        <MediaCharacters characters={media.mainCharacters} />
        <MediaRelations relations={media.relations} />
        <TagsGrid tags={media.tags ?? []} />
      </View>
    </ScrollView>
  );
};

export default MediaById;
