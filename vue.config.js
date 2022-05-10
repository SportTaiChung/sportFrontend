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
  // 打包路徑
  // outputDir: '../web_pages',
};
