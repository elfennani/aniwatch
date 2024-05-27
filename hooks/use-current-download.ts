import { useEffect } from "react";
import { useMMKVObject } from "react-native-mmkv";
import CurrentDownload from "@/interfaces/CurrentDownload";
import { useDownloadManager } from "@/ctx/download-manager";

const useCurrentDownload = () => useMMKVObject<CurrentDownload>("current-download")

export default useCurrentDownload

