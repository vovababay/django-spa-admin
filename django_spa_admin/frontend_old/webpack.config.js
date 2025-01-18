const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    mode: 'development', // Режим разработки
    devtool: 'eval-source-map', // Быстрое создание source-map для отладки
    entry: './src/index.js', // Точка входа
    output: {
        path: path.resolve(__dirname, '../static/django_spa_admin/js/'), // Папка для сборки
        filename: 'bundle.js', // Имя итогового файла
        publicPath: '/static/django_spa_admin/js/', // Публичный путь для dev-server
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // Обработка JS/JSX файлов
                exclude: /node_modules/, // Исключение node_modules
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'], // Пресеты для ES6+ и React
                    },
                },
            },
            {
                test: /\.css$/, // Обработка CSS
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, '../static/django_spa_admin/js/'), // Папка для статических файлов
        },
        devMiddleware: {
            publicPath: '/static/django_spa_admin/js/', // Публичный путь
            writeToDisk: true, // Включение записи файлов на диск
        },
        hot: true, // Включение Hot Module Replacement (HMR)
        headers: { 'Access-Control-Allow-Origin': '*' }, // Для CORS
        historyApiFallback: true, // Поддержка React Router
    },
    plugins: [
        new BundleTracker({
            path: path.resolve(__dirname), // Путь к файлу статистики
            filename: './frontend/webpack-stats.json', // Имя файла статистики
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'], // Расширения файлов для импорта
    },
};
