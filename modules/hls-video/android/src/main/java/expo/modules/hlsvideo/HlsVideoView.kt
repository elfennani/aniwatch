@file:UnstableApi package expo.modules.hlsvideo

import android.content.Context
import android.widget.FrameLayout
import android.widget.ListPopupWindow
import androidx.media3.common.C
import androidx.media3.common.SimpleBasePlayer
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.AspectRatioFrameLayout
import androidx.media3.ui.PlayerView
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class HlsVideoView(context: Context, appContext: AppContext) : ExpoView(context, appContext){
    private var playerView: PlayerView;

    internal val player = ExoPlayer.Builder(context).build().also {
        playerView = PlayerView(context).apply {
            player = it
            resizeMode = AspectRatioFrameLayout.RESIZE_MODE_FIT
            useController = false
        }

        addView(playerView)
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()

        player.release()
        removeView(playerView)
    }
}
