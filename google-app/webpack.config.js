const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GasPlugin = require('gas-webpack-plugin');

const getSrcPath = (filePath) => {
  const src = path.resolve(__dirname, 'src');
  return path.posix.join(src.replace(/\\/g, '/'), filePath);
};

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: getSrcPath('/index.js'),
  output: {
    filename: `[contenthash].gs`,
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  plugins: [
   new CopyWebpackPlugin({
     patterns: [
       {
         from: getSrcPath('**/*.html'),
         to: '[name][ext]',
         noErrorOnMissing: true,
       },
       {
         from: getSrcPath('../appsscript.json'),
         to: '[name][ext]',
       },
       // {
       //   from: getSrcPath('../functions/*.js'),
       //   to: '[name][ext]',
       //   noErrorOnMissing: true,
       // },
     ],
   }),
   new GasPlugin({
     comments: false
   }),
 ],
}
