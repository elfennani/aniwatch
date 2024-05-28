import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import React, {
  ComponentProps,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { FlashList } from "@shopify/flash-list";
import Text from "./text";
import Box from "./box";
import { zinc } from "tailwindcss/colors";

type Props = {
  children: ReactElement<typeof Tab> | ReactElement<typeof Tab>[];
};
const SCREENS = ["Home", "Completed", "Planning", "Dropped", "Rewatched"];

const Tabs = ({ children }: Props) => {
  const flashList = useRef<FlashList<TabProps>>(null);
  const titleFlatlist = useRef<FlatList>(null);
  const { width } = useWindowDimensions();
  const offsetRef = useRef(0);
  const [pagePosition, setPagePosition] = useState(0);
  const [textHeight, setTextHeight] = useState<number>();
  const scheme = useColorScheme();
  const dark = scheme === "dark";

  const tabs = React.Children.map(
    children,
    (child, index) => child.props as unknown as ComponentProps<typeof Tab>
  );

  const tranformToRange = (index: number, min: number, max: number) => {
    let far = Math.abs(pagePosition - index);
    if (far > 0.5) far = 0.5;
    far = 2 * (1 - far - 0.5);

    return min + (max - min) * far;
  };

  useEffect(() => {
    const index = pagePosition;
    titleFlatlist.current?.scrollToIndex({
      index,
      animated: false,
      viewOffset: 24,
    });
  }, [pagePosition]);

  const scrollToIndex = (index: number) => () =>
    flashList.current?.scrollToIndex({ index, animated: true });

  type OnScrollCallback = (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  const onScroll: OnScrollCallback = ({ nativeEvent }) => {
    const x = nativeEvent.contentOffset.x;
    const width = nativeEvent.layoutMeasurement.width;
    let page = x / width;
    const pageRounded = Math.round(page);

    if (Math.abs(pageRounded - page) < 0.0001) page = pageRounded;

    offsetRef.current = x;
    setPagePosition(page);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: textHeight }}>
        <FlatList
          pagingEnabled
          ref={titleFlatlist}
          data={tabs}
          extraData={{ pagePosition }}
          overScrollMode="never"
          horizontal
          showsHorizontalScrollIndicator={false}
          // contentContainerStyle={{ backgroundColor: theme.colors.background }}
          contentContainerClassName="bg-white dark:bg-black"
          decelerationRate="normal"
          renderItem={({ index, item: screen }) => {
            const opacity = tranformToRange(index, 0.33, 1);
            const textShadowRadius = tranformToRange(index, 0, 12);
            return (
              <View style={[index == tabs.length - 1 && { width }]}>
                <Text
                  className="font-semibold overflow-visible"
                  onLayout={(e) => setTextHeight(e.nativeEvent.layout.height)}
                  onPress={scrollToIndex(index)}
                  style={[{ opacity, padding: 16 }]}
                >
                  {screen.name}
                </Text>
              </View>
            );
          }}
        />
      </View>

      <FlashList
        ref={flashList}
        data={tabs}
        horizontal
        estimatedItemSize={width}
        pagingEnabled
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        // contentContainerClassName="bg-white dark:bg-zinc-900"
        contentContainerStyle={{ backgroundColor: dark ? "black" : "white" }}
        decelerationRate="normal"
        onScroll={onScroll}
        renderItem={({ item }) => (
          <View style={{ width }}>{item.children}</View>
        )}
      />
    </View>
  );
};

interface TabProps {
  name: string;
  children: ReactNode | ReactNode[];
}

const Tab: React.FC<TabProps> = (props: TabProps) => props.children;

Tabs.Screen = Tab;

export default Tabs;

const styles = StyleSheet.create({});
