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
        <title>AniWatch • Completed</title>
      </Head>
      <MediaByStatus status="COMPLETED" viewerId={viewer?.id!} />
    </>
  );
};

export default HomeWeb;
