const path = require("path");
const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  mode: "development",
  target: "web",
  entry: "./src/index.js",
  devtool: "eval-source-map",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    static: path.resolve(__dirname, "public"), // make sure this folder exists
    port: 8080,
    open: true,
    hot: true,
  },
  resolve: {
    alias: {
      // cover both specifiers
      "node:events": "events",
      events: require.resolve("events/"),
    },
    fallback: {
      events: require.resolve("events/"),
    },
  },
  plugins: [
    new NodePolyfillPlugin(),
    // hard redirect any request for "node:events" → "events"
    new webpack.NormalModuleReplacementPlugin(/^node:events$/, (resource) => {
      resource.request = "events";
    }),
  ],
};
