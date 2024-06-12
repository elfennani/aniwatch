import { View, Text } from "react-native";
import React, { ReactNode, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Head from "expo-router/head";
import useShowQuery from "@/api/use-show-query";
import MediaHeading from "@/components/media-heading";
import MediaStats from "@/components/media-stats";
import MediaActions from "@/components/media-actions";
import MediaSynopsis from "@/components/media-synopsis";
import MediaCharacters from "@/components/media-characters";
import MediaRelations from "@/components/media-relations";
import TagsGrid from "@/components/tags-grid";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import WebModal from "@/components/web-modal";
import MediaEpisodesScreen from "./episodes";
import Status from "./status";

type Props = {};

type MetaDataValue = string | number | undefined | false;
type MetaData = Record<string, MetaDataValue | MetaDataValue[]>;

const MediaWeb = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: media } = useShowQuery({ id: Number(id) });
  const [visible, setVisible] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);

  if (!media) return <Text>Loading...</Text>;

  const metadata: MetaData = {
    type: media.type,
    format: media.format,
    "start date":
      media.startDate &&
      new Date(
        media.startDate?.year!,
        (media.startDate?.month ?? 1) - 1,
        media.startDate?.day!
      ).toLocaleDateString(),
    "end date":
      media.endDate &&
      new Date(
        media.endDate.year!,
        (media.endDate.month ?? 1) - 1,
        media.endDate.day!
      ).toLocaleDateString(),
    season: media.season,
    score: media.score ?? 0,
    genres: media.genres,
    source: media.source,
    episode: media.episodesCount,
    chapters: media.chapters,
    year: media.year,
  };

  const gesture = Gesture.Tap().onFinalize(() => setVisible((v) => !v));

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900">
      <Head>
        <title>{media.title.default}</title>
      </Head>
      <WebModal visible={visible} onClose={() => setVisible(false)}>
        <MediaEpisodesScreen />
      </WebModal>
      <WebModal visible={statusVisible} onClose={() => setStatusVisible(false)}>
        <Status />
      </WebModal>
      <header className="relative w-full bg-white dark:bg-black pb-8">
        <img className="w-full" src={media.banner} alt={media.title.default} />

        <div className="relative z-10 container w-full mx-auto flex items-start">
          <div className="flex flex-col gap-4 relative -mt-28">
            <img
              className="w-56 rounded-xl h-auto"
              src={media.cover}
              alt={media.title.default!}
            />
            <MediaActions
              status={media.status!}
              onWatch={() => setVisible(true)}
              onSetStatus={() => setStatusVisible(true)}
            />
          </div>
          <div className="p-8 flex-1">
            <h1 className="text-3xl font-[Inter] font-semibold text-zinc-900">
              {media.title.default}
            </h1>
            <p
              className="text-zinc-600"
              dangerouslySetInnerHTML={{ __html: media.description! }}
            />
          </div>
        </div>
      </header>
      <div className="flex container mx-auto gap-8 mb-8 items-start">
        <aside className="w-56 py-8">
          <div className="p-8 bg-white rounded-md">
            <ul className="flex flex-col gap-4">
              {Object.keys(metadata)
                .filter((key) => !!metadata[key])
                .map((key) => {
                  let content: ReactNode = metadata[key];

                  if (Array.isArray(content)) {
                    content = content.map((item) => (
                      <p className="text-sm text-zinc-500 capitalize">
                        {String(item).replaceAll("_", " ").toLowerCase()}
                      </p>
                    ));
                  } else {
                    content = (
                      <p className="text-sm text-zinc-500 capitalize">
                        {String(content).replaceAll("_", " ").toLowerCase()}
                      </p>
                    );
                  }

                  return (
                    <li key={key} className="flex flex-col gap-1">
                      <p className="text-xs font-semibold text-purple-500 capitalize">
                        {key}
                      </p>
                      {content}
                    </li>
                  );
                })}
            </ul>
          </div>
        </aside>
        <main className="flex-1 flex flex-col gap-10 p-8 mt-8 bg-white rounded-md">
          <MediaCharacters characters={media.mainCharacters} />
          <MediaRelations relations={media.relations} />
          <TagsGrid tags={media.tags ?? []} />
        </main>
      </div>
    </div>
  );
};

export default MediaWeb;
