import { fetchLink } from "@/api/use-link-query";
import useAllAnimeClient from "@/hooks/use-allanime-client";
import useSavedShows from "@/hooks/use-saved-shows";
import CurrentDownload from "@/interfaces/CurrentDownload";
import { createContext, useContext, useEffect, useRef } from "react";
import { useMMKVObject } from "react-native-mmkv";
import * as FileSystem from "expo-file-system";
import { ToastAndroid } from "react-native";
import { TEMP_DIR } from "@/constants/values";
import useDownloads from "@/hooks/use-downloads";
import Downloadable from "@/interfaces/Downloadable";
import throttle from "lodash.throttle";

const DownloadManagerContext = createContext({
  downloadAsync: (current: CurrentDownload) => {},
  push: (toDownload: Downloadable | Downloadable[]) => {},
});

type OnUpdateCallback =
  FileSystem.FileSystemNetworkTaskProgressCallback<FileSystem.DownloadProgressData>;

export const DownloadManagerProvider = ({ children }: any) => {
  const [downloads, setDownloads] = useDownloads();
  const [saved, save] = useSavedShows();
  const [current, setCurrent] =
    useMMKVObject<CurrentDownload>("current-download");
  const allAnimeClient = useAllAnimeClient();

  useEffect(() => {
    // setCurrent(undefined)
    // setDownloads(undefined)
    if (!current && downloads?.length) {
      const toDownload = downloads[0];
      setCurrent({
        downloadable: toDownload,
        progressPercent: 0,
      });
      setDownloads((downloads) => {
        if (downloads)
          return downloads.filter(
            ({ episode, show }) =>
              episode !== toDownload.episode || show.id !== toDownload.show.id
          );
      });
    }
  }, [current, downloads]);

  const push = (toDownload: Downloadable | Downloadable[]) => {
    console.log("toDownload", toDownload);
    if (!Array.isArray(toDownload)) {
      toDownload = [toDownload];
    }

    setDownloads((oldDownloads) => [
      ...(oldDownloads ?? []),
      ...(toDownload as Downloadable[]),
    ]);
  };

  async function downloadAsync(current: CurrentDownload) {
    setCurrent({ ...current, started: true });
    const {
      downloadable: { show, episode, tranlation },
    } = current;
    const type = tranlation;
    const link = await fetchLink(
      {
        allAnimeId: show.allanimeId!,
        episode: episode.toString(),
        type,
        mp4: true,
      },
      allAnimeClient
    );
    const { url } = link.find((link) => link.name == "auto")!;
    const fileName = `${show.title.default}-EP${episode}-${type}.mp4`;
    const downloadUri = TEMP_DIR + fileName;

    await createTempDirAsync();
    const onUpdate = throttle(onUpdateProgress, 500);
    const download = FileSystem.createDownloadResumable(
      url,
      downloadUri,
      {},
      onUpdate
    );
    ToastAndroid.show(
      `Started Downloading ep ${episode} of ${show.title.default}`,
      ToastAndroid.SHORT
    );

    try {
      const result = await download.downloadAsync();
      if (result) {
        await save(result.uri, fileName, current.downloadable, type);
        ToastAndroid.show(`Downloaded: ${result.uri}`, ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show(
        `Download Failed for EP.${episode}`,
        ToastAndroid.SHORT
      );
      await FileSystem.deleteAsync(downloadUri);
      setCurrent(undefined);
    }

    onUpdate.cancel();
    setCurrent(undefined);
  }

  async function createTempDirAsync() {
    const info = await FileSystem.getInfoAsync(TEMP_DIR);
    if (!info.exists) await FileSystem.makeDirectoryAsync(TEMP_DIR);
  }

  const onUpdateProgress: OnUpdateCallback = ({
    totalBytesExpectedToWrite,
    totalBytesWritten,
  }) => {
    setCurrent((current) => {
      if (current)
        return {
          ...current,
          progressPercent: totalBytesWritten / totalBytesExpectedToWrite,
        };
    });
  };

  return (
    <DownloadManagerContext.Provider value={{ downloadAsync, push }}>
      {children}
    </DownloadManagerContext.Provider>
  );
};

export const useDownloadManager = () => useContext(DownloadManagerContext);
