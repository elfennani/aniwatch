import {
  Animated,
  BackHandler,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import MediaStatus from "@/interfaces/MediaStatus";
import useBackgroundNotifications from "@/hooks/use-background-notifications";
import {
  NavigationState,
  Route,
  SceneMap,
  SceneRendererProps,
  TabView,
} from "react-native-tab-view";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeTab from "@/components/screens/home-tab";
import useViewerQuery from "@/api/use-viewer-query";
import MediaByStatus from "@/components/screens/media-by-status-tab";
import { usePathname } from "expo-router";

const status: MediaStatus[] = ["COMPLETED", "CURRENT"];
const routes: Route[] = [
  { key: "home", title: "Home" },
  { key: "completed", title: "Completed" },
  { key: "planned", title: "Planned" },
  { key: "dropped", title: "Dropped" },
];

type RenderTabBar = (
  props: SceneRendererProps & {
    navigationState: NavigationState<Route>;
  }
) => React.ReactNode;

const renderTabBar: RenderTabBar = ({
  position,
  navigationState,
  jumpTo,
  layout,
}) => {
  const flatList = useRef<FlatList>(null);
  const { top } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scheme = useColorScheme();
  const inputRange = navigationState.routes.map((_, i) => i);

  useEffect(() => {
    position.addListener(({ value }: { value: number }) => {
      flatList.current?.scrollToIndex({
        animated: true,
        index: value,
        viewOffset: 32,
      });
    });

    return () => position.removeAllListeners();
  }, [position]);

  return (
    <FlatList
      ref={flatList}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ paddingTop: top, height: 64 + top }}
      className="flex-none"
      contentContainerClassName="items-center gap-6 px-10"
      data={navigationState.routes}
      renderItem={({ item: route, index: i }) => {
        const outputRange = inputRange.map((index) => (index == i ? 1 : 0.33));
        const opacity = position.interpolate({ inputRange, outputRange });

        return (
          <TouchableOpacity hitSlop={8} onPress={() => jumpTo(route.key)}>
            <Animated.Text
              key={route.key}
              className="font-semibold dark:text-zinc-50 text-zinc-900"
              style={{
                opacity,
                textShadowColor:
                  scheme == "dark" ? "white" : "rgba(0,0,0,0.25)",
                textShadowRadius: 12,
                width:
                  i == navigationState.routes.length - 1
                    ? width - 48
                    : undefined,
              }}
            >
              {route.title}
            </Animated.Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const HomePage = () => {
  useBackgroundNotifications();
  const [index, setIndex] = useState(0);
  const { width } = useWindowDimensions();
  const scheme = useColorScheme();
  const backgroundColor = scheme == "dark" ? "black" : "white";
  const pathname = usePathname();

  const { data: viewer } = useViewerQuery();

  useEffect(() => {
    const { remove } = BackHandler.addEventListener("hardwareBackPress", () => {
      if (index != 0 && pathname == "/") {
        setIndex(0);
        return true;
      }

      return false;
    });

    return () => remove();
  }, [index, pathname]);

  const renderScene = useMemo(
    () =>
      SceneMap({
        home: () => (
          <HomeTab
            viewerId={viewer?.id!}
            onPushTab={(key) =>
              setIndex(routes.findIndex((route) => route.key == key))
            }
          />
        ),
        completed: () => (
          <MediaByStatus status="COMPLETED" viewerId={viewer?.id!} />
        ),
        planned: () => (
          <MediaByStatus status="PLANNING" viewerId={viewer?.id!} />
        ),
        dropped: () => (
          <MediaByStatus status="DROPPED" viewerId={viewer?.id!} />
        ),
      }),
    [viewer]
  );

  if (!viewer) return null;

  return (
    <TabView
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      initialLayout={{ width }}
      pagerStyle={{ backgroundColor }}
      style={{ backgroundColor }}
      lazy
      overScrollMode="never"
    />
  );
};

const styles = StyleSheet.create({});

export default HomePage;
