import { BACKWARD_DURATION, FORWARD_DURATION, LONG_BACKWARD_DURATION, LONG_FORWARD_DURATION } from "@/constants/values";
import { AVPlaybackStatus, Video } from "expo-av";
import { VideoPlayer } from 'expo-video'

export interface Controls {
  backward(): void
  togglePlayback(): void
  forward(): void;
  seek(position: number): void
}

const useControls = (
  player: VideoPlayer
): Controls => ({
  backward: () => {
    if (player.currentTime < 10) {
      player.currentTime = 0
      return;
    }

    player.currentTime = player.currentTime - (BACKWARD_DURATION / 1000)
  },
  togglePlayback: () => {
    if (player.playing) player.pause();
    else player.play();
  },
  forward: () => {
    player.currentTime = player.currentTime + (FORWARD_DURATION / 1000)
  },
  seek: (position) => {
    player.currentTime = position
  }
});

export default useControls