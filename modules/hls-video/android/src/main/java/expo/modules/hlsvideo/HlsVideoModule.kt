package expo.modules.hlsvideo

import androidx.annotation.OptIn
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.util.UnstableApi
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class HlsVideoModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  @OptIn(UnstableApi::class) override fun definition() = ModuleDefinition {
    Name("HlsVideo")

    View(HlsVideoView::class) {
      Prop("url") { view: HlsVideoView, prop: String ->
        val mediaItem = MediaItem.fromUri(prop)
        val player = view.player
        player.setMediaItem(mediaItem)
        player.videoScalingMode = C.VIDEO_SCALING_MODE_SCALE_TO_FIT_WITH_CROPPING
        player.prepare()
        player.play()
      }
    }
  }
}
