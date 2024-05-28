import ListingItem from "@/components/listing-item";
import Tabs from "@/components/tabs";
import Text from "@/components/text";
import MediaStatus from "@/interfaces/MediaStatus";
import { Meta, StoryObj, Parameters } from "@storybook/react/*";
import { ComponentProps } from "react";
import { TouchableOpacity } from "react-native";
import { Iconify } from "react-native-iconify";
import { purple } from "tailwindcss/colors";

const meta = {
  title: "Listing",
  component: ListingItem,
  parameters: {
    layout: "centered",
  },

  argTypes: {
    onPrimaryPress: { type: "function", name: "onPlay" },
    onSecondaryPress: { type: "function", name: "onPress" },
    title: { type: "string" },
    status: {
      type: "string",
      options: [
        "COMPLETED",
        "CURRENT",
        "DROPPED",
        "PAUSED",
        "PLANNING",
        "REPEATING",
      ],
    },
  },
} satisfies Meta<typeof ListingItem>;

export default meta;

type Story = StoryObj<typeof ListingItem>;

const props: ComponentProps<typeof ListingItem> = {
  type: "list",
  thumbnail:
    "https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
  status: "COMPLETED",
  subtitle: "Movie",
  title: "Dune (2021)",
  onPrimaryPress: () => console.log("Primary"),
  onSecondaryPress: () => console.log("Secondary"),
};

export const ListItem: Story = {
  args: {
    ...props,
    type: "list",
  },
};

export const ListAltItem: Story = {
  args: {
    ...props,
    type: "list-alt",
    title: "Episode 1",
    subtitle: "24m • Dub",
    listAltTailing: (
      <TouchableOpacity hitSlop={16}>
        <Iconify
          icon="material-symbols-light:download"
          size={24}
          color={purple[500]}
        />
      </TouchableOpacity>
    ),
  },
};

export const GridItem: Story = {
  args: {
    ...props,
    type: "grid",
  },
};

export const CarouselItem: Story = {
  args: {
    ...props,
    type: "carousel",
  },
};
