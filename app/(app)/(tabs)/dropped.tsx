import React from "react";
import useViewerQuery from "@/api/use-viewer-query";
import MediaByStatus from "@/components/screens/media-by-status-tab";
import Head from "expo-router/head";

type Props = {};

const HomeWeb = (props: Props) => {
  const { data: viewer } = useViewerQuery();

  return (
    <>
      <Head>
        <title>AniWatch • Dropped</title>
      </Head>
      <MediaByStatus status="DROPPED" viewerId={viewer?.id!} />
    </>
  );
};

export default HomeWeb;
