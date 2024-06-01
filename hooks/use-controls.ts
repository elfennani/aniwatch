import { BACKWARD_DURATION, FORWARD_DURATION, LONG_BACKWARD_DURATION, LONG_FORWARD_DURATION } from "@/constants/values";
import { AVPlaybackStatus, Video } from "expo-av";
import { VideoPlayer } from 'expo-video'


const useControls = (
  player: VideoPlayer
) => ({
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
});

export default useControls