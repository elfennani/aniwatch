import { View, Text } from "react-native";
import React, { ComponentProps } from "react";
import { Iconify } from "react-native-iconify";
import MediaStatus from "@/interfaces/MediaStatus";

type Props = Omit<ComponentProps<typeof Iconify>, "icon"> & {
  status: MediaStatus;
};

const StatusIcon = ({ status, ...props }: Props) => {
  if (status == "COMPLETED")
    return <Iconify icon="material-symbols-light:check" {...props} />;
  if (status == "CURRENT")
    return (
      <Iconify
        icon="material-symbols-light:smart-display-outline-sharp"
        {...props}
      />
    );
  if (status == "DROPPED")
    return <Iconify icon="material-symbols-light:remove-done" {...props} />;
  if (status == "PAUSED")
    return (
      <Iconify
        icon="material-symbols-light:pause-presentation-outline-sharp"
        {...props}
      />
    );
  if (status == "PLANNING")
    return (
      <Iconify icon="material-symbols-light:playlist-add-check" {...props} />
    );
  if (status == "REPEATING")
    return <Iconify icon="material-symbols-light:autoplay" {...props} />;

  return null;
};

export default StatusIcon;
