import React from "react";
import useViewerQuery from "@/api/use-viewer-query";
import MediaByStatus from "@/components/screens/media-by-status-tab";

type Props = {};

const HomeWeb = (props: Props) => {
  const { data: viewer } = useViewerQuery();

  return <MediaByStatus status="COMPLETED" viewerId={viewer?.id!} />;
};

export default HomeWeb;
