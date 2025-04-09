const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
    mode: "development",
    entry: './src/app.ts',

    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9001,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin ({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/static/images", to: "images"},
                {from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "css"},
                {from: "./node_modules/flatpickr/dist/flatpickr.min.css", to: "css"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", to: "js"},
                {from: "./node_modules/flatpickr/dist/flatpickr.min.js", to: "js"},
                {from: "./node_modules/chart.js/dist/chart.umd.js", to: "js"},
            ],
        }),
        new HtmlWebpackPlugin({
            template: "./index.html",
        })
    ],

};