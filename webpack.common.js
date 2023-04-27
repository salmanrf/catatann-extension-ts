/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    popup: "./src/popup/popup.ts",
    content_script: "./src/content-script/content_script.ts",
    service_worker: "./src/service-worker/background.ts",
  },
  mode: "development",
  devtool: "source-map",
  optimization: {
    usedExports: true,
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          process.env.NODE_ENV !== "production" ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: "asset/resource" },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [["@babel/plugin-transform-react-jsx"]],
          },
        },
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: ["node_modules", path.join(__dirname, ".")],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: "./manifest.json", to: "manifest.json" }],
    }),
    new HtmlWebpackPlugin({
      filename: "popup.html",
      template: "./src/popup/index.html",
      chunks: ["popup"],
    }),
    new ForkTsCheckerWebpackPlugin(),
    new ESLintPlugin({
      extensions: [".tsx", ".ts", ".js"],
      exclude: "node_modules",
    }),
  ],
};
