import { fetchLink } from "@/api/use-link-query";
import { IMAGES_DIR, SHOWS_DIR, TEMP_DIR } from "@/constants/values";
import useAllAnimeClient from "@/hooks/use-allanime-client";
import { useQueue } from "@uidotdev/usehooks";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMMKVObject } from "react-native-mmkv";
import * as FileSystem from "expo-file-system";
import throttle from "lodash.throttle";
import DownloadItem from "@/interfaces/DownloadItem";
import useSavedShows, { getSavedShows } from "@/hooks/use-saved-shows";
import useSavedCurrent from "@/hooks/use-saved-current";
import DownloadItemProgress from "@/interfaces/DownloadItemProgress";
import useSavedQueue from "@/hooks/use-saved-queue";

const DownloadManagerContext = createContext({
  push: (item: DownloadItem) => {},
});

export const useDownloadManager = () => useContext(DownloadManagerContext);

type OnUpdateCallback =
  FileSystem.FileSystemNetworkTaskProgressCallback<FileSystem.DownloadProgressData>;

export const DownloadManagerProvider = ({ children }: any) => {
  const initialized = useRef(false);
  const [savedShows, setSavedShows] = useSavedShows();
  const [savedCurrent, setSavedCurrent] = useSavedCurrent();
  const currentDownload = useRef<DownloadItemProgress>();
  const [savedQueue, setSavedQueue] = useSavedQueue();
  const { add, first, queue, remove } = useQueue<DownloadItem>();
  const client = useAllAnimeClient();

  useEffect(() => {
    if (!currentDownload.current && first && initialized.current) {
      const current = { ...first, progress: 0 };
      download(current);
    }
  }, [first]);

  useEffect(() => {
    if (initialized.current) setSavedQueue(queue);
  }, [queue]);

  useEffect(() => {
    if (!initialized.current) {
      let newQueue: DownloadItem[] = [];
      // if (savedCurrent) newQueue = [savedCurrent];
      if (savedQueue) newQueue = [...newQueue, ...savedQueue];

      newQueue.forEach((item) => add(item));

      initialized.current = true;

      if (savedCurrent) {
        const current = { ...savedCurrent, progress: 0 };
        download(current);
      }
    }
  }, []);

  const downloadNext = useCallback(() => {
    if (first) {
      const current = { ...first, progress: 0 };
      download(current);
    }
  }, [first]);

  const download = async (current: DownloadItemProgress) => {
    const savedShows = getSavedShows();
    const isSaved = savedShows?.some(
      (saved) =>
        saved.mediaId == current.mediaId && saved.episode == current.episode
    );

    if (isSaved) remove();
    if (currentDownload.current || isSaved) return;

    currentDownload.current = current;
    setSavedCurrent(current);

    const { allAnimeId, audio, episode, title, mediaId } = current;
    const params = {
      episode: episode.toString(),
      allAnimeId,
      type: audio,
      mp4: true,
    };

    const link = await fetchLink(params, client);
    const { url } = link.find((link) => link.name == "auto")!;

    const filename = `${mediaId}-${title}-EP${episode}-${audio}.mp4`;
    const fileUri = TEMP_DIR + filename;

    const { exists: tempDirExists } = await FileSystem.getInfoAsync(TEMP_DIR);
    if (!tempDirExists) await FileSystem.makeDirectoryAsync(TEMP_DIR);

    const onUpdate = throttle(onUpdateProgress, 500);
    const resumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {},
      onUpdate
    );
    const result = await resumable.downloadAsync();

    const { exists: showDirExists } = await FileSystem.getInfoAsync(SHOWS_DIR);
    if (!showDirExists) await FileSystem.makeDirectoryAsync(SHOWS_DIR);

    const newUri = SHOWS_DIR + filename;
    await FileSystem.moveAsync({ from: fileUri, to: newUri });

    let thumbnail = current.thumbnail;
    if (current.thumbnail) {
      try {
        const filename = `thumbnail-${mediaId}-${episode}.jpg`;
        const fileUri = IMAGES_DIR + filename;
        await FileSystem.downloadAsync(current.thumbnail, fileUri);
        thumbnail = current.thumbnail;
      } catch (error) {}
    }

    setSavedShows((saved) => [
      ...(saved ?? []),
      { ...current, filename, uri: newUri, thumbnail },
    ]);

    currentDownload.current = undefined;
    setSavedCurrent(undefined);
    remove();

    downloadNext();
  };

  const onUpdateProgress: OnUpdateCallback = ({
    totalBytesExpectedToWrite,
    totalBytesWritten,
  }) => {
    if (!currentDownload.current) return;
    const newCurrent: DownloadItemProgress = {
      ...currentDownload.current,
      progress: totalBytesWritten / totalBytesExpectedToWrite,
    };

    currentDownload.current = newCurrent;
    setSavedCurrent(newCurrent);
  };

  return (
    <DownloadManagerContext.Provider value={{ push: add }}>
      {children}
    </DownloadManagerContext.Provider>
  );
};
