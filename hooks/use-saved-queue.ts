import DownloadItem from "@/interfaces/DownloadItem";
import { useMMKVObject } from "react-native-mmkv";

const useSavedQueue = () => useMMKVObject<DownloadItem[]>("queue")

export default useSavedQueue