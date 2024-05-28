const globSync = require("glob").sync;

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    globSync("./components/**/*.{js,jsx,ts,tsx}"),
    "./stories/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],

  theme: {
    fontWeight: {},
    fontFamily: {
      regular: ["regular"],
      medium: ["medium"],
      semibold: ["semibold"],
    },
    extend: {},
  },
  plugins: [],
};
