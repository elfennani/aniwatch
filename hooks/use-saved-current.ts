import DownloadItemProgress from "@/interfaces/DownloadItemProgress";
import { useMMKVObject } from "react-native-mmkv";

const useSavedCurrent = () => useMMKVObject<DownloadItemProgress>("current")

export default useSavedCurrent