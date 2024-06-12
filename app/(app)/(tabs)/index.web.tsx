import { ScrollView, View } from "react-native";
import React from "react";
import HomeTab from "@/components/screens/home-tab";
import useViewerQuery from "@/api/use-viewer-query";
import { router } from "expo-router";
import Head from "expo-router/head";

type Props = {};

const HomeWeb = (props: Props) => {
  const { data: viewer } = useViewerQuery();

  return (
    <>
      <Head>
        <title>AniWatch • Home</title>
      </Head>
      <HomeTab
        viewerId={viewer?.id!}
        onPushTab={(route) => {
          router.push("/" + route);
        }}
      />
    </>
  );
};

export default HomeWeb;
