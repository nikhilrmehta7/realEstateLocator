var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname, '/client/src/app.jsx'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '/client/dist')
    },
    node: {
        fs: 'empty'
    },
    plugins: [    
        new webpack.DefinePlugin({           
          GOOGLE_MAP_API: JSON.stringify(process.env.GOOGLE_MAP_API)      
        })
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                include: path.join(__dirname, '/client/src'),
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};