import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import Constants from "expo-constants";

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = (require as any).context("./app");
  return <ExpoRoot context={ctx} />;
}

// Default to rendering your app
let AppEntryPoint = App;

// Render Storybook if storybookEnabled is true
if (Constants.expoConfig?.extra?.storybookEnabled === "true") {
  AppEntryPoint = require("./.storybook").default;
}

registerRootComponent(AppEntryPoint);
