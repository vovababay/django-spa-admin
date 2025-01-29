const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    entry: './src/app/index.js',
    mode: 'development',
    devtool: 'eval-source-map',
    output: {
        path: path.resolve(__dirname, '../static/django_spa_admin/js/'),
        filename: 'bundle.js',
        publicPath: '/static/django_spa_admin/js/',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
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
            publicPath: '/static/django_spa_admin/js/',
            writeToDisk: true,
        },
        compress: true,
        hot: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: true,
    },
    plugins: [
        new BundleTracker({
            path: path.resolve(__dirname),
            filename: './webpack-stats.json',
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    }
};
