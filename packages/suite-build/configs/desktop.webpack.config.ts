import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import { FLAGS } from '../../suite/src/config/suite/features';
import pkgFile from '../../suite-desktop/package.json';

import base from './base.webpack.config';
import { assetPrefix, isDev, launchElectron } from '../utils/env';
import { getRevision } from '../utils/git';
import ShellExecPlugin from '../plugins/shell-exec-plugin';

const gitRevision = getRevision();
const baseDir = path.join(__dirname, '..', '..', 'suite-desktop');

const config: webpack.Configuration = merge(base, {
    target: 'web',
    devServer: {
        writeToDisk: true,
        port: 8000,
    },
    entry: {
        app: path.join(baseDir, 'src', 'index.tsx'),
    },
    output: {
        path: path.join(baseDir, 'build'),
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.browser': true,
            'process.env': JSON.stringify(process.env),
            'process.env.SUITE_TYPE': JSON.stringify('desktop'),
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
            ],
            options: {
                concurrency: 100,
            },
        }),
        new HtmlWebpackPlugin({
            minify: !isDev,
            template: path.join(baseDir, 'src', 'static', 'index.html'),
            templateParameters: {
                assetPrefix,
                isOnionLocation: FLAGS.ONION_LOCATION_META,
            },
            filename: path.join(baseDir, 'build', 'index.html'),
        }),
        ...(isDev
            ? [new webpack.HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()]
            : []),
        new ShellExecPlugin({
            cwd: baseDir,
            runAfterBuild: [
                `chmod -R +x ${path.join(baseDir, 'build', 'static', 'bin')}`,
                ...(launchElectron ? ['yarn run dev:prepare && yarn run dev:run'] : []),
            ],
        }),
    ],
});

module.exports = config;
