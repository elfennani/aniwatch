import Tabs from "@/components/tabs";
import Text from "@/components/text";
import { Meta, StoryObj } from "@storybook/react";
import { Parameters } from "@storybook/types";

const TabsExample = () => {
  return (
    <Tabs>
      <Tabs.Screen name="Hello">
        <Text className="text-red-500">Hello World 1</Text>
      </Tabs.Screen>
      <Tabs.Screen name="World">
        <Text>Hello World 2</Text>
      </Tabs.Screen>
      <Tabs.Screen name="Again">
        <Text>Hello World 3</Text>
      </Tabs.Screen>
    </Tabs>
  );
};

const meta: Meta<typeof TabsExample> = {
  title: "Tabs",
  component: TabsExample,
  parameters: {
    layout: "centered",
    padding: "disabled",
  } satisfies Parameters,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
