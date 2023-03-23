// https://www.carlrippon.com/creating-react-app-with-typescript-eslint-with-webpack5/
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  mode: 'development',
  entry: {
    "chess-web": './src/index.tsx',
  },
  output: { 
    path: path.join(__dirname, 'dist'), 
    filename: '[name].[hash:8].js',
    publicPath: '/', 
    sourceMapFilename: "[name].[hash:8].js.map",
    chunkFilename: '[id].[hash:8].js'
  },
  resolve: {
    extensions: [
      '.tsx', 
      '.ts', 
      '.js', 
      '.jsx', 
      '.mjs',
      '.scss',
      '.svg',
      '.png',
      '.woff'
    ],
    alias: {
      '~': path.resolve(__dirname, 'src/'),
      "assets": path.resolve(__dirname, '../../assets/')
    },
  },
  devtool: 'source-map',
  devServer: {
    static: [{
      directory: path.join(__dirname, 'public'),
      publicPath: '/'
    }],
    historyApiFallback: true,
    port: 8080,
    open: ['/'],
    hot: true,
    watchFiles: ['../chess/src/**/*.ts*', 'src/**/*.ts*', 'src/**/*.scss'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {            
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp|mp4)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
          // brings in source maps for bundled dependincies
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
        template : path.join(__dirname, 'public', 'index.html'),
        filename: 'index.html',
        favicon: './public/favicon.ico',
    }),
    // https://answers.netlify.com/t/cant-access-environment-variables/20314/11
    // Need this for env to be read from netlify correactly
    new Dotenv({
      systemvars: true  
    }),
  ],
}