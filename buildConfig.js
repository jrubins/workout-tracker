const path = require('path')

module.exports = {
  serverPort: 9999,
  paths: {
    base: path.resolve(__dirname, '.'),

    babelCache: path.resolve(__dirname, '.babel-cache'),

    dist: path.resolve(__dirname, 'dist'),

    src: {
      base: path.resolve(__dirname, 'src'),
      favicon: path.resolve(__dirname, 'src/assets/images/favicon.ico'),
      mainJs: path.resolve(__dirname, 'src/main.jsx'),
      html: path.resolve(__dirname, 'src/views/index.html'),
    },
  },
}
