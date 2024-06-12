import { StyleSheet } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useLinkQuery from "@/api/use-link-query";
import { ShowDetails } from "@/interfaces/ShowDetails";
import { useMMKVString } from "react-native-mmkv";
import Player from "./player";
import { PlayerData, PlayerDataContext } from "@/ctx/player-data";
import * as keys from "@/constants/keys";
import useUpdateEntry from "@/hooks/use-update-entry";
import Hls, { Events } from "hls.js";
import PlayerControls from "./player-controls";
import Options from "./options";
import { Iconify } from "react-native-iconify";
import { zinc } from "tailwindcss/colors";

type Translation = "sub" | "dub";
export type PlayerLoaderProps = {
  aniListId: number;
  allAnimeId: string;
  episode: number;
  dubbed: boolean;
  watched: boolean;
  media: ShowDetails;
};

const PlayerLoader = ({
  allAnimeId,
  episode,
  dubbed,
  watched,
  aniListId,
  media,
}: PlayerLoaderProps) => {
  console.log("first");
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const [settings, setSettings] = useState(false);
  const [qualityOverlay, setQualityOverlay] = useState(false);
  const [isTouchingControls, setIsTouchingControls] = useState(false);

  const [translation, setTranslation] = useMMKVString(keys.translationKey);
  const [quality, setQuality] = useMMKVString(keys.qualityKey);
  const updateEntry = useUpdateEntry(episode, aniListId, media);

  const type = dubbed ? (translation as Translation) ?? "sub" : "sub";
  const params = { episode: "" + episode, allAnimeId, type };
  const { data } = useLinkQuery(params);

  let uri = useMemo(
    () =>
      data?.find((level) => level.name == (quality ?? "auto"))?.url ||
      data?.find((level) => level.name == "auto")?.url,
    [data, quality]
  );

  const qualities = useMemo(() => data?.map((res) => res.name), [data]);

  const metadata: PlayerData = {
    title: media.title.default!,
    episode,
    nextEpisode: media.episodes?.find((ep) => ep.number == episode + 1),
    id: media.id,
    qualities: data?.map((res) => res.name),
    dubbed,
  };

  useEffect(() => {
    if (!uri) return;

    if (!hlsRef.current) {
      hlsRef.current = new Hls();
    }
    const hls = hlsRef.current;

    const onLevelLoaded = (_: any, { levels }: any) => {
      // setLevels(levels)
    };
    const onLevelChanged = (_: any, { level }: any) => {
      // setCurrentLevel(level)
    };

    if (Hls.isSupported()) {
      hls.loadSource(uri);
      hls.attachMedia(videoRef.current!!);
      hls.once(Events.MANIFEST_PARSED, onLevelLoaded);
      hls.on(Events.LEVEL_SWITCHED, onLevelChanged);
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = uri;
    }

    return () => {
      hlsRef.current?.off(Events.MANIFEST_PARSED, onLevelLoaded);
      hlsRef.current?.off(Events.LEVEL_SWITCHED, onLevelChanged);
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [uri]);

  const togglePlayback = () => {
    if (videoRef.current?.paused || videoRef.current?.ended) {
      videoRef.current.play();
    } else {
      videoRef.current?.pause();
    }
  };

  if (!uri) return;

  return (
    <PlayerDataContext.Provider value={metadata}>
      <div className="w-screen object-contain h-screen bg-black relative">
        <Options visible={settings} onClose={() => setSettings(false)}>
          {qualities && !!qualities.length && (
            <Options.Option
              icon={hdIcon}
              title="Change Quality"
              subtitle={quality ?? "auto"}
              onPress={() => setQualityOverlay(true)}
              more
            />
          )}
          {dubbed && (
            <Options.Option
              icon={voiceIcon}
              title="Switch Language"
              subtitle={translation == "dub" ? "DUB" : "SUB"}
              onPress={() =>
                setTranslation((translation ?? "sub") == "dub" ? "sub" : "dub")
              }
            />
          )}
        </Options>
        <Options
          visible={qualityOverlay}
          onClose={() => setQualityOverlay(false)}
        >
          {qualities?.map((q) => (
            <Options.Option
              key={q}
              disabled={(quality ?? "auto") == q}
              icon={hdIcon}
              title={q}
              onPress={() => setQuality(q)}
            />
          ))}
        </Options>
        <video
          autoFocus
          // onClick={togglePlaying}
          // onTouchEnd={handleTouchEnd}
          // onDoubleClick={handleFullScreen}
          // onKeyDown={handleKeyDown}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(ev) => setPosition(ev.currentTarget.currentTime)}
          onDurationChange={(ev) => setDuration(ev.currentTarget.duration)}
          className="w-full h-full"
          disablePictureInPicture={false}
          // onMouseMove={showControls}
          ref={videoRef}
          autoPlay={
            typeof localStorage != "undefined" &&
            localStorage.getItem("autoplay") == "1"
          }
        />
        <PlayerControls
          controls={{
            backward() {},
            forward() {},
            togglePlayback,
            seek(position) {},
          }}
          isPlaying={isPlaying}
          position={position}
          duration={duration}
          visible={true}
          onTouch={() => {}}
          onSettings={() => setSettings(true)}
        />
      </div>
    </PlayerDataContext.Provider>
  );
};

export default PlayerLoader;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "black",
    width: "100%",
    height: "100%",
  },
});

const hdIcon = (
  <Iconify
    icon="material-symbols-light:high-quality-outline-sharp"
    size={24}
    color={zinc[300]}
  />
);
const voiceIcon = (
  <Iconify
    icon="material-symbols-light:record-voice-over-outline"
    size={24}
    color={zinc[300]}
  />
);
