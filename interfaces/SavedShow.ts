import DownloadItem from "./DownloadItem";

export default interface SavedShow extends DownloadItem {
  uri: string;
  filename: string;
}