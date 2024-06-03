import DownloadItem from "./DownloadItem";

export default interface DownloadItemProgress extends DownloadItem {
  progress: number;
}