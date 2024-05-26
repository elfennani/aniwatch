import { useMemo } from "react";
import useSavedShows from "./use-saved-shows";

const useSavedShow = (mediaId: number, episode: number = -1) => {
  const [saved] = useSavedShows();

  const show = useMemo(() =>
    saved
      ?.filter(saved => {
        const idMatch = saved.show.id === mediaId
        const epMatch = saved.episode === episode

        if (episode === -1) return idMatch;

        return idMatch && epMatch
      }
      )
      ?.sort((a, b) =>
        (b.savedAt ?? 0) - (a.savedAt ?? 0)
      )?.[0],
    [saved, mediaId, episode]
  )

  return show
}

export default useSavedShow