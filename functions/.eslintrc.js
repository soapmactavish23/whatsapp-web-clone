module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  ignorePatterns: [
    "index.js",
  ],
  rules: {
    "quotes": ["error", "double"],
    "max-len": ["error", {"code": 255}],
    "linebreak-style": ["error", process.platform === "win32" ? "windows" : "unix"],
  },
};
