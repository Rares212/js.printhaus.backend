const nodeExternals = require("webpack-node-externals");
const { RunScriptWebpackPlugin } = require("run-script-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = function (options, webpack) {
    return {
        ...options,
        entry: ["webpack/hot/poll?100", options.entry],
        devtool: "inline-source-map",
        externals: [
            nodeExternals({
                allowlist: ["webpack/hot/poll?100"]
            })
        ],
        plugins: [
            ...options.plugins,
            new webpack.HotModuleReplacementPlugin(),
            new webpack.WatchIgnorePlugin({
                paths: [/\.js$/, /\.d\.ts$/]
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "apps/**/*.env",
                        to: ""
                    }
                ]
            }),
            new RunScriptWebpackPlugin({
                name: options.output.filename,
                autoRestart: false,
                nodeArgs: ["--inspect=0.0.0.0:9229"]
            })
        ],
        // module: {
        //     rules: [
        //         {
        //             test: /\.(?:js|mjs|cjs)$/,
        //             exclude: /node_modules/,
        //             use: {
        //                 loader: 'babel-loader',
        //                 options: {
        //                     presets: [
        //                         ['@babel/preset-env', { targets: "defaults" }]
        //                     ]
        //                 }
        //             }
        //         },
        //     ]
        // }
    };
};
