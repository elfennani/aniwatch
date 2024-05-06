import { Href } from "expo-router";

export default interface Notification {
  id: number;
  content: string;
  thumbnail?: string;
  createdAt: number;
  path?: Href;
}