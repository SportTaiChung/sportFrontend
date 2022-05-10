const path = require('path');
function resolve(dir) {
  return path.join(__dirname, './', dir);
}

module.exports = {
  // eslint錯誤,不會使得編譯失敗
  lintOnSave: false,
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: {
      '/data': {
        target: `${process.env.VUE_APP_DEV_DOMAIN}/`,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/data': '',
        },
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
           @import "@/style/index.scss";
           @import "@/style/animateOverWrite.scss";
        `,
      },
    },
  },

  chainWebpack(config) {
    config.module.rule('svg').exclude.add(resolve('src/icons')).end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();
  },
  outputDir: '../web_pages',
};
