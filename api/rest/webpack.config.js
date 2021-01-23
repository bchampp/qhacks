const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    mode: "development",
    resolve: {
        extensions: [".mjs", ".json", ".js"],
        symlinks: false,
        cacheWithContext: false,
    },
    entry: "./src/handler.js",
    output: {
        libraryTarget: "commonjs",
        path: path.join(__dirname, ".webpack"),
        filename: "[name].js",
    },
    target: "node",
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.(tsx?)$/,
                loader: "ts-loader",
                exclude: [
                    [
                        path.resolve(__dirname, "node_modules"),
                        path.resolve(__dirname, ".serverless"),
                        path.resolve(__dirname, ".webpack"),
                    ],
                ],
                options: {
                    transpileOnly: true,
                    experimentalWatchApi: true,
                },
            },
        ],
    },
};