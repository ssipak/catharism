// Fallback letting `jest` run the tests without prebuilding the code
export const dev =
  typeof __DEV__ !== "undefined"
    ? __DEV__
    : process.env.NODE_ENV === "development";
