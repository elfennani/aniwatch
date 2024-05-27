import Downloadable from "@/interfaces/Downloadable";
import { useMMKVObject } from "react-native-mmkv";
import * as FileSystem from 'expo-file-system';
import { SHOWS_DIR } from "@/constants/values";

interface SavedShow extends Downloadable {
  uri: string,
  type: "sub" | "dub",
  savedAt: number
}


const useSavedShows = () => {
  const [savedShows, setSavedShows] = useMMKVObject<SavedShow[]>("saved-shows")

  async function saveShow(uri: string, fileName: string, downloadable: Downloadable, type: "sub" | "dub") {
    const showDirInfo = await FileSystem.getInfoAsync(SHOWS_DIR);
    if (!showDirInfo.exists) {
      FileSystem.makeDirectoryAsync(SHOWS_DIR);
    }

    const newUri = SHOWS_DIR + fileName
    await FileSystem.moveAsync({ from: uri, to: newUri })

    setSavedShows(savedShows => {
      const show: SavedShow = { ...downloadable, uri: newUri, type, savedAt: Date.now() }
      if (savedShows) {
        return [...savedShows, show]
      }

      return [show]
    })
  }

  async function deleteShow({ episode, uri, show: { id } }: SavedShow) {
    await FileSystem.deleteAsync(uri)
    setSavedShows(savedShows => savedShows?.filter(saved => !(saved.show.id == id && saved.episode == episode)))
  }

  return [savedShows, saveShow, deleteShow] as const
}

export default useSavedShows;