import {
  Alert,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { router } from "expo-router";
import Text from "@/components/text";
import EpsiodeItem from "@/components/epsiode-item";
import { Link } from "expo-router";
import { useTheme } from "@/ctx/theme-provider";
import Box from "@/components/box";
import MediaHeading from "@/components/media-heading";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import theme from "@/constants/theme";
import { ShowDetails } from "@/interfaces/ShowDetails";
import { Iconify } from "react-native-iconify";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Episode } from "@/interfaces/Episode";
import useDownloads from "@/hooks/use-downloads";
import BottomSheet from "../bottom-sheet";
import useSavedShows from "@/hooks/use-saved-shows";
import useSavedShow from "@/hooks/use-saved-show";
import { useDownloadManager } from "@/ctx/download-manager";

type Props = {
  media: ShowDetails;
  episodes: Episode[];
  refreshing?: boolean;
  onRefresh?: () => void;
  local?: boolean;
};

const MediaEpisodesScreen = ({
  media,
  onRefresh,
  refreshing,
  episodes,
  local = false,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const [downloads] = useDownloads();
  const { push } = useDownloadManager();
  const [saved, _, deleteSavedShow] = useSavedShows();
  const { bottom } = useSafeAreaInsets();
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>();
  const savedEpisode = useSavedShow(media.id, selectedEpisode?.number);

  const { colors, spacing } = useTheme();

  const canDownloadEpisodes = useCallback(
    (ep: number) => {
      const allEpisodes = [...(saved ?? []), ...(downloads ?? [])];
      return !allEpisodes.some(
        (downloadable) =>
          downloadable.show.id == media.id && downloadable.episode == ep
      );
    },
    [saved, downloads]
  );

  const renderItem: ListRenderItem<Episode> = useCallback(
    ({ item: ep }) => {
      return (
        <Box paddingHorizontal="2xl">
          <Link
            key={ep.id}
            href={{
              pathname: local ? "/offline/watch/[id]/[ep]" : "/watch/[id]/[ep]",
              params: {
                id: media?.id,
                ep: ep.number,
              },
            }}
            asChild
          >
            <EpsiodeItem
              episode={ep}
              mediaId={media.id}
              watched={(media.progress ?? 0) >= ep.number}
              onLongPress={() => setSelectedEpisode(ep)}
            />
          </Link>
        </Box>
      );
    },
    [media, local]
  );

  const closeModal = () => setSelectedEpisode(undefined);

  const download = (type: "sub" | "dub") => () => {
    const canDownload =
      !local && selectedEpisode && canDownloadEpisodes(selectedEpisode.number);

    if (canDownload) {
      push({
        episode: selectedEpisode.number,
        show: media,
        tranlation: type,
      });
    }

    closeModal();
  };

  const downloadAll = (type?: "sub" | "dub") => {
    if (type) {
      push(
        episodes.map((ep) => ({
          episode: ep.number,
          tranlation: ep.dub ? type : "sub",
          show: media,
        }))
      );
      return;
    }

    if (!episodes.length) return;
    if (episodes.some((ep) => ep.dub)) {
      Alert.alert("Download dubbed?", undefined, [
        { style: "default", text: "DUB", onPress: () => downloadAll("dub") },
        { style: "default", text: "SUB", onPress: () => downloadAll("sub") },
      ]);
    }
  };

  return (
    <>
      <BottomSheet
        label={`${media.title.default} • EP.${selectedEpisode?.number
          .toString()
          .padStart(2, "0")}`}
        onClose={closeModal}
        visible={Boolean(selectedEpisode)}
        disableExitAnim
      >
        {canDownloadEpisodes(selectedEpisode?.number!) && (
          <>
            <TouchableHighlight
              onPress={download("sub")}
              style={styles.option}
              underlayColor={colors.card}
            >
              <Text>Download SUB</Text>
            </TouchableHighlight>
            {selectedEpisode?.dub && (
              <TouchableHighlight
                onPress={download("dub")}
                style={styles.option}
                underlayColor={colors.card}
              >
                <Text>Download DUB</Text>
              </TouchableHighlight>
            )}
          </>
        )}

        {savedEpisode && (
          <TouchableHighlight
            onPress={() => {
              deleteSavedShow(savedEpisode);
              closeModal();
            }}
            style={styles.option}
            underlayColor={colors.card}
          >
            <Text color="failure">Delete Episode</Text>
          </TouchableHighlight>
        )}
      </BottomSheet>
      <FlashList
        data={episodes}
        keyExtractor={(item) => item.id}
        estimatedItemSize={69.75}
        estimatedListSize={{ width, height }}
        contentContainerStyle={{ paddingBottom: bottom + theme.spacing.lg }}
        ListHeaderComponent={
          <Header onDownloadAll={downloadAll} media={media} local={local} />
        }
        ItemSeparatorComponent={() => <Box height="md" />}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={renderItem}
      />
    </>
  );
};

interface HeaderProps {
  media: ShowDetails;
  local: boolean;
  onDownloadAll: () => void;
}

const Header = ({ media, local, onDownloadAll }: HeaderProps) => {
  const theme = useTheme();
  return (
    <>
      <MediaHeading media={media} />
      {!local && (
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
      )}
      <Box
        paddingHorizontal="2xl"
        paddingVertical="lg"
        row
        style={styles.title}
      >
        <Text variant="label">Episodes</Text>
        {!local && (
          <TouchableOpacity
            activeOpacity={0.75}
            hitSlop={16}
            onPress={() => onDownloadAll()}
          >
            <Text color="primary" variant="label">
              Download
            </Text>
          </TouchableOpacity>
        )}
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

export default MediaEpisodesScreen;

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    justifyContent: "space-between",
  },
  option: {
    padding: theme.spacing["md"],
    borderRadius: theme.spacing["xs"],
    marginHorizontal: -theme.spacing.md,
  },
});
