import MediaStatus from "@/interfaces/MediaStatus";
import * as FileSystem from 'expo-file-system'

export const TEMP_DIR = FileSystem.documentDirectory + "temp/";
export const SHOWS_DIR = FileSystem.documentDirectory + "shows/"

export const CONTROLS_TIMEOUT = 5000;
export const TOUCH_CANCEL_DISTANCE = 10;
export const FORWARD_DURATION = 15000;
export const BACKWARD_DURATION = 5000;
export const LONG_FORWARD_DURATION = 87000;
export const LONG_BACKWARD_DURATION = 90000;
export const DOUBLE_PRESS_DELAY = 200
export const POSSIBLE_STATUS: Record<MediaStatus, string> = {
  COMPLETED: "Completed",
  CURRENT: "Watching",
  DROPPED: "Dropped",
  PAUSED: "Paused",
  PLANNING: "Planning",
  REPEATING: "Rewatching",
};