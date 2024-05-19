import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React, { useCallback, useMemo } from "react";
import useShowQuery from "@/api/use-show-query";
import { router, useLocalSearchParams } from "expo-router";
import Text from "@/components/text";
import EpsiodeItem from "@/components/epsiode-item";
import { Link } from "expo-router";
import { useTheme } from "@/ctx/theme-provider";
import Box from "@/components/box";
import MediaHeading from "@/components/media-heading";
import MediaDetailsSkeleton from "@/components/skeletons/media-details";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import theme from "@/constants/theme";
import { ShowDetails } from "@/interfaces/ShowDetails";
import { Iconify } from "react-native-iconify";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Episode } from "@/interfaces/Episode";

type Props = {};

const MediaById = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width, height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const {
    data: media,
    refetch,
    isRefetching,
    isPending,
    isError,
  } = useShowQuery({ id: Number(id) });
  const theme = useTheme();

  const episodes = useMemo(
    () => media?.episodes?.sort((a, b) => a.number - b.number),
    [media]
  );

  const renderItem: ListRenderItem<Episode> = useCallback(
    ({ item: ep }) => (
      <Box paddingHorizontal="2xl">
        <Link
          key={ep.id}
          href={`/watch/${media?.id}/${ep.number}` as any}
          asChild
        >
          {media && (
            <EpsiodeItem
              episode={ep}
              mediaId={media.id}
              watched={(media.progress ?? 0) >= ep.number}
            />
          )}
        </Link>
      </Box>
    ),
    [media]
  );

  if (isPending) return <MediaDetailsSkeleton />;
  if (isError) return <Text color="failure">Error</Text>;

  return (
    <FlashList
      data={episodes}
      keyExtractor={(item) => item.id}
      estimatedItemSize={69.75}
      estimatedListSize={{ width, height }}
      contentContainerStyle={{ paddingBottom: bottom + theme.spacing.lg }}
      ListHeaderComponent={<Header media={media} />}
      ItemSeparatorComponent={() => <Box height="md" />}
      refreshing={isRefetching}
      onRefresh={refetch}
      renderItem={renderItem}
    />
  );
};

interface HeaderProps {
  media: ShowDetails;
}

const Header = ({ media }: HeaderProps) => {
  const theme = useTheme();
  return (
    <>
      <MediaHeading media={media} />
      <Box
        row
        paddingHorizontal="2xl"
        style={{ marginTop: -theme.spacing["2xl"] }}
        gap="md"
      >
        <StatusButton media={media} />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push(`/media/${media.id}/details`)}
        >
          <Box
            flex
            style={styles.button}
            row
            rounding="xs"
            gap="sm"
            height="3xl"
            width="3xl"
          >
            <Iconify
              icon="material-symbols-light:info-outline"
              color={theme.colors.primary}
              size={24}
            />
          </Box>
        </TouchableOpacity>
      </Box>
      <Box paddingHorizontal="2xl" paddingVertical="lg">
        <Text variant="label">Episodes</Text>
      </Box>
    </>
  );
};

interface StatusButtonProps {
  media: ShowDetails;
}

const StatusButton = ({ media }: StatusButtonProps) => {
  let label = "Set Status";
  let icon = (
    <Iconify icon="material-symbols-light:add" color="white" size={18} />
  );

  if (media.status) {
    icon = (
      <Iconify icon="material-symbols-light:edit" color="white" size={18} />
    );
  }

  const { status } = media;

  if (status == "CURRENT") {
    label = `Watching   ${media.progress ?? 0}/${media.episodesCount}`;
  } else if (status == "REPEATING") {
    label = `Rewatching ${media.progress ?? 0}/${media.episodesCount}`;
  } else if (!!status) {
    label = status;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ flex: 1 }}
      onPress={() => router.push(`/media/${media.id}/status`)}
    >
      <Box
        flex
        style={styles.button}
        row
        rounding="xs"
        height="3xl"
        gap="sm"
        background="primary"
      >
        {icon}
        <Text
          variant="label"
          color="white"
          style={{ textTransform: "capitalize" }}
        >
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

export default MediaById;

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
