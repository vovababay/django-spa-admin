const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, '../static/django_spa_admin/js/'),
        filename: 'bundle.js',
        publicPath: '/static/',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, '../static/django_spa_admin/js/'),
        },
        devMiddleware: {
            publicPath: '/static/',
        },
        hot: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: true,
        client: {
            overlay: {
                warnings: true,
                errors: true,
            },
            logging: 'info',
        }

    },
    plugins: [
        new BundleTracker({
            path: path.resolve(__dirname),
            filename: './frontend/webpack-stats.json',
            log: true,
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};

// Настройка компилятора
const compiler = webpack(module.exports);

compiler.hooks.done.tap('DonePlugin', (stats) => {
    const info = stats.toJson();

    console.log('Compiled assets:', info.assets.map(asset => asset.name).join(', '));
    console.log('Output path:', info.outputPath);
});
