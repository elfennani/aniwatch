export default interface User {
  id: number;
  name: string;
  avatar?: string;
  banner?: string;
  about?: string;
  completedAnime?: number;
  completedManga?: number;
  totalAnime?: number;
  totalManga?: number;
  episodesWatched?: number;
  daysWatched?: number;
  meanScore?: number;
  chaptersRead?: number;
  volumesRead?: number;
  mangaMeanScore?: number;
}