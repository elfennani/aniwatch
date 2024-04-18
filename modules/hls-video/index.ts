import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to HlsVideo.web.ts
// and on native platforms to HlsVideo.ts
import HlsVideoModule from './src/HlsVideoModule';
import HlsVideoView from './src/HlsVideoView';
import { ChangeEventPayload, HlsVideoViewProps } from './src/HlsVideo.types';

// Get the native constant value.
export const PI = HlsVideoModule.PI;

export function hello(): string {
  return HlsVideoModule.hello();
}

export async function setValueAsync(value: string) {
  return await HlsVideoModule.setValueAsync(value);
}

const emitter = new EventEmitter(HlsVideoModule ?? NativeModulesProxy.HlsVideo);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { HlsVideoView, HlsVideoViewProps, ChangeEventPayload };
