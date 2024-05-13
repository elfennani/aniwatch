import { Episode } from "@/interfaces/Episode";
import { createContext, useContext } from "react";

export interface PlayerData {
  title: string;
  episode: number;
  id: number;
  nextEpisode?: Episode;
  qualities?: string[];
}

export const PlayerDataContext = createContext<PlayerData>({
  title: "",
  episode: -1,
  id: 0,
});

export const usePlayerData = () => useContext(PlayerDataContext);
