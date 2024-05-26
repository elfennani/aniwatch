import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import React, { ForwardedRef, memo, useEffect, useState } from "react";
import { Episode } from "@/interfaces/Episode";
import secondsToHms from "@/utils/seconds-to-hms";
import Text from "./text";
import { Image } from "expo-image";
import { useTheme } from "@/ctx/theme-provider";
import { Iconify } from "react-native-iconify";
import Box from "./box";
import * as FileSystem from "expo-file-system";
import useSavedShow from "@/hooks/use-saved-show";
import { filesize } from "filesize";

type Props = {
  mediaId: number;
  episode: Episode;
  watched?: boolean;
} & TouchableOpacityProps;

const EpsiodeItem = React.forwardRef(
  (
    {
      episode: {
        dub,
        id,
        number,
        thumbnail,
        duration,
        resolution,
        downloadTranslation,
      },
      mediaId,
      watched = false,
      ...props
    }: Props,
    ref: ForwardedRef<TouchableOpacity>
  ) => {
    const {
      colors: { card, secondary, primary },
    } = useTheme();

    return (
      <View style={watched && { opacity: 0.75 }}>
        <TouchableOpacity
          ref={ref}
          activeOpacity={0.8}
          {...props}
          style={[styles.container]}
        >
          {thumbnail ? (
            <Image
              cachePolicy="memory-disk"
              recyclingKey={id}
              source={{
                uri: thumbnail,
                width: 124,
                height: 124 * (9 / 16),
              }}
              contentFit="cover"
              style={[styles.image, { backgroundColor: card }]}
            />
          ) : (
            <View style={styles.image}>
              <Iconify
                icon="material-symbols-light:error-outline"
                color={secondary}
                size={24}
              />
            </View>
          )}
          <View>
            <Text>Episode {number}</Text>
            <Box row style={{ alignItems: "center", marginTop: 4, gap: 4 }}>
              {downloadTranslation && (
                <Iconify
                  icon="material-symbols-light:download-for-offline"
                  size={16}
                  color={primary}
                />
              )}
              <Text
                style={{ textTransform: "uppercase" }}
                variant="label"
                color={downloadTranslation ? "primary" : "secondary"}
              >
                {downloadTranslation ? (
                  <>{downloadTranslation}</>
                ) : (
                  <>sub {dub && "• dub"}</>
                )}{" "}
                {watched && (
                  <Text color="primary" variant="label">
                    • WATCHED
                  </Text>
                )}
              </Text>
            </Box>
            <Text style={{ marginTop: 4 }} variant="label" color="secondary">
              {!!duration && secondsToHms(duration)}
              {!!duration && !!resolution && " • "}
              {!!resolution && `${resolution}p`}
              {downloadTranslation && (
                <EpisodeDownloadSize ep={number} mediaId={mediaId} />
              )}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
);

const EpisodeDownloadSize = memo(
  ({ ep, mediaId }: { ep: number; mediaId: number }) => {
    const [mediaSize, setMediaSize] = useState<number>();
    const saved = useSavedShow(mediaId, ep);

    useEffect(() => {
      if (!mediaSize && saved) {
        FileSystem.getInfoAsync(saved.uri, { size: true }).then((info) => {
          if (!info.isDirectory && info.exists) {
            setMediaSize(info.size);
          }
        });
      }
    }, [ep, mediaId]);

    if (mediaSize) return ` • ${filesize(mediaSize, { round: 0 })}`;

    return "";
  }
);

export default EpsiodeItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  image: {
    borderRadius: 4,
    aspectRatio: 16 / 9,
    width: 124,
    alignItems: "center",
    justifyContent: "center",
  },
});
