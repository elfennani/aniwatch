import { ShowDetails } from "./ShowDetails";

export default interface Downloadable {
  tranlation: "sub" | "dub";
  episode: number;
  show: ShowDetails;
}