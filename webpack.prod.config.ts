import * as path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import type { Configuration } from 'webpack';

const config: Configuration = {
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets/'),
    },
    extensions: ['.tsx', '.ts', '.js'],
    fallback: { path: require.resolve('path-browserify') },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'websitePets',
    libraryTarget: 'umd',
    clean: true,
  },
};

export default config;
