const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry:'./app/javascripts/app.js',
//  entry:'./app/javascripts/unslider.min.js',
  //entry:'./app/javascripts/jquery-1.11.1.min.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" }
    ]),
  //  new CopyWebpackPlugin([
  //    { from: './app/home.html', to: "home.html" }
  //  ]),
   // new CopyWebpackPlugin([
   //   { from: './app/bitcheck.html', to: "bitcheck.html" }
   // ])
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
  //    { test:/\.(png)|(jpg)|(gif)$/,
//                use: [
  //                       {
  //                          loader: "url-loader",
    //                        options: {
    //                            limit:90000,   //小于50K的 都打包
  //                              name:"[hash:8].[name].[ext]",
    // /                           publicPath:"./app/images/",  //替换CSS引用的图片路径 可以替换成爱拍云上的路径
    //                            outputPath:"images/"        //生成之后存放的路径
    ///                        }
    //                }
    //            ]
  //        },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}
