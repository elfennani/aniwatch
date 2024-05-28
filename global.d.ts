import "@storybook/types"

declare module "@storybook/types" {
  interface Parameters {
    layout?: "centered";
    padding?: "disabled"
  }
}