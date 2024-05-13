import { BACKWARD_DURATION, FORWARD_DURATION, LONG_BACKWARD_DURATION, LONG_FORWARD_DURATION } from "@/constants/values";
import { AVPlaybackStatus, Video } from "expo-av";

const useControls = (
  status: AVPlaybackStatus | undefined,
  video: React.RefObject<Video>
) => ({
  backward: (intro = false) => {
    if (!status?.isLoaded) return;
    if (status.positionMillis < 10000) {
      video.current?.setPositionAsync(0);
      return;
    }

    video.current?.setPositionAsync(
      status.positionMillis -
      (intro ? LONG_BACKWARD_DURATION : BACKWARD_DURATION)
    );
  },
  togglePlayback: () => {
    if (!status?.isLoaded) return;

    if (status.isPlaying) video.current?.pauseAsync();
    else video.current?.playAsync();
  },
  forward: (intro: boolean = false) => {
    if (!status?.isLoaded) return;
    video.current?.setPositionAsync(
      status.positionMillis + (intro ? LONG_FORWARD_DURATION : FORWARD_DURATION)
    );
  },
});

export default useControls