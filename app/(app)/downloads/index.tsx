import React from "react";
import Text from "@/components/text";
import { SafeAreaView } from "react-native-safe-area-context";
import SectionTitle from "@/components/section-title";
import { useTheme } from "@/ctx/theme-provider";
import useCurrentDownload from "@/hooks/use-current-download";
import { ScrollView, View } from "react-native";
import Box from "@/components/box";
import useDownloads from "@/hooks/use-downloads";

const DownloadScreen = () => {
  const { spacing } = useTheme();
  const [currentDownload] = useCurrentDownload();
  const [downloads] = useDownloads();

  return (
    <ScrollView>
      <SafeAreaView style={{ padding: spacing["xl"] }}>
        <Box>
          <SectionTitle style={{ marginBottom: 16 }}>
            Download Queue
          </SectionTitle>
        </Box>
        <Text style={{ paddingVertical: 8 }} variant="label">
          Currently Downloading
        </Text>
        {currentDownload ? (
          <Box background="card" padding="md" rounding="md">
            <Text>{currentDownload.downloadable.show.title.default}</Text>
            <Text>
              Episode {currentDownload.downloadable.episode} •{" "}
              {(currentDownload.progressPercent * 100).toFixed(1)}%
            </Text>
          </Box>
        ) : (
          <Text color="secondary" style={{ padding: 32, textAlign: "center" }}>
            Nothing is downloading
          </Text>
        )}
        <Text style={{ paddingVertical: 8, paddingTop: 32 }} variant="label">
          Queue
        </Text>
        {downloads &&
          downloads.map((download) => (
            <Box
              key={`${download.episode}-${download.show.id}`}
              background="card"
              padding="md"
              rounding="md"
            >
              <Text>{download.show.title.default}</Text>
              <Text>Episode {download.episode}</Text>
            </Box>
          ))}
      </SafeAreaView>
    </ScrollView>
  );
};

export default DownloadScreen;
