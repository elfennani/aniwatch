import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system";
import { FlashList } from "@shopify/flash-list";
import { Iconify } from "react-native-iconify";
import { filesize as format } from "filesize";
import { ResizeMode, Video } from "expo-av";
import Text from "@/components/text";
import { SafeAreaView } from "react-native-safe-area-context";

const Item = ({
  item,
  all,
}: {
  item: FileSystem.FileInfo;
  all: FileSystem.FileInfo[];
}) => {
  let fileName = decodeURIComponent(item.uri.split("/").pop() || "");
  const fileSize = (item as any)?.size;

  if (item.isDirectory)
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => {
          router.push(`/file-browser/${encodeURIComponent(item.uri)}`);
        }}
      >
        <Iconify
          icon="material-symbols-light:folder-sharp"
          color="#c8c8c8"
          size={24}
        />
        <View style={{ gap: 2 }}>
          <Text style={styles.name}>{fileName}</Text>
          {!!fileSize && (
            <Text style={{ fontSize: 10, opacity: 0.5 }}>
              {format(fileSize)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => {}}
    >
      <Iconify
        icon="material-symbols-light:file-present"
        color="#c8c8c8"
        size={24}
      />
      <Text style={styles.name}>{fileName}</Text>
    </TouchableOpacity>
  );
};

type Params = {
  path: string;
  title?: string;
};

const Zip = () => {
  const { path, title } = useLocalSearchParams<Params>();
  const { data } = useQuery({
    queryKey: ["folder", path],
    queryFn: async () => {
      let pathDecoded = decodeURIComponent(path!);
      const dirPath = pathDecoded.startsWith("file://")
        ? pathDecoded
        : `file://${pathDecoded}`;

      const dir = await FileSystem.readDirectoryAsync(dirPath);
      const data = await Promise.all(
        dir.map((file) => {
          return FileSystem.getInfoAsync(`${dirPath}/${file}`, {
            size: true,
          });
        })
      );
      return data.filter(
        (item) =>
          !["mmkv", "expo", "dev"].some((ext) =>
            item.uri.toLowerCase().includes(ext.toLowerCase())
          )
      );
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title:
            title?.replace(".zip", "") ||
            decodeURIComponent(path!).split("/").pop(),
        }}
      />
      <FlashList
        keyboardShouldPersistTaps="always"
        data={data}
        renderItem={({ item }) => <Item item={item} all={data || []} />}
        estimatedItemSize={100}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />
    </SafeAreaView>
  );
};

export default Zip;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 4,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  fileInfo: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  name: {
    flex: 1,
  },
});
