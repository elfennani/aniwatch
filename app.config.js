export default ({ config }) => ({
  expo: {
    name: "AniWatch",
    slug: "aniwatch",
    version: "1.4.0",
    icon: "./assets/images/icon.png",
    scheme: "aniwatch",
    userInterfaceStyle: "automatic",
    platforms: ["android"],
    primaryColor: "#a855f7",
    backgroundColor: "#18181b",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#18181b",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      runtimeVersion: {
        policy: "appVersion",
      },
    },
    android: {
      package: "com.elfen.aniwatch",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#18181b",
      },
      runtimeVersion: "1.4.0",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      [
        "expo-screen-orientation",
        {
          initialOrientation: "PORTRAIT_UP",
        },
      ],
      "expo-font",
      "expo-router",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: { origin: false },
      eas: { projectId: "21ec2229-aea9-4ec3-99cc-91dda263fdf4" },
      storybookEnabled: process.env.STORYBOOK_ENABLED,
    },
    updates: {
      requestHeaders: {
        "expo-channel-name": "production",
      },
      url: "https://u.expo.dev/21ec2229-aea9-4ec3-99cc-91dda263fdf4",
    },
  },
});