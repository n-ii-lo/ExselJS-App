const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`

console.log('isProd', isProd);
console.log('isDev', isDev);

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './index.js',
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@core': path.resolve(__dirname, 'src/core'),
        }
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'), // Новый аналог contentBase
        },
        compress: true,
        port: 4200,
        open: true,
        hot: isDev,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            minify: {
                collapseWhitespace: isProd,
                removeComments: isProd,
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'src', 'favicon.ico'), to: path.resolve(__dirname, 'dist') },
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: "usage", // Автоматически использовать нужные полифиллы
                                    corejs: 3             // Устанавливаем версию CoreJS
                                }
                            ]
                        ]
                    }
                }

            }
        ],
    },


}
