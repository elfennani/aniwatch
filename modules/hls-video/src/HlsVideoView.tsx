import { requireNativeViewManager } from "expo-modules-core";
import * as React from "react";

import { HlsVideoViewProps } from "./HlsVideo.types";
import { ViewProps } from "react-native";

const NativeView: React.ComponentType<HlsVideoViewProps> =
  requireNativeViewManager("HlsVideo");

export default function HlsVideoView(props: HlsVideoViewProps & ViewProps) {
  return <NativeView {...props} />;
}
