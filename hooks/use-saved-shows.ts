import SavedShow from "@/interfaces/SavedShow";
import { storage } from "@/utils/mmkv";
import { useMMKVObject } from "react-native-mmkv";

const useSavedShows = () => useMMKVObject<SavedShow[]>("saved-shows")

export const getSavedShows = () => {
  const raw = storage.getString("saved-shows")
  if (!raw) return;

  return JSON.parse(raw) as SavedShow[]
}

export default useSavedShows