import Downloadable from "./Downloadable";

export default interface CurrentDownload {
  downloadable: Downloadable,
  progressPercent: number;
  started?: boolean;
}