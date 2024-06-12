import { ScrollView, View } from "react-native";
import React from "react";
import HomeTab from "@/components/screens/home-tab";
import useViewerQuery from "@/api/use-viewer-query";
import { router } from "expo-router";

type Props = {};

const HomeWeb = (props: Props) => {
  const { data: viewer } = useViewerQuery();

  return (
    <HomeTab
      viewerId={viewer?.id!}
      onPushTab={(route) => {
        router.push("/" + route);
      }}
    />
  );
};

export default HomeWeb;
