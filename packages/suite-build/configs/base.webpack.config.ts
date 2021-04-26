import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import alias from '../utils/alias';
import { assetPrefix, project, isDev, isAnalyzing } from '../utils/env';
import { getRevision } from '../utils/git';
import { generateCacheGroups } from '../utils/suite';

import pkgFile from '../../suite-desktop/package.json';

const gitRevision = getRevision();
const suiteCacheGroups = generateCacheGroups([
    'components',
    'views',
    'actions',
    'reducers',
    'utils',
    'hooks',
    'support',
    'middlewares',
    'constants',
    'services',
    'config',
    'storage',
]);

const config: webpack.Configuration = {
    mode: 'production',
    target: 'browserslist',
    devtool: false,
    output: {
        publicPath: `${assetPrefix}/`,
        filename: 'js/[name].[contenthash:8].js',
        chunkFilename: 'js/[id].[contenthash:8].js',
        assetModuleFilename: `assets/[hash][ext][query]`,
        pathinfo: false,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: ['node_modules'],
        alias,
        fallback: {
            // Polyfills API for NodeJS libraries in the browser
            crypto: require.resolve('crypto-browserify'),
            os: require.resolve('os-browserify/browser'),
            path: require.resolve('path-browserify'),
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer'),
            process: require.resolve('process'),
            // For Google OAuth library to work
            child_process: false,
            fs: false,
            net: false,
            tls: false,
        },
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                react: {
                    chunks: 'initial',
                    name: 'react',
                    test: /[\\/]node_modules[\\/]react/,
                },
                vendors: {
                    chunks: 'initial',
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/](?!react)/,
                },
                components: {
                    chunks: 'initial',
                    name: 'components',
                    test: /[\\/]packages[\\/]components[\\/]/,
                },
                ...suiteCacheGroups,
            },
        },
    },
    performance: {
        maxAssetSize: 10 * 1000 * 1000,
        maxEntrypointSize: 1000 * 1000,
    },
    module: {
        rules: [
            // TypeScript/JavaScript
            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['@babel/preset-react', '@babel/preset-typescript'],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            [
                                'babel-plugin-styled-components',
                                {
                                    displayName: true,
                                    preprocess: true,
                                },
                            ],
                            ...(isDev ? ['react-refresh/babel'] : []),
                        ],
                    },
                },
            },
            // Workers
            {
                test: /\/workers\/(.*).ts$/,
                use: [
                    {
                        loader: 'worker-loader',
                        options: {
                            filename: 'static/worker.[contenthash].js',
                        },
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-typescript'],
                        },
                    },
                ],
            },
            // Images
            {
                test: /\.(gif|jpe?g|png|svg)$/,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new webpack.DefinePlugin({
            'process.browser': true,
            'process.env': JSON.stringify(process.env),
            'process.env.SUITE_TYPE': JSON.stringify(project),
            'process.env.VERSION': JSON.stringify(pkgFile.version),
            'process.env.COMMITHASH': JSON.stringify(gitRevision),
            'process.env.ASSET_PREFIX': JSON.stringify(assetPrefix),
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process',
        }),
        isAnalyzing &&
            new BundleAnalyzerPlugin({
                openAnalyzer: false,
            }),
    ].filter(Boolean),
};

export default config;
