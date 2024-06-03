export default interface DownloadItem {
  mediaId: number;
  allAnimeId: string;
  title: string;
  episode: number;
  audio: "dub" | "sub";
  thumbnail?: string;
}