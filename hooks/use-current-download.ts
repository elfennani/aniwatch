import { useEffect } from "react";
import { useMMKVObject } from "react-native-mmkv";
import CurrentDownload from "@/interfaces/CurrentDownload";
import { useDownloadManager } from "@/ctx/download-manager";

const useCurrentDownload = () => {
  const [current, setCurrent] = useMMKVObject<CurrentDownload>("current-download")
  const { downloadAsync } = useDownloadManager();

  useEffect(() => {
    if (current && !current.started) {
      downloadAsync(current)
    }
  }, [current])

  return [current, setCurrent] as const
}

export default useCurrentDownload

