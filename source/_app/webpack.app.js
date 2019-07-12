/**
 * NOTE: THIS IS A SAMPLE.
 * Any configuration to be merged with 'webpack.config.babel.js' SHOULD BE ADDED TO '/source/_app/webpack.app.js'.
 * Add new dependencies like so:
 * "yarn add autoprefixer import-glob-loader css-loader node-sass postcss-loader postcss-flexbugs-fixes mini-css-extract-plugin sass-loader style-loader --dev"
 * or
 * "npm install autoprefixer import-glob-loader css-loader node-sass postcss-loader postcss-flexbugs-fixes mini-css-extract-plugin sass-loader style-loader --save-dev"
 */


const webpack = require("webpack");
const { getIfUtils } = require("webpack-config-utils");
const { resolve } = require("path");
const globby = require("globby");
const plConfig = require("../../patternlab-config.json");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = env => {
    const { ifProduction, ifDevelopment } = getIfUtils(env);
    const appNamespace = plConfig.app.namespace
        ? `$ns:${plConfig.app.namespace};`
        : ``;
    const app = {
        entry: {
            "js/pl-source": globby.sync(
                [
                    resolve(`${plConfig.paths.source.patterns}**/*.js`),
                    "!**/*.test.js"
                ],
                {
                    gitignore: true
                }
            )
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /node_modules/,
                        chunks: "initial",
                        name: "js/pl-source-vendor",
                        priority: 10,
                        enforce: true
                    }
                }
            }
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].css",
                disable: ifDevelopment()
            }),
            new webpack.DefinePlugin({
                NAMESPACE: appNamespace
            })
        ],
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        ifDevelopment('style-loader', MiniCssExtractPlugin.loader),
                        { loader: 'css-loader', options: { url: true, sourceMap: true } },
                        { loader: 'sass-loader', options: { sourceMap: true } },

                    ],


                }
            ]
        }
    };
    return app;
};
