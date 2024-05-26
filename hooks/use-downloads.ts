import Downloadable from "@/interfaces/Downloadable"
import { useMMKVObject } from "react-native-mmkv"
import useCurrentDownload from "./use-current-download"
import { useEffect } from "react"

const useDownloads = () => {
  return useMMKVObject<Downloadable[]>("downloads")
}

export default useDownloads;