const path = require('path');

module.exports = {
    entry: [
        path.join(__dirname, 'src', 'entry.js')
    ],
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/build',
        filename: 'bundle.js'
    },
    devServer: {
        hot: true,
        inline: true,
        port: 9090
    },
    mode: 'development'
};

