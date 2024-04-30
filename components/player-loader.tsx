import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  useWindowDimensions,
} from "react-native";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import React, { ForwardedRef, useEffect, useRef, useState } from "react";
import useLinkQuery from "@/api/use-link-query";
import AntDesign from "@expo/vector-icons/AntDesign";
import Text from "./text";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import secondsToHms from "@/utils/seconds-to-hms";
import useWatchedMutation from "@/api/use-watched-mutation";
import { ShowDetails } from "@/interfaces/ShowDetails";
import purple from "@/utils/purple";
import { Link } from "expo-router";
import { storage } from "@/utils/mmkv";
import QualitySelector from "./quality-selector";

type Props = {
  aniListId: number;
  allAnimeId: string;
  episode: number;
  dubbed: boolean;
  watched: boolean;
  media: ShowDetails;
};

type Translation = "sub" | "dub";

const PlayerLoader = ({
  allAnimeId,
  episode,
  dubbed,
  watched,
  aniListId,
  media,
}: Props) => {
  const translationKey = "translation";
  const qualityKey = "quality";
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [qualityView, setQualityView] = useState(false);
  const [translation, setTranslation] = useState<Translation>(
    (storage.getString(translationKey) as Translation | undefined) ?? "sub"
  );
  const [initialStatus, setInitialStatus] = useState<AVPlaybackStatus | null>(
    null
  );
  const opacity = useSharedValue(0);
  const { height, width } = useWindowDimensions();
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    display: opacity.value ? "flex" : "none",
  }));
  const video = useRef<Video>(null);
  const isFirstPress = useRef(false);
  const updatedEntry = useRef(false);
  const doubleTouchTimeout = useRef<NodeJS.Timeout | null>(null);
  const {
    mutate,
    isPending: isWatchedMutationPending,
    isSuccess,
  } = useWatchedMutation(
    { episode, showId: aniListId },
    () => updatedEntry.current == true
  );
  const { data, isPending, isError } = useLinkQuery({
    episode: episode.toString(),
    allAnimeId,
    type: dubbed ? translation : "sub",
  });
  const [quality, setQuality] = useState(
    storage.getString(qualityKey) ?? "auto"
  );

  useEffect(() => {
    if (
      !status?.isLoaded ||
      !status.durationMillis ||
      isWatchedMutationPending ||
      isSuccess
    )
      return;
    const progress = status.positionMillis;
    const duration = status.durationMillis;

    if (progress / duration > 0.8 && !watched && !updatedEntry.current) {
      mutate();
    }
  }, [status, updatedEntry, watched, isSuccess, isWatchedMutationPending]);

  useEffect(() => {
    storage.set(translationKey, translation);
  }, [translation]);

  useEffect(() => {
    storage.set(qualityKey, quality);
  }, [quality]);

  function handleBackward(intro = false) {
    if (status?.isLoaded) {
      if (status.positionMillis < 10000) {
        video.current?.setPositionAsync(0);
        return;
      }

      video.current?.setPositionAsync(
        status.positionMillis - (intro ? 90000 : 10000)
      );
    }
  }

  function handleTogglePlayback() {
    if (status?.isLoaded) {
      if (status.isPlaying) video.current?.pauseAsync();
      else video.current?.playAsync();
    }
  }

  function handleForward(intro: boolean = false) {
    if (status?.isLoaded) {
      video.current?.setPositionAsync(
        status.positionMillis + (intro ? 88000 : 10000)
      );
    }
  }

  let playbackStatus = "play";

  if (status?.isLoaded) {
    if (status.isPlaying) {
      playbackStatus = "pause";
    } else if (status.isBuffering) {
      playbackStatus = "loading";
    } else {
      playbackStatus = "play";
    }
  }

  const hasNextEp =
    media.episodes?.some((ep) => ep.number == episode + 1) ?? false;

  function handleTouchStart(e: GestureResponderEvent) {}

  function handleTouchMove(e: GestureResponderEvent) {}

  function handleTouchEnd(e: GestureResponderEvent) {}

  function handlePress({ nativeEvent: { locationX } }: GestureResponderEvent) {
    if (isFirstPress.current) {
      if (locationX < width / 3) {
        handleBackward();
      } else if (locationX > (2 * width) / 3) {
        handleForward();
      } else {
        handleTogglePlayback();
      }

      clearTimeout(doubleTouchTimeout.current!);
      doubleTouchTimeout.current = null;
      isFirstPress.current = false;
      return;
    }

    isFirstPress.current = true;
    doubleTouchTimeout.current = setTimeout(() => {
      isFirstPress.current = false;
      doubleTouchTimeout.current = null;
      opacity.value = withTiming(opacity.value == 0 ? 1 : 0, {
        duration: 100,
      });
    }, 200);
  }

  const uri =
    data?.find((level) => level.name == quality)?.url ||
    data?.find((level) => level.name == "auto")?.url;

  return (
    <Pressable
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onPress={handlePress}
    >
      <View
        style={{
          position: "relative",
          backgroundColor: "black",
          width: "100%",
          height: "100%",
        }}
      >
        {uri && (
          <Video
            ref={video}
            source={{ uri: uri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={true}
            onPlaybackStatusUpdate={setStatus}
            status={initialStatus ?? undefined}
          />
        )}

        <Animated.View style={[style, styles.controlsContainer]}>
          <View style={styles.innerControls}>
            <Text>
              “{media.title.default}” - Episode {episode}
            </Text>
            <View style={styles.controls}>
              <TouchableOpacity
                hitSlop={16}
                onPress={() => handleBackward()}
                onLongPress={() => handleBackward(true)}
              >
                <AntDesign
                  name="banckward"
                  size={24}
                  color="rgba(255,255,255,0.5)"
                />
              </TouchableOpacity>
              <TouchableOpacity hitSlop={16} onPress={handleTogglePlayback}>
                {playbackStatus == "loading" ? (
                  <ActivityIndicator size={48} color="rgba(255,255,255,0.8)" />
                ) : (
                  <AntDesign
                    name={playbackStatus as any}
                    size={48}
                    color="rgba(255,255,255,0.8)"
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                hitSlop={16}
                onPress={() => handleForward()}
                onLongPress={() => handleForward(true)}
              >
                <AntDesign
                  name="forward"
                  size={24}
                  color="rgba(255,255,255,0.5)"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.footer}>
              <View style={styles.seekbar}>
                <View style={styles.progress}>
                  {status?.isLoaded && status.durationMillis && (
                    <View
                      style={[
                        {
                          width: `${
                            (status?.positionMillis / status.durationMillis) *
                            100
                          }%`,
                        },
                        styles.innerProgress,
                      ]}
                    />
                  )}
                </View>
                {status?.isLoaded && (
                  <Text>
                    {status.durationMillis
                      ? secondsToHms(
                          (status.durationMillis - status.positionMillis) / 1000
                        )
                      : secondsToHms(status.positionMillis / 1000)}
                  </Text>
                )}
              </View>
              <View style={styles.actions}>
                <FooterButton label="Episodes" icon="bars" />
                <FooterButton
                  onPress={() => setQualityView(true)}
                  label="Quality"
                  icon="picture"
                />
                {dubbed && (
                  <FooterButton
                    label={
                      translation == "sub" ? "Watch Dubbed" : "Watch Subbed"
                    }
                    icon="sound"
                    onPress={() =>
                      setTranslation((t) => (t == "dub" ? "sub" : "dub"))
                    }
                  />
                )}
                {hasNextEp && (
                  <Link
                    replace
                    href={`/watch/${aniListId}/${episode + 1}`}
                    asChild
                  >
                    <FooterButton label="Next Episode" icon="stepforward" />
                  </Link>
                )}
              </View>
            </View>
          </View>
        </Animated.View>

        <QualitySelector
          current={quality}
          onSelect={(res) => {
            setQuality(res);
            setInitialStatus(status);
          }}
          visible={qualityView}
          onRequestClose={() => setQualityView(false)}
          resolutions={data?.map((res) => res.name)}
        />
      </View>
    </Pressable>
  );
};

type IconName = keyof typeof AntDesign.glyphMap;
type FooterButtonProps = {
  label: string;
  icon: IconName;
} & TouchableOpacityProps;

const FooterButton = React.forwardRef(
  (
    { label, icon, ...props }: FooterButtonProps,
    ref: ForwardedRef<TouchableOpacity>
  ) => (
    <TouchableOpacity hitSlop={16} ref={ref} {...props}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <AntDesign name={icon} color="white" size={18} />
        <Text weight="semibold" style={{ fontSize: 14 }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  )
);

export default PlayerLoader;

const styles = StyleSheet.create({
  controlsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 32,
  },
  innerControls: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    aspectRatio: 16 / 9,
  },
  footer: {
    width: "100%",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 32,
  },
  seekbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 24,
  },
  progress: {
    flex: 1,
    height: 2,
    backgroundColor: "rgba(113, 113, 122, 0.33)",
    borderRadius: 2,
  },
  innerProgress: {
    height: 2,
    backgroundColor: purple[500],
    borderRadius: 2,
  },
  controls: {
    flexDirection: "row",
    position: "absolute",
    justifyContent: "space-evenly",
    alignItems: "center",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
