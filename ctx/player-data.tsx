import { Episode } from "@/interfaces/Episode";
import { createContext, useContext } from "react";

export interface PlayerData {
  title: string;
  episode: number;
  id: number;
  nextEpisode?: Episode;
  qualities?: string[];
  dubbed: boolean;
}

export const PlayerDataContext = createContext<PlayerData>({
  title: "",
  episode: -1,
  id: 0,
  dubbed: false,
});

export const usePlayerData = () => useContext(PlayerDataContext);
