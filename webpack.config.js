'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const TerserPlugin = require('terser-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function (env, args = {}) {
    let mode = args.mode || 'development';
    const isAnalyzer = env.analyzer;

    let config = {
        mode,
        entry: {
            index: './src/index.ts',
        },
        context: __dirname,
        target: 'webworker',
        resolve: {
            extensions: ['.ts', '.js'],
        },
        stats: isAnalyzer ? 'normal' : 'errors-warnings',
        output: {
            clean: true, // 在生成文件之前清空 output 目录
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    resourceQuery: { not: [/raw/] },
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-typescript'],
                        plugins: [['@babel/plugin-transform-typescript', { allowNamespaces: true }]],
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /\.jsx?$/,
                    resourceQuery: { not: [/raw/] },
                    loader: 'babel-loader',
                    include: [
                        path.join(__dirname, 'src'),
                        path.join(__dirname, 'example'),
                        /node_modules[\\\/](.+[\\\/])*(html-to-react)[@\\\/]+/,
                    ],
                },
                {
                    test: /\.less$/,
                    resourceQuery: { not: [/raw/] },
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: false,
                                lessOptions: {
                                    math: 'strict',
                                    plugins: [
                                        new LessPluginAutoPrefix({
                                            browsers: ['ie >= 11', 'last 2 versions'],
                                        }),
                                    ],
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    resourceQuery: { not: [/raw/] },
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    resourceQuery: { not: [/raw/] },
                    type: 'asset/inline',
                },
                {
                    test: /\.(svg|woff(2)?)(\?[a-z0-9]+)?$/,
                    resourceQuery: { not: [/raw/] },
                    type: 'asset/inline',
                },
                {
                    test: /\.md$/,
                    use: [
                        {
                            loader: 'html-loader',
                        },
                        {
                            loader: 'markdown-loader',
                        },
                    ],
                },
                {
                    test: /\.mdx$/,
                    use: ['babel-loader', '@mdx-js/loader'],
                },
                {
                    resourceQuery: /component-metadata-ts-loader/,
                    use: [
                        {
                            loader: 'component-metadata-ts-loader',
                        },
                    ],
                },
                {
                    test: /\.mjs$/,
                    type: 'javascript/auto',
                    resolve: {
                        fullySpecified: false,
                    },
                },
                {
                    resourceQuery: /raw/,
                    type: 'asset/source',
                },
                {
                    resourceQuery: /inline/,
                    use: [
                        {
                            loader: 'url-loader',
                        },
                    ],
                },
            ],
        },
        plugins: [
            new CaseSensitivePathsPlugin(),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'shiki/dist/*',
                        context: path.resolve(__dirname, 'node_modules'),
                        to: 'static/',
                    },
                    {
                        from: 'shiki/languages/*',
                        context: path.resolve(__dirname, 'node_modules'),
                        to: 'static/',
                    },
                    {
                        from: 'shiki/themes/*',
                        context: path.resolve(__dirname, 'node_modules'),
                        to: 'static/',
                    },
                ],
            }),
        ],
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    terserOptions: {
                        format: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                }),
                new CssMinimizerPlugin({
                    parallel: true,
                }),
            ],
        },
    };

    if (!isAnalyzer) {
        config.plugins.push(
            ...[
                new ForkTsCheckerWebpackPlugin({
                    async: false,
                }),
                new ForkTsCheckerNotifierWebpackPlugin({
                    title: 'TypeScript',
                    excludeWarnings: true,
                    skipSuccessful: true,
                }),
            ]
        );
    }

    return config;
};
