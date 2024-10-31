const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');
const webpack = require('webpack');


module.exports = {
    mode: 'development', // или 'production'
    devtool: 'eval-source-map',  // Для улучшения отладки и вывода ошибок
    entry: './src/index.js',  // Точка входа в ваше React-приложение
    output: {
        path: path.resolve(__dirname, '../../static/django_spa_admin/'),
        filename: 'bundle.js',  // Собранный файл
        publicPath: '/static/django_spa_admin/',  // Используется для доступа к бандлам через Django
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,  // Обработка JavaScript и JSX файлов
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,  // Обработка CSS файлов
                use: ['style-loader', 'css-loader'],  // Используем loaders для обработки CSS
            },
            
        ],
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, '../static/django_spa_admin/'),  // Путь к статическим файлам
        },
        devMiddleware: {
            publicPath: '/static/django_spa_admin/',  // Используется для указания публичного пути для DevServer
        },
        hot: true,  // Включает горячую замену модулей
        headers: { 'Access-Control-Allow-Origin': '*' },  // Для разрешения CORS
        historyApiFallback: true,  // Для корректной работы с react-router
        client: {
            overlay: {
                warnings: true,
                errors: true,  // Показывать ошибки на экране
            },
        },
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),  // Добавляем плагин HMR
        new BundleTracker({
            path: path.resolve(__dirname, '../../static/django_spa_admin/'),  // Путь для сохранения webpack-stats.json
            filename: 'webpack-stats.json',  // Имя файла
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],  // Позволяет опускать расширения при импорте
    },
};
