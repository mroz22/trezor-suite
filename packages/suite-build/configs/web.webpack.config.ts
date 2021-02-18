import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import routes from '../../suite/src/config/suite/routes';
import { FLAGS } from '../../suite/src/config/suite/features';
import pkgFile from '../../suite-web/package.json';

import base from './base.webpack.config';
import { assetPrefix, isDev } from '../utils/env';
import { getRevision } from '../utils/git';

const gitRevision = getRevision();
const baseDir = path.join(__dirname, '..', '..', 'suite-web');

const config: webpack.Configuration = merge(base, {
    entry: {
        app: path.join(baseDir, 'src', 'index.tsx'),
    },
    output: {
        path: path.join(baseDir, 'build'),
    },
    module: {
        rules: [
            // CSS
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                localIdentName: '[name]__[local]',
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.browser': true,
            'process.env': JSON.stringify(process.env),
            'process.env.SUITE_TYPE': JSON.stringify('web'),
            'process.env.VERSION': JSON.stringify(pkgFile.version),
            'process.env.COMMITHASH': JSON.stringify(gitRevision),
            'process.env.ASSET_PREFIX': JSON.stringify(assetPrefix),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, '..', '..', 'suite-data', 'files'),
                    to: path.join(baseDir, 'build', 'static'),
                },
                {
                    from: path.join(baseDir, 'src', 'static', 'manifest.json'),
                    to: path.join(baseDir, 'build', 'manifest.json'),
                    transform: (content: any) =>
                        content.toString().replace(/\{assetPrefix\}/g, assetPrefix),
                },
            ],
            options: {
                concurrency: 100,
            },
        }),
        // Html files
        ...routes.map(
            route =>
                new HtmlWebpackPlugin({
                    minify: !isDev,
                    template: path.join(baseDir, 'src', 'static', 'index.html'),
                    templateParameters: {
                        assetPrefix,
                        isOnionLocation: FLAGS.ONION_LOCATION_META,
                    },
                    filename: path.join(baseDir, 'build', route.pattern, 'index.html'),
                }),
        ),
        new HtmlWebpackPlugin({
            minify: !isDev,
            template: path.join(baseDir, 'src', 'static', '404.html'),
            templateParameters: {
                assetPrefix,
                isOnionLocation: FLAGS.ONION_LOCATION_META,
            },
            filename: path.join(baseDir, 'build', '404.html'),
        }),
        // PWA
        ...(FLAGS.PWA
            ? [
                  new WorkboxPlugin.GenerateSW({
                      swDest: 'sw.js',
                      clientsClaim: true,
                      skipWaiting: true,
                      maximumFileSizeToCacheInBytes: 10 * 1000 * 1000,
                      runtimeCaching: [
                          {
                              urlPattern: /.*\.js(.map)?$/,
                              handler: 'NetworkFirst',
                              options: {
                                  cacheName: 'js-cache',
                              },
                          },
                          {
                              urlPattern: '/(news|connect).trezor.io/',
                              handler: 'NetworkFirst',
                              options: {
                                  cacheName: 'api-cache',
                              },
                          },
                          {
                              urlPattern: /\.(gif|jpe?g|png|svg)$/,
                              handler: 'CacheFirst',
                              options: {
                                  cacheName: 'image-cache',
                                  cacheableResponse: {
                                      statuses: [0, 200],
                                  },
                              },
                          },
                      ],
                  }),
              ]
            : []),
        ...(isDev
            ? [new webpack.HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()]
            : []),
    ],
});

module.exports = config;
